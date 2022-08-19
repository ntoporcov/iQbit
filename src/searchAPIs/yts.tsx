import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { SearchProviderComponentProps, YTSMovies } from "../types";
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HeadingProps,
  Text,
  useBoolean,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import IosSearch from "../components/ios/IosSearch";
import { useMutation } from "react-query";
import { YTSClient } from "../utils/YTSClient";
import { useNavigate, useParams } from "react-router-dom";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import { IoEarth, IoPricetags, IoTime, IoWarning } from "react-icons/io5";
import { SiRottentomatoes } from "react-icons/si";
import SeedsAndPeers from "../components/SeedsAndPeers";
import TorrentMovieData from "../components/TorrentMovieData";
import Filters from "../components/Filters";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";
import { InfoDataBox } from "../components/InfoDataBox";

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
}: PropsWithChildren<{ title: string; titleProps?: HeadingProps }>) => {
  return (
    <VStack alignItems={"flex-start"} w={"100%"}>
      <Heading {...titleProps} size={"sm"}>
        {title}
      </Heading>
      {children}
    </VStack>
  );
};

const createMagnetLink = (hash: string, title: string) =>
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
        navigate(`/search/${props.searchState[0]}`, { replace: true });
      },
      onSuccess: (data) => {
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
            (torr) => torr.seeds >= parseInt(props.filterState.minSeeds)
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

  const isTouch = useIsTouchDevice();

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
      <Grid
        gap={2}
        pt={2}
        width={"100%"}
        justifyContent={"flex-start"}
        templateColumns={"repeat( auto-fit, minmax(150px, 1fr) )"}
      >
        {filteredMovies.map((movie) => (
          <AspectRatio
            role={"group"}
            key={movie.id + movie.date_uploaded_unix?.toString()}
            minWidth={"150px"}
            ratio={2 / 3}
            flexGrow={1}
            rounded={"lg"}
            shadow={"xl"}
            backgroundImage={`url(${movie.large_cover_image}), url(${movie.small_cover_image})`}
            backgroundSize={"cover"}
            overflow={"hidden"}
          >
            <Flex position={"relative"}>
              <Flex
                as={"button"}
                position={"absolute"}
                width={"100%"}
                py={4}
                px={3}
                bottom={0}
                height={"100%"}
                bgGradient={"linear(to-t, blackAlpha.900, transparent)"}
                alignItems={"flex-end"}
                opacity={isTouch ? 1 : 0}
                _groupHover={isTouch ? undefined : { opacity: 1 }}
                transition={"opacity .2s ease-in-out"}
                onClick={() => selectMovie(movie)}
              >
                <Text fontSize={18} fontWeight={500} color={"white"}>
                  {movie.title_english}
                </Text>
              </Flex>
            </Flex>
          </AspectRatio>
        ))}
        <Box flexGrow={1} minW={"200px"} />
      </Grid>
      <IosBottomSheet
        title={selectedMovie?.title || ""}
        disclosure={bottomSheetDisclosure}
        modalProps={{ size: "xl", scrollBehavior: "inside" }}
      >
        <Flex flexDirection={"column"} gap={4}>
          <SectionSM title={"Torrents"}>
            {(selectedMovie?.torrents || []).map((torrent) => {
              return (
                <TorrentDownloadBox
                  key={torrent.hash}
                  magnetURL={createMagnetLink(
                    torrent.hash,
                    `${selectedMovie?.title} (${
                      selectedMovie?.year || "--"
                    })` || "Title not found"
                  )}
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
