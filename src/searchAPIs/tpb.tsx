import { SearchProviderComponentProps, TPBRecord } from "../types";
import { Flex, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import IosSearch from "../components/ios/IosSearch";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import { SectionSM, useSearchFromParams } from "./yts";
import SeedsAndPeers from "../components/SeedsAndPeers";
import React, { useEffect, useMemo, useState } from "react";
import TorrentMovieData from "../components/TorrentMovieData";
import Filters from "../components/Filters";
import ReactGA from "react-ga";
import CategorySelect from "../components/CategorySelect";
import { TorrClient } from "../utils/TorrClient";

export type AliasList = { name: string; aliases?: string[] }[];

export const parseFromString = (string: string, aliases: AliasList) => {
  return aliases.find((option) => {
    let matchFound = string.toLowerCase().includes(option.name.toLowerCase());

    if (!matchFound) {
      matchFound = !!option.aliases?.find((alias) => {
        return string.toLowerCase().split(alias.toLowerCase()).length > 1;
      });
    }

    return matchFound;
  })?.name;
};

export const qualityAliases: AliasList = [
  {
    name: "720p",
    aliases: ["720"],
  },
  {
    name: "1080p",
    aliases: ["1080"],
  },
  {
    name: "4K",
    aliases: ["2160p"],
  },
];

export const typeAliases: AliasList = [
  {
    name: "BluRay",
    aliases: ["BluRay", "BDRip", "BrRip"],
  },
  {
    name: "Web",
    aliases: ["WEB", "WEB-DL", "WebRIP"],
  },
  {
    name: "HDRip",
    aliases: ["HDR", "DVDRip", "HDTV"],
  },
  {
    name: "SCR",
    aliases: ["SCR", "DVDSCR", "BR-Screener"],
  },
  {
    name: "CAM",
    aliases: ["CAM", "TS"],
  },
];

const devURL = "http://localhost:5005/";
const useLocalServer = false;

const ApiDomain =
  process.env.NODE_ENV === "development" && useLocalServer
    ? devURL
    : "https://iqbit.app/";

const TPBSearch = (props: SearchProviderComponentProps) => {
  const {
    mutate: search,
    reset,
    data,
    isLoading,
  } = useMutation(
    "tpbSearch",
    async () => {
      const { data } = await axios.get<TPBRecord[]>(
        `${ApiDomain}api/tpb/search`,
        {
          params: {
            query: props.searchState[0],
            category: props.category,
          },
        }
      );
      return data;
    },
    {
      onMutate: () =>
        ReactGA.event({ action: "executed", category: "search", label: "TPB" }),
      onSuccess: (data) => {
        props.onSearch && props.onSearch();

        let sourceList = new Set();

        data.forEach((torr) => {
          const type = parseFromString(torr.name, typeAliases);
          sourceList.add(type);
        });

        props.filterState.setSourceList(Array.from(sourceList) as string[]);
      },
    }
  );

  useSearchFromParams(search);

  useEffect(() => {
    reset();
  }, [props.category, reset]);

  const filteredMovies = useMemo(() => {
    return (data || [])
      .filter((Torr) => {
        if (props.filterState.qualitySelected !== undefined) {
          const qual = parseFromString(Torr.name, qualityAliases);
          return qual === props.filterState.qualitySelected;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.selectedSource !== "") {
          const type = parseFromString(Torr.name, typeAliases);
          return type === props.filterState.selectedSource;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.minSeeds !== "0") {
          return (
            parseInt(Torr.seeders) >=
            parseInt(props.filterState.minSeeds || "0")
          );
        } else {
          return true;
        }
      });
  }, [
    data,
    props.filterState.selectedSource,
    props.filterState.minSeeds,
    props.filterState.qualitySelected,
  ]);

  const [addToCategory, setAddToCategory] = useState<string>("");
  const [savePath, setSavePath] = useState<string>("");

  const { data: categories } = useQuery("torrentsCategoryTPB", TorrClient.getCategories, {
    staleTime: 10000,
  });

  const handleCategorySelect = (categoryName: string) => {
    setAddToCategory(categoryName);
    if (categoryName && categories) {
      const cat = Object.values(categories).find((c) => c.name === categoryName);
      setSavePath(cat?.savePath || "");
    } else {
      setSavePath("");
    }
  };

  return (
    <VStack id={"tpb-search"}>
      <IosSearch
        value={props.searchState[0]}
        onChange={(e) => props.searchState[1](e.target.value)}
        isLoading={isLoading}
        onSearch={search}
        placeholder={`Search ${props.category}...`}
      />
      <Flex flexDirection={"column"} gap={2} width={"100%"}>
        {(!data?.length || true) && <Filters {...props.filterState} />}
        {data && (
          <>
            <FormControl>
              <FormLabel>Download Location</FormLabel>
              <Input value={savePath} onChange={(e) => setSavePath(e.target.value)} placeholder="Enter save path" />
            </FormControl>
            <SectionSM title={"Results"} titleRight={<CategorySelect category={addToCategory} onSelected={handleCategorySelect} />}>
              {filteredMovies.map((torr) => (
                <TorrentDownloadBox key={torr.info_hash} title={torr.name} magnetURL={torr.info_hash} category={addToCategory} savePath={savePath}>
                  {props.category === "Video" && (
                    <TorrentMovieData
                      quality={parseFromString(torr.name, qualityAliases)}
                      type={parseFromString(torr.name, typeAliases)}
                      size={parseInt(torr.size)}
                    />
                  )}
                  <SeedsAndPeers seeds={torr.seeders} peers={torr.leechers} />
                </TorrentDownloadBox>
              ))}
            </SectionSM>
          </>
        )}
      </Flex>
    </VStack>
  );
};

export default TPBSearch;
