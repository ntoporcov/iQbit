import React, {PropsWithChildren, ReactNode, useEffect, useMemo, useState} from "react";
import { SearchProviderComponentProps, YTSMovies } from "../types";
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HeadingProps,
  Input,
  Text,
  useBoolean,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import IosSearch from "../components/ios/IosSearch";
import {useMutation, useQuery} from "react-query";
import { YTSClient } from "../utils/YTSClient";
import { useNavigate, useParams } from "react-router-dom";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import {IoEarth, IoPricetags, IoTime, IoWarning} from "react-icons/io5";
import { SiRottentomatoes } from "react-icons/si";
import SeedsAndPeers from "../components/SeedsAndPeers";
import TorrentMovieData from "../components/TorrentMovieData";
import Filters from "../components/Filters";
import { InfoDataBox } from "../components/InfoDataBox";
import ReactGA from "react-ga";
import PosterGrid from "../components/PosterGrid";
import {TorrClient} from "../utils/TorrClient";
import CategorySelect from "../components/CategorySelect";

export const useSearchFromParams = (callback: () => void) => {
  const { query } = useParams();

  useEffect(() => {
    if (query) {
      callback();
    }
    //  eslint-disable-next-line
  }, []);
};

export const SectionSM = ({
  title,
  titleProps,
  children,
                            titleRight,
}: PropsWithChildren<{ title: string; titleProps?: HeadingProps, titleRight?:ReactNode }>) => {
  return (
    <VStack alignItems={"flex-start"} w={"100%"}>
      <Flex w={"100%"}>
        <Heading {...titleProps} flexGrow={1} size={"sm"}>
          {title}
        </Heading>
        {titleRight}
      </Flex>
      {children}
    </VStack>
  );
};

export const createYTSMagnetLink = (hash: string, title: string) =>
  `magnet:?xt=urn:btih:${hash}&dn=${title}&udp://open.demonii.com:1337/announce&udp://tracker.openbittorrent.com:80&udp://tracker.coppersurfer.tk:6969&udp://glotorrents.pw:6969/announce&udp://tracker.opentrackr.org:1337/announce&udp://torrent.gresille.org:80/announce&udp://p4p.arenabg.com:1337&udp://tracker.leechers-paradise.org:6969`;

export const torrentBoxIconProps = {
  size: 22,
};

const YTSSearch = (props: SearchProviderComponentProps) => {
  const navigate = useNavigate();

  const { mutate, data, isLoading } = useMutation(
    "YTSsearch",
    () =>
      YTSClient.search({
        query_term: props.searchState[0],
        quality: props.filterState.qualitySelected,
      }),
    {
      onMutate: () => {
        ReactGA.event({ action: "executed", category: "search", label: "YTS" });
        navigate(`/search/${props.searchState[0]}`, { replace: true });
      },
      onSuccess: (data) => {
        props.onSearch && props.onSearch();

        let sourceList = new Set();

        data?.movies.forEach((movie) =>
          movie.torrents.forEach((torr) => sourceList.add(torr.type))
        );

        props.filterState.setSourceList(Array.from(sourceList) as string[]);
      },
    }
  );

  useEffect(() => {
    if (props.searchState[0]) {
      mutate();
    }
    //  eslint-disable-next-line
  }, [props.filterState.qualitySelected]);

  useSearchFromParams(mutate);

  const [selectedMovie, setSelectedMovie] = useState<YTSMovies | null>(null);
  const [
    expandedDescription,
    { toggle: toggleExpandedDescription, off: closeExpandedDescription },
  ] = useBoolean(false);

  const bottomSheetDisclosure = useDisclosure();
  const selectMovie = (movie: YTSMovies) => {
    setSelectedMovie(movie);
    closeExpandedDescription();
    bottomSheetDisclosure.onOpen();
  };

  const filteredMovies = useMemo(() => {
    return (data?.movies || [])
      .filter((movie) => {
        if (props.filterState.selectedSource !== "") {
          return movie.torrents.some(
            (torr) => torr.type === props.filterState.selectedSource
          );
        } else {
          return true;
        }
      })
      .filter((movie) => {
        if (props.filterState.minSeeds !== "0") {
          return movie.torrents.some(
            (torr) => torr.seeds >= parseInt(props.filterState.minSeeds || "0")
          );
        } else {
          return true;
        }
      });
  }, [
    data?.movies,
    props.filterState.selectedSource,
    props.filterState.minSeeds,
  ]);

  const [addToCategory, setAddToCategory] = useState<string>("");
  const [savePath, setSavePath] = useState<string>("");

  const { data: categories } = useQuery(
    "torrentsCategoryYTS",
    TorrClient.getCategories, {
      staleTime: 10000
    }
  );

  const handleCategorySelect = (categoryName: string) => {
    setAddToCategory(categoryName);
    if (categoryName && categories) {
      const cat = Object.values(categories).find(c => c.name === categoryName);
      setSavePath(cat?.savePath || "");
    } else {
      setSavePath("");
    }
  };

  return (
    <VStack>
      <IosSearch
        value={props.searchState[0]}
        onChange={(e) => props.searchState[1](e.target.value)}
        isLoading={isLoading}
        onSearch={() => mutate()}
        placeholder={`Search ${props.category}...`}
      />
      {(!data?.movies?.length || true) && <Filters {...props.filterState} />}

      <PosterGrid
        list={filteredMovies}
        keyExtractor={(movie) =>
          movie.id + movie.date_uploaded_unix?.toString()
        }
        images={(movie) => ({
          large: movie.large_cover_image,
          small: movie.small_cover_image,
        })}
        titleExtractor={(movie) => movie.title_english}
        onSelect={(movie) => selectMovie(movie)}
      />
      <Box flexGrow={1} minW={"200px"} />
      <IosBottomSheet
        title={selectedMovie?.title || ""}
        disclosure={bottomSheetDisclosure}
        modalProps={{ size: "xl", scrollBehavior: "inside" }}
      >
        <Flex flexDirection={"column"} gap={4}>
          <FormControl>
            <FormLabel>Download Location</FormLabel>
            <Input
              value={savePath}
              onChange={(e) => setSavePath(e.target.value)}
              placeholder="Enter save path"
            />
          </FormControl>
          <SectionSM title={"Torrents"}
            titleRight={

              <CategorySelect category={addToCategory} onSelected={handleCategorySelect} />
            }
          >
            {(selectedMovie?.torrents || []).map((torrent) => {
              return (
                <TorrentDownloadBox
                  key={torrent.hash}
                  magnetURL={createYTSMagnetLink(
                    torrent.hash,
                    `${selectedMovie?.title} (${
                      selectedMovie?.year || "--"
                    })` || "Title not found"
                  )}
                  category={addToCategory}
                  savePath={savePath}
                >
                  <Flex flexDirection={"column"} width={"100%"}>
                    <TorrentMovieData
                      quality={torrent.quality}
                      type={torrent.type}
                      size={torrent.size_bytes}
                    />
                    <SeedsAndPeers
                      seeds={torrent.seeds.toString()}
                      peers={torrent.peers.toString()}
                    />
                  </Flex>
                </TorrentDownloadBox>
              );
            })}
          </SectionSM>
          <SectionSM title={"Description"}>
            <Text noOfLines={expandedDescription ? undefined : 2}>
              {selectedMovie?.description_full}
            </Text>
            <Button
              size={"sm"}
              variant={"ghost"}
              alignSelf={"end"}
              onClick={toggleExpandedDescription}
            >
              {expandedDescription ? "Read Less" : "Read More"}
            </Button>
          </SectionSM>
          <SectionSM title={"Info"}>
            <Flex width={"100%"} gap={3} fontSize={"xl"} wrap={"wrap"}>
              <InfoDataBox
                title={"Ratings"}
                icon={<SiRottentomatoes />}
                label={(selectedMovie?.rating || "--") + " / 10"}
              />
              <InfoDataBox
                title={"Runtime"}
                icon={<IoTime />}
                label={(selectedMovie?.runtime || "--") + " min"}
              />
              <InfoDataBox
                title={"Language"}
                icon={<IoEarth />}
                label={selectedMovie?.language || ""}
              />
              <InfoDataBox
                title={"MPA Rating"}
                icon={<IoWarning />}
                label={selectedMovie?.mpa_rating || ""}
              />
              <InfoDataBox
                title={"Genres"}
                icon={<IoPricetags />}
                label={(selectedMovie?.genres || []).join(", ")}
              />
            </Flex>
          </SectionSM>
          {selectedMovie?.yt_trailer_code && (
            <SectionSM title={"Trailer"}>
              <AspectRatio ratio={16 / 9} width={"100%"}>
                <iframe
                  width={"100%"}
                  height={"100%"}
                  className={"movieTrailer"}
                  title={"Movie Trailer"}
                  src={
                    "https://www.youtube.com/embed/" +
                    selectedMovie.yt_trailer_code
                  }
                />
              </AspectRatio>
            </SectionSM>
          )}
        </Flex>
      </IosBottomSheet>
    </VStack>
  );
};

export default YTSSearch;
