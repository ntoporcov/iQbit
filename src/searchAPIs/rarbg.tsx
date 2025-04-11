import { SearchProviderComponentProps } from "../types";
import { Flex, VStack } from "@chakra-ui/react";
import IosSearch from "../components/ios/IosSearch";
import { useMutation } from "react-query";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import SeedsAndPeers from "../components/SeedsAndPeers";
import React, {useEffect, useMemo, useState} from "react";
import TorrentMovieData from "../components/TorrentMovieData";
import Filters from "../components/Filters";
import { parseFromString, qualityAliases, typeAliases } from "./tpb";
import { rarbgAPI, RarbgCategoryDictionary } from "../utils/RarBGClient";
import ReactGA from "react-ga";
import CategorySelect from "../components/CategorySelect";
import {SectionSM} from "./yts";

const RarbgSearch = (props: SearchProviderComponentProps) => {
  const {
    mutate: search,
    reset,
    data,
    isLoading,
  } = useMutation(
    "rarbgSearch",
    () =>
      rarbgAPI.search(
        props.searchState[0],
        props.category as keyof typeof RarbgCategoryDictionary
      ),
    {
      onMutate: () =>
        ReactGA.event({
          action: "executed",
          category: "search",
          label: "rarbg",
        }),
      onSuccess: (data) => {
        props.onSearch && props.onSearch();

        if (data?.rate_limit) {
          setTimeout(search, 2000);
          return;
        }

        let sourceList = new Set();

        data?.torrent_results?.forEach((torr) => {
          const type = parseFromString(torr.title, typeAliases);
          sourceList.add(type);
        });

        props.filterState.setSourceList(Array.from(sourceList) as string[]);
      },
    }
  );

  useEffect(() => {
    reset();
  }, [props.category, reset]);

  const filteredMovies = useMemo(() => {
    return (data?.torrent_results || [])
      .map((torr) => ({
        ...torr,
        pubdate: new Date(torr.pubdate),
      }))
      .filter((Torr) => {
        if (props.filterState.qualitySelected !== undefined) {
          const qual = parseFromString(Torr.title, qualityAliases);
          return qual === props.filterState.qualitySelected;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.selectedSource !== "") {
          const type = parseFromString(Torr.title, typeAliases);
          return type === props.filterState.selectedSource;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.minSeeds !== "0") {
          return Torr.seeders >= parseInt(props.filterState.minSeeds || "0");
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

  return (
    <VStack>
      <IosSearch
        value={props.searchState[0]}
        onChange={(e) => props.searchState[1](e.target.value)}
        isLoading={isLoading}
        onSearch={search}
        placeholder={`Search ${props.category}...`}
      />
      <Flex flexDirection={"column"} gap={2} width={"100%"}>
        {(!data?.torrent_results?.length || true) && (
          <Filters {...props.filterState} />
        )}
        {data && (
          <SectionSM
            title={"Results"}
            titleRight={
              <CategorySelect category={addToCategory} onSelected={setAddToCategory}/>
            }
          >
        {filteredMovies?.map((torr) => (
          <TorrentDownloadBox
            key={torr.download}
            title={torr.title}
            magnetURL={torr.download}
            category={addToCategory}
          >
            {props.category === "Movies" && (
              <TorrentMovieData
                quality={parseFromString(torr.title, qualityAliases)}
                type={parseFromString(torr.title, typeAliases)}
                size={torr.size}
              />
            )}
            <SeedsAndPeers
              seeds={torr.seeders.toString()}
              peers={torr.leechers.toString()}
            />
          </TorrentDownloadBox>
        ))}
            </SectionSM>
        )}
      </Flex>
    </VStack>
  );
};

export default RarbgSearch;
