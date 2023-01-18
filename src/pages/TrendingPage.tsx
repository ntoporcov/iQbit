import React, {useMemo, useState} from "react";
import {Box, Button, Flex, LightMode, Spinner, Text, useColorModeValue, useDisclosure,} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {useMutation, useQuery} from "react-query";
import {tmdbClient} from "../utils/tmdbClient";
import PosterGrid from "../components/PosterGrid";
import {MovieResult, TvResult} from "moviedb-promise";
import SegmentedPicker from "../components/SegmentedPicker";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import {createYTSMagnetLink, SectionSM} from "../searchAPIs/yts";
import {YTSClient} from "../utils/YTSClient";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import TorrentMovieData from "../components/TorrentMovieData";
import SeedsAndPeers from "../components/SeedsAndPeers";
import {providers} from "./SearchPage";
import {useNavigate} from "react-router-dom";
import {SearchPluginsPageQuery} from "./SearchPluginsPage";
import {TorrClient} from "../utils/TorrClient";

const smallImage = "http://image.tmdb.org/t/p/w200";
const originalImage = "http://image.tmdb.org/t/p/original";


const TrendingPage = () => {
  const tabs = ["Movies", "TV", "TOP 100"];
  const [tab, setTab] = useState(0);

  const [selectedMovie, setSelectedMovie] = useState<MovieResult>();
  const movieBottomSheet = useDisclosure();
  const {data: trendingMovies} = useQuery("getTrendingMovies", async () =>
      tmdbClient.trending({
        media_type: "movie",
        time_window: "day",
      })
    );

    const [currentPage, setCurrentPage] = useState(1);

    const [topMoviesData, setTopMoviesData] = useState<MovieResult[]>([]);

    const {refetch} = useQuery("getTopMovies", async () => {
            const res = await tmdbClient.movieTopRated({
                page: currentPage,
            })
            setCurrentPage(currentPage + 1);
            setTopMoviesData([...topMoviesData, ...res?.results ?? []]);
            return res;
        }
    );


    const handleLoadMore = async () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        let { data } = await refetch({queryKey: `getTopMovies:${newPage}`});
        setTopMoviesData([...topMoviesData, ...data?.results ?? []]);
    };



    const {
        data: TorrData,
        mutate: getTorrs,
        isLoading: torrsLoading,
    } = useMutation((search: string) =>
        YTSClient.search({
            query_term: search,
        })
    );

    const tvBottomSheet = useDisclosure();
    const [selectedTv, setSelectedTv] = useState<TvResult>();
    const { data: trendingTv } = useQuery("getTrendingTv", async () =>
        tmdbClient.trending({
            media_type: "tv",
            time_window: "day",
        })
    );

    const { data: plugins } = useQuery(
        SearchPluginsPageQuery,
        TorrClient.getInstalledPlugins
    );

    const bgColor = useColorModeValue("grayAlpha.200", "grayAlpha.400");

    const push = useNavigate();

    const providerMapper = useMemo(() => {
        return Object.entries(providers)
            .filter(([key]) => key !== "YTS")
            .filter(([key]) =>
                (plugins?.length || 0) > 0 ? true : key !== "plugin"
            );
    }, [plugins?.length]);

    return (
        <>
            <PageHeader title={"Trending"} />
            <Text color={"gray.500"}>Trending Movies and Shows from TMDB</Text>
            <SegmentedPicker options={tabs} selected={tab} onSelect={setTab} />
            {tab === 0 ? (
                <PosterGrid
                    list={(trendingMovies?.results as MovieResult[]) || []}
                    keyExtractor={(item) =>
                        item?.id?.toString() || Math.random().toString()
                    }
                    titleExtractor={(movie) => movie?.title || "Unknown Title"}
                    images={(movie) => ({
                        large: originalImage + movie.poster_path || "",
                        small: smallImage + movie.poster_path || "",
                    })}
                    onSelect={(movie) => {
                        getTorrs(
                            `${movie?.title} ${movie?.release_date?.split("-")?.[0] || ""}`
                        );
                        movieBottomSheet.onOpen();
                        setSelectedMovie(movie);
                    }}
                />
            ) : tab === 1 ? (
                <PosterGrid
                    list={(trendingTv?.results as TvResult[]) || []}
                    keyExtractor={(show) =>
                        show?.id?.toString() || Math.random().toString()
                    }
                    titleExtractor={(show) => show?.name || "Unknown Show"}
                    images={(show) => ({
                        large: originalImage + show.poster_path || "",
                        small: smallImage + show.poster_path || "",
                    })}
                    onSelect={(show) => {
                        setSelectedTv(show);
                        tvBottomSheet.onOpen();
                    }}
                />
            ) : tab === 2 ? (

              <Flex flexDir={"column"}>
                <PosterGrid
                  list={(topMoviesData as MovieResult[]) || []}
                  keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
                  titleExtractor={(movie) => movie?.title || "Unknown Title"}
                  images={(movie) => ({
                    large: originalImage + movie.poster_path || "",
                    small: smallImage + movie.poster_path || "",
                  })}
                  onSelect={(movie) => {
                    getTorrs(
                      `${movie?.title} ${movie?.release_date?.split("-")?.[0] || ""}`
                    );
                    movieBottomSheet.onOpen();
                    setSelectedMovie(movie);
                  }}/>
                <Button
                  mt={3}
                  width={"full"}
                  variant={"ghost"}
                  colorScheme={"blue"}
                  onClick={handleLoadMore}
                >
                  Load More
                </Button>
              </Flex>

            ) : null}

            <IosBottomSheet
                modalProps={{ size: "xl" }}
                title={selectedMovie?.title ?? ""}
                disclosure={movieBottomSheet}
            >
                <Flex flexDirection={"column"} gap={4}>
                    <SectionSM title={"Download from YTS"}>
                        {torrsLoading ? (
                            <Flex justifyContent={"center"} w={"full"}>
                                <Spinner color={"blue"} mt={3} />
                            </Flex>
                        ) : (TorrData?.movies?.[0]?.torrents?.length || 0) === 0 ? (
                            <Flex flexDirection={"column"} gap={4} w={"100%"}>
                                <Text opacity={0.5}>
                                    YTS might have it but I did not find it automagically.
                                </Text>
                                {providerMapper.map(([key, data]) => (
                                    <Flex
                                        key={key}
                                        flexDirection={{ base: "column", lg: "row" }}
                                        alignItems={"center"}
                                        gap={3}
                                        bg={bgColor}
                                        rounded={"lg"}
                                        justifyContent={"space-between"}
                                        p={3}
                                        flexGrow={1}
                                        minWidth={{ base: "200px", lg: "100%" }}
                                        maxWidth={{ base: "100%", lg: undefined }}
                                    >
                                        <Flex>{data.logo}</Flex>
                                        <LightMode>
                                            <Button
                                                colorScheme={"blue"}
                                                onClick={() =>
                                                    push("/search", {
                                                        replace: true,
                                                        state: {
                                                            provider: key,
                                                            query: `${selectedMovie?.title} ${
                                                                selectedMovie?.release_date?.split("-")?.[0]
                                                            }`,
                                                        },
                                                    })
                                                }
                                            >
                                                Search with {key}
                                            </Button>
                                        </LightMode>
                                    </Flex>
                                ))}
                            </Flex>
                        ) : (
                            <Box p={3} rounded={"md"} bgColor={bgColor} w={"full"}>
                                <Text>
                                    Showing torrents for <b>{TorrData?.movies?.[0].title}</b>{" "}
                                    released in <b>{TorrData?.movies?.[0].year}</b>
                                </Text>
                            </Box>
                        )}

                        {(TorrData?.movies?.[0].torrents || []).map((torrent) => {
                            return (
                                <TorrentDownloadBox
                                    key={torrent.hash}
                                    magnetURL={createYTSMagnetLink(
                                        torrent.hash,
                                        `${TorrData?.movies[0].title} (${
                                            TorrData?.movies[0].year || "--"
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
                        <Text>{selectedMovie?.overview}</Text>
                    </SectionSM>
                </Flex>
            </IosBottomSheet>

            <IosBottomSheet
                title={selectedTv?.name ?? ""}
                disclosure={tvBottomSheet}
                modalProps={{ size: "xl" }}
            >
                <Flex flexDirection={"column"} gap={4}>
                    <SectionSM title={"Search Torrent"}>
                        <Flex
                            flexWrap={"wrap"}
                            gap={3}
                            flexDirection={{ base: "row", lg: "column" }}
                            width={"100%"}
                        >
                            {providerMapper.map(([key, data]) => (
                                <Flex
                                    key={key}
                                    flexDirection={{ base: "column", lg: "row" }}
                                    alignItems={"center"}
                                    gap={3}
                                    bg={bgColor}
                                    rounded={"lg"}
                                    justifyContent={"space-between"}
                                    p={3}
                                    flexGrow={1}
                                    minWidth={{ base: "200px", lg: "100%" }}
                                    maxWidth={{ base: "100%", lg: undefined }}
                                >
                                    <Flex>{data.logo}</Flex>
                                    <LightMode>
                                        <Button
                                            colorScheme={"blue"}
                                            onClick={() =>
                                                push("/search", {
                                                    replace: true,
                                                    state: { provider: key, query: selectedTv?.name },
                                                })
                                            }
                                        >
                                            Search with {key}
                                        </Button>
                                    </LightMode>
                                </Flex>
                            ))}
                        </Flex>
                    </SectionSM>
                    <SectionSM title={"Description"}>
                        <Text>{selectedTv?.overview}</Text>
                    </SectionSM>
                </Flex>
            </IosBottomSheet>
        </>
    );
};

export default TrendingPage;
