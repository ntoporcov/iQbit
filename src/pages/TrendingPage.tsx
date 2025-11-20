import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  LightMode,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  Icon,
  Select,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { useMutation, useQuery } from "react-query";
import { tmdbClient } from "../utils/tmdbClient";
import PosterGrid from "../components/PosterGrid";
import { MovieResult, TvResult } from "moviedb-promise";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import { createYTSMagnetLink, SectionSM } from "../searchAPIs/yts";
import { YTSClient } from "../utils/YTSClient";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import TorrentMovieData from "../components/TorrentMovieData";
import SeedsAndPeers from "../components/SeedsAndPeers";
import { providers } from "./SearchPage";
import { useNavigate } from "react-router-dom";
import { SearchPluginsPageQuery } from "./SearchPluginsPage";
import { TorrClient } from "../utils/TorrClient";
import { IoLanguage } from "react-icons/io5";

const smallImage = "http://image.tmdb.org/t/p/w200";
const originalImage = "http://image.tmdb.org/t/p/original";

// Helper to get browser language, fallback to 'en-US'
const getBrowserLanguage = () => {
  const supported = ["en-US", "es-ES", "fr-FR", "de-DE", "pt-BR"];
  const lang = typeof navigator !== "undefined" ? navigator.language : "en-US";
  return supported.includes(lang) ? lang : "en-US";
};

const TrendingPage = () => {
  const tabs = [
    "Movies", "TV", 
    "Top Movies", "Top TV", 
    "Upcoming", "In Theaters", "On Air"
  ];
  const [tab, setTab] = useState(0);

  // STATE: Language Toggle
  const [forceEnglish, setForceEnglish] = useState(false);
  
  const browserLanguage = getBrowserLanguage();
  const displayLanguage = forceEnglish ? "en-US" : browserLanguage;

  const [selectedMovie, setSelectedMovie] = useState<MovieResult>();
  const movieBottomSheet = useDisclosure();

  // --- DATA QUERIES ---

  // 0. Trending Movies
  const { data: trendingMovies } = useQuery(
    ["getTrendingMovies", displayLanguage], 
    async () =>
      tmdbClient.trending({
        media_type: "movie",
        time_window: "day",
        language: displayLanguage,
      })
  );

  // 1. Trending TV
  const { data: trendingTv } = useQuery(
    ["getTrendingTv", displayLanguage],
    async () =>
      tmdbClient.trending({
        media_type: "tv",
        time_window: "day",
        language: displayLanguage,
      })
  );

  // 2. Top Rated Movies
  const [topMovPage, setTopMovPage] = useState(1);
  const [topMovData, setTopMovData] = useState<MovieResult[]>([]);
  const { refetch: refetchTopMov } = useQuery(
    ["getTopMovies", displayLanguage], 
    async () => {
      const res = await tmdbClient.movieTopRated({
        page: topMovPage,
        language: displayLanguage,
      });
      if (topMovPage === 1) setTopMovData(res?.results ?? []);
      else setTopMovData((prev) => [...prev, ...(res?.results ?? [])]);
      return res;
    }
  );

  // 3. Top Rated TV
  const [topTvPage, setTopTvPage] = useState(1);
  const [topTvData, setTopTvData] = useState<TvResult[]>([]);
  const { refetch: refetchTopTv } = useQuery(
    ["getTopTv", displayLanguage], 
    async () => {
      const res = await tmdbClient.tvTopRated({
        page: topTvPage,
        language: displayLanguage,
      });
      if (topTvPage === 1) setTopTvData(res?.results ?? []);
      else setTopTvData((prev) => [...prev, ...(res?.results ?? [])]);
      return res;
    }
  );

  // 4. Upcoming Movies (Using 'as any' to fix TypeScript error)
  const { data: upcomingMovies } = useQuery(
    ["getUpcomingMovies", displayLanguage],
    async () => (tmdbClient as any).movieUpcoming({ language: displayLanguage })
  );

  // 5. In Theaters
  const { data: nowPlayingMovies } = useQuery(
    ["getNowPlayingMovies", displayLanguage],
    async () => tmdbClient.movieNowPlaying({ language: displayLanguage })
  );

  // 6. On The Air TV
  const { data: onAirTv } = useQuery(
    ["getOnAirTv", displayLanguage],
    async () => tmdbClient.tvOnTheAir({ language: displayLanguage })
  );

  useMemo(() => {
    setTopMovPage(1);
    setTopMovData([]);
    setTopTvPage(1);
    setTopTvData([]);
  }, [displayLanguage]);


  // --- TORRENT SEARCH ---
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

  const handleMovieSelect = (movie: MovieResult) => {
    const searchTitle = movie?.original_title || movie?.title || "";
    getTorrs(
      `${searchTitle} ${movie?.release_date?.split("-")?.[0] || ""}`
    );
    movieBottomSheet.onOpen();
    setSelectedMovie(movie);
  };

  const handleTvSelect = (show: TvResult) => {
    setSelectedTv(show);
    tvBottomSheet.onOpen();
  };

  return (
    <>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <PageHeader title={"Trending"} />
        <Button 
            size="sm" 
            variant={forceEnglish ? "solid" : "outline"}
            colorScheme="blue"
            leftIcon={<Icon as={IoLanguage} />}
            onClick={() => setForceEnglish(!forceEnglish)}
        >
            {forceEnglish ? "English" : "Native"}
        </Button>
      </Flex>

      <Text color={"gray.500"} mb={2}>
        Discover content from TMDB
      </Text>
      
      {/* THE FIX: Simple Dropdown instead of scrolling tabs */}
      <Box mb={4}>
        <Select 
            value={tab} 
            onChange={(e) => setTab(parseInt(e.target.value))}
            size="lg"
            fontWeight="bold"
            bg={useColorModeValue("white", "gray.800")}
            shadow="sm"
            rounded="xl"
        >
            {tabs.map((name, index) => (
                <option key={index} value={index}>{name}</option>
            ))}
        </Select>
      </Box>

      {/* TAB 0: Trending Movies */}
      {tab === 0 && (
        <PosterGrid
          list={(trendingMovies?.results as MovieResult[]) || []}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          titleExtractor={(movie) => movie?.title || "Unknown"}
          images={(movie) => ({
            large: originalImage + movie.poster_path,
            small: smallImage + movie.poster_path,
          })}
          onSelect={handleMovieSelect}
        />
      )}
      
      {/* TAB 1: Trending TV */}
      {tab === 1 && (
        <PosterGrid
          list={(trendingTv?.results as TvResult[]) || []}
          keyExtractor={(show) => show?.id?.toString() || Math.random().toString()}
          titleExtractor={(show) => show?.name || "Unknown"}
          images={(show) => ({
            large: originalImage + show.poster_path,
            small: smallImage + show.poster_path,
          })}
          onSelect={handleTvSelect}
        />
      )}

      {/* TAB 2: Top Movies */}
      {tab === 2 && (
        <Flex flexDir={"column"}>
          <PosterGrid
            list={(topMovData as MovieResult[]) || []}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            titleExtractor={(movie) => movie?.title || "Unknown"}
            images={(movie) => ({
              large: originalImage + movie.poster_path,
              small: smallImage + movie.poster_path,
            })}
            onSelect={handleMovieSelect}
          />
          <Button
            mt={3} width={"full"} variant={"ghost"} colorScheme={"blue"}
            onClick={async () => {
                const newPage = topMovPage + 1;
                setTopMovPage(newPage);
                await refetchTopMov();
            }}
          >
            Load More
          </Button>
        </Flex>
      )}

      {/* TAB 3: Top TV */}
      {tab === 3 && (
        <Flex flexDir={"column"}>
          <PosterGrid
            list={(topTvData as TvResult[]) || []}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            titleExtractor={(show) => show?.name || "Unknown"}
            images={(show) => ({
              large: originalImage + show.poster_path,
              small: smallImage + show.poster_path,
            })}
            onSelect={handleTvSelect}
          />
          <Button
            mt={3} width={"full"} variant={"ghost"} colorScheme={"blue"}
            onClick={async () => {
                const newPage = topTvPage + 1;
                setTopTvPage(newPage);
                await refetchTopTv();
            }}
          >
            Load More
          </Button>
        </Flex>
      )}

      {/* TAB 4: Upcoming Movies */}
      {tab === 4 && (
        <PosterGrid
          list={(upcomingMovies?.results as MovieResult[]) || []}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          titleExtractor={(movie) => movie?.title || "Unknown"}
          images={(movie) => ({
            large: originalImage + movie.poster_path,
            small: smallImage + movie.poster_path,
          })}
          onSelect={handleMovieSelect}
        />
      )}

      {/* TAB 5: In Theaters */}
      {tab === 5 && (
        <PosterGrid
          list={(nowPlayingMovies?.results as MovieResult[]) || []}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          titleExtractor={(movie) => movie?.title || "Unknown"}
          images={(movie) => ({
            large: originalImage + movie.poster_path,
            small: smallImage + movie.poster_path,
          })}
          onSelect={handleMovieSelect}
        />
      )}

      {/* TAB 6: On Air TV */}
      {tab === 6 && (
        <PosterGrid
          list={(onAirTv?.results as TvResult[]) || []}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          titleExtractor={(show) => show?.name || "Unknown"}
          images={(show) => ({
            large: originalImage + show.poster_path,
            small: smallImage + show.poster_path,
          })}
          onSelect={handleTvSelect}
        />
      )}

      {/* Movie Bottom Sheet */}
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
                              query: `${selectedMovie?.original_title || selectedMovie?.title} ${
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

      {/* TV Bottom Sheet */}
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
                          state: { provider: key, query: selectedTv?.original_name || selectedTv?.name },
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
