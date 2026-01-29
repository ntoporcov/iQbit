import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  LightMode,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  Badge,
  IconButton,
  HStack,
  VStack,
  Tooltip,
  Select,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { FiFilter, FiRefreshCw, FiStar, FiClock } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import { useMutation, useQuery } from "react-query";
import { tmdbClient } from "../utils/tmdbClient";
import PosterGrid from "../components/PosterGrid";
import { MovieResult, TvResult } from "moviedb-promise";
import SegmentedPicker from "../components/SegmentedPicker";
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
import CategorySelect from "../components/CategorySelect";

const smallImage = "http://image.tmdb.org/t/p/w200";
const originalImage = "http://image.tmdb.org/t/p/original";

// Time window options for trending
type TimeWindow = "day" | "week";

// Genre mapping for filtering
const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

// Helper to get browser language, fallback to 'en-US', and map to supported TMDB codes
const getBrowserLanguage = () => {
  const supported = ["en-US", "es-ES", "fr-FR", "de-DE", "pt-BR", "ja-JP", "ko-KR", "zh-CN"];
  const lang =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  // If supported, use as is, else fallback to 'en-US'
  return supported.includes(lang) ? lang : "en-US";
};

const TrendingPage = () => {
  const toast = useToast();
  const tabs = ["Movies", "TV", "TOP 100"];
  const [tab, setTab] = useState(0);

  // Advanced filtering state
  const [timeWindow, setTimeWindow] = useState<TimeWindow>("day");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"popularity.desc" | "popularity.asc" | "vote_average.desc" | "release_date.desc" | "revenue.desc">("popularity.desc");
  const language = getBrowserLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<MovieResult>();
  const movieBottomSheet = useDisclosure();
  
  // Pagination state for each tab
  const [moviesPage, setMoviesPage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [topMoviesPage, setTopMoviesPage] = useState(1);
  const [discoveredPage, setDiscoveredPage] = useState(1);
  
  // Accumulated data for pagination
  const [trendingMoviesData, setTrendingMoviesData] = useState<MovieResult[]>([]);
  const [trendingTvData, setTrendingTvData] = useState<TvResult[]>([]);
  const [topMoviesData, setTopMoviesData] = useState<MovieResult[]>([]);
  const [discoveredMoviesData, setDiscoveredMoviesData] = useState<MovieResult[]>([]);
  
  // Loading states for load more
  const [loadingMoreMovies, setLoadingMoreMovies] = useState(false);
  const [loadingMoreTv, setLoadingMoreTv] = useState(false);
  const [loadingMoreTop, setLoadingMoreTop] = useState(false);
  const [loadingMoreDiscovered, setLoadingMoreDiscovered] = useState(false);
  
  // Trending Movies with time window
  const { data: trendingMovies, refetch: refetchTrendingMovies, isLoading: trendingMoviesLoading } = useQuery(
    ["getTrendingMovies", timeWindow, language, moviesPage],
    async () => {
      const response = await tmdbClient.trending({
        media_type: "movie",
        time_window: timeWindow,
        language: language,
        page: moviesPage,
      });
      
      if (moviesPage === 1) {
        setTrendingMoviesData(response.results as MovieResult[] || []);
      } else {
        setTrendingMoviesData(prev => [...prev, ...(response.results as MovieResult[] || [])]);
      }
      
      return response;
    },
    {
      onSuccess: () => {
        setLoadingMoreMovies(false);
        if (moviesPage === 1) {
          toast({
            title: "Movies updated",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
      },
      onError: () => {
        setLoadingMoreMovies(false);
      }
    }
  );

  const { isLoading: topMoviesLoading } = useQuery(
    ["getTopMovies", topMoviesPage],
    async () => {
      const res = await tmdbClient.movieTopRated({
        page: topMoviesPage,
        language: language,
      });
      
      if (topMoviesPage === 1) {
        setTopMoviesData(res?.results as MovieResult[] || []);
      } else {
        setTopMoviesData(prev => [...prev, ...(res?.results as MovieResult[] || [])]);
      }
      
      return res;
    },
    {
      onSuccess: () => {
        setLoadingMoreTop(false);
      },
      onError: () => {
        setLoadingMoreTop(false);
      }
    }
  );

  // Discover movies with advanced filters
  const { data: discoveredMovies, isLoading: discoveredLoading } = useQuery(
    ["discoverMovies", selectedGenre, minRating, sortBy, language, discoveredPage],
    async () => {
      const response = await tmdbClient.discoverMovie({
        language: language,
        sort_by: sortBy,
        with_genres: selectedGenre ? selectedGenre.toString() : undefined,
        "vote_average.gte": minRating || undefined,
        page: discoveredPage,
      });
      
      if (discoveredPage === 1) {
        setDiscoveredMoviesData(response.results as MovieResult[] || []);
      } else {
        setDiscoveredMoviesData(prev => [...prev, ...(response.results as MovieResult[] || [])]);
      }
      
      return response;
    },
    {
      enabled: tab === 0 && (selectedGenre !== null || minRating > 0),
      onSuccess: () => {
        setLoadingMoreDiscovered(false);
      },
      onError: () => {
        setLoadingMoreDiscovered(false);
      }
    }
  );

  // Load more functions for each tab
  const handleLoadMoreMovies = () => {
    setLoadingMoreMovies(true);
    setMoviesPage(prev => prev + 1);
  };
  
  const handleLoadMoreTv = () => {
    setLoadingMoreTv(true);
    setTvPage(prev => prev + 1);
  };
  
  const handleLoadMoreTop = () => {
    setLoadingMoreTop(true);
    setTopMoviesPage(prev => prev + 1);
  };
  
  const handleLoadMoreDiscovered = () => {
    setLoadingMoreDiscovered(true);
    setDiscoveredPage(prev => prev + 1);
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
  
  // Trending TV with time window
  const { data: trendingTv, refetch: refetchTrendingTv, isLoading: trendingTvLoading } = useQuery(
    ["getTrendingTv", timeWindow, language, tvPage],
    async () => {
      const response = await tmdbClient.trending({
        media_type: "tv",
        time_window: timeWindow,
        language: language,
        page: tvPage,
      });
      
      if (tvPage === 1) {
        setTrendingTvData(response.results as TvResult[] || []);
      } else {
        setTrendingTvData(prev => [...prev, ...(response.results as TvResult[] || [])]);
      }
      
      return response;
    },
    {
      onSuccess: () => {
        setLoadingMoreTv(false);
      },
      onError: () => {
        setLoadingMoreTv(false);
      }
    }
  );

  const { data: plugins } = useQuery(
    SearchPluginsPageQuery,
    TorrClient.getInstalledPlugins
  );

  const [addToCategory, setAddToCategory] = useState<string>("");
  const [savePath, setSavePath] = useState<string>("");

  const { data: categories } = useQuery(
    "torrentsCategoryTrending",
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

  const bgColor = useColorModeValue("grayAlpha.200", "grayAlpha.400");
  const filterBgColor = useColorModeValue("white", "gray.800");
  const filterBorderColor = useColorModeValue("gray.200", "gray.700");

  const push = useNavigate();

  const providerMapper = useMemo(() => {
    return Object.entries(providers)
      .filter(([key]) => key !== "YTS")
      .filter(([key]) =>
        (plugins?.length || 0) > 0 ? true : key !== "plugin"
      );
  }, [plugins?.length]);

  // Filter movies based on selected criteria
  const filteredMovies = useMemo(() => {
    // Use discovered data if filters are active, otherwise use trending
    const hasFilters = selectedGenre !== null || minRating > 0;
    let movies = hasFilters ? discoveredMoviesData : trendingMoviesData;
    
    // Apply additional client-side filtering if needed
    if (selectedGenre && !hasFilters) {
      movies = movies.filter(m => m.genre_ids?.includes(selectedGenre));
    }
    
    if (minRating > 0 && !hasFilters) {
      movies = movies.filter(m => (m.vote_average || 0) >= minRating);
    }
    
    return movies;
  }, [trendingMoviesData, discoveredMoviesData, selectedGenre, minRating]);

  // Get movie list based on tab
  const getMovieList = () => {
    if (tab === 0) return filteredMovies;
    if (tab === 2) return topMoviesData;
    return [];
  };
  
  // Check if we have filters active
  const hasActiveFilters = selectedGenre !== null || minRating > 0;

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenre(null);
    setMinRating(0);
    setSortBy("popularity.desc");
    setTimeWindow("day");
    setMoviesPage(1);
    setDiscoveredPage(1);
  };

  return (
    <>
      <PageHeader title={"Trending"} />
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text color={"gray.500"}>Trending Movies and Shows from TMDB</Text>
        <HStack spacing={2}>
          <Tooltip label="Refresh">
            <IconButton
              aria-label="Refresh"
              icon={<FiRefreshCw />}
              size="sm"
              variant="ghost"
              onClick={() => {
                if (tab === 0) {
                  setMoviesPage(1);
                  setDiscoveredPage(1);
                  refetchTrendingMovies();
                } else if (tab === 1) {
                  setTvPage(1);
                  refetchTrendingTv();
                } else if (tab === 2) {
                  setTopMoviesPage(1);
                }
              }}
            />
          </Tooltip>
          <Tooltip label="Filters">
            <IconButton
              aria-label="Filter"
              icon={<FiFilter />}
              size="sm"
              variant="ghost"
              colorScheme={showFilters ? "blue" : undefined}
              onClick={() => setShowFilters(!showFilters)}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* Advanced Filters Panel */}
      {showFilters && (tab === 0 || tab === 1) && (
        <Box
          bg={filterBgColor}
          p={4}
          rounded="lg"
          mb={4}
          shadow="md"
          border="1px"
          borderColor={filterBorderColor}
        >
          <VStack spacing={3} align="stretch">
            <HStack spacing={3} flexWrap="wrap">
              {/* Time Window */}
              <FormControl flex="1" minW="150px">
                <FormLabel fontSize="sm" mb={1}>
                  <HStack>
                    <Icon as={FiClock} />
                    <Text>Time Window</Text>
                  </HStack>
                </FormLabel>
                <Select
                  size="sm"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value as TimeWindow)}
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                </Select>
              </FormControl>

              {/* Genre Filter (Movies only) */}
              {tab === 0 && (
                <FormControl flex="1" minW="150px">
                  <FormLabel fontSize="sm" mb={1}>Genre</FormLabel>
                  <Select
                    size="sm"
                    placeholder="All Genres"
                    value={selectedGenre || ""}
                    onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
                  >
                    {MOVIE_GENRES.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Minimum Rating */}
              {tab === 0 && (
                <FormControl flex="1" minW="150px">
                  <FormLabel fontSize="sm" mb={1}>
                    <HStack>
                      <Icon as={FiStar} />
                      <Text>Min Rating</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    size="sm"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                  >
                    <option value={0}>All Ratings</option>
                    <option value={5}>5+ ⭐</option>
                    <option value={6}>6+ ⭐</option>
                    <option value={7}>7+ ⭐</option>
                    <option value={8}>8+ ⭐</option>
                    <option value={9}>9+ ⭐</option>
                  </Select>
                </FormControl>
              )}

              {/* Sort By */}
              {tab === 0 && (
                <FormControl flex="1" minW="150px">
                  <FormLabel fontSize="sm" mb={1}>Sort By</FormLabel>
                  <Select
                    size="sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  >
                    <option value="popularity.desc">Most Popular</option>
                    <option value="vote_average.desc">Highest Rated</option>
                    <option value="release_date.desc">Newest</option>
                    <option value="revenue.desc">Highest Revenue</option>
                  </Select>
                </FormControl>
              )}
            </HStack>

            <HStack>
              <Button
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
              {(selectedGenre || minRating > 0) && (
                <Badge colorScheme="blue">
                  {[
                    selectedGenre && MOVIE_GENRES.find(g => g.id === selectedGenre)?.name,
                    minRating > 0 && `${minRating}+ ⭐`
                  ].filter(Boolean).join(", ")}
                </Badge>
              )}
            </HStack>
          </VStack>
        </Box>
      )}
      
      {/* FIX 1: Added Box wrapper for scrollable tabs on small screens */}
      {/* FIX 2: Fixes hidden bar on desktop view */}
      <Box pb={2} mb={2} className="no-scrollbar">
        <Box>
            <SegmentedPicker options={tabs} selected={tab} onSelect={setTab} />
        </Box>
      </Box>

      {/* Loading States */}
      {(trendingMoviesLoading || trendingTvLoading || discoveredLoading) && (
        <Flex justify="center" py={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      )}

      {tab === 0 ? (
        <Flex flexDir={"column"}>
          <PosterGrid
            list={getMovieList()}
            keyExtractor={(item) =>
              item?.id?.toString() || Math.random().toString()
            }
            titleExtractor={(movie) => {
              const m = movie as MovieResult;
              const rating = m.vote_average ? ` ⭐ ${m.vote_average.toFixed(1)}` : "";
              const year = m.release_date ? ` (${m.release_date.split("-")[0]})` : "";
              return `${m.title || "Unknown Title"}${rating}${year}`;
            }}
            images={(movie) => ({
              large: originalImage + movie.poster_path || "",
              small: smallImage + movie.poster_path || "",
            })}
            onSelect={(movie) => {
              // FIX 2: Use original_title for search to find English torrents
              const searchTitle = movie?.original_title || movie?.title || "";
              getTorrs(
                `${searchTitle} ${movie?.release_date?.split("-")?.[0] || ""}`
              );
              movieBottomSheet.onOpen();
              setSelectedMovie(movie);
            }}
          />
          {getMovieList().length > 0 && (
            <Button
              mt={3}
              width={"full"}
              variant={"ghost"}
              colorScheme={"blue"}
              onClick={hasActiveFilters ? handleLoadMoreDiscovered : handleLoadMoreMovies}
              isLoading={hasActiveFilters ? loadingMoreDiscovered : loadingMoreMovies}
              loadingText="Loading more..."
            >
              Load More Movies
            </Button>
          )}
        </Flex>
      ) : tab === 1 ? (
        <Flex flexDir={"column"}>
          <PosterGrid
            list={trendingTvData}
            keyExtractor={(show) =>
              show?.id?.toString() || Math.random().toString()
            }
            titleExtractor={(show) => {
              const s = show as TvResult;
              const rating = s.vote_average ? ` ⭐ ${s.vote_average.toFixed(1)}` : "";
              const year = s.first_air_date ? ` (${s.first_air_date.split("-")[0]})` : "";
              return `${s.name || "Unknown Show"}${rating}${year}`;
            }}
            images={(show) => ({
              large: originalImage + show.poster_path || "",
              small: smallImage + show.poster_path || "",
            })}
            onSelect={(show) => {
              setSelectedTv(show);
              tvBottomSheet.onOpen();
            }}
          />
          {trendingTvData.length > 0 && (
            <Button
              mt={3}
              width={"full"}
              variant={"ghost"}
              colorScheme={"blue"}
              onClick={handleLoadMoreTv}
              isLoading={loadingMoreTv}
              loadingText="Loading more..."
            >
              Load More Shows
            </Button>
          )}
        </Flex>
      ) : tab === 2 ? (
        <Flex flexDir={"column"}>
          <PosterGrid
            list={(topMoviesData as MovieResult[]) || []}
            keyExtractor={(item) =>
              item?.id?.toString() || Math.random().toString()
            }
            titleExtractor={(movie) => {
              const m = movie as MovieResult;
              const rating = m.vote_average ? ` ⭐ ${m.vote_average.toFixed(1)}` : "";
              return `${m.title || "Unknown Title"}${rating}`;
            }}
            images={(movie) => ({
              large: originalImage + movie.poster_path || "",
              small: smallImage + movie.poster_path || "",
            })}
            onSelect={(movie) => {
               // FIX 3: Apply the same fix to the Top 100 tab
              const searchTitle = movie?.original_title || movie?.title || "";
              getTorrs(
                `${searchTitle} ${movie?.release_date?.split("-")?.[0] || ""}`
              );
              movieBottomSheet.onOpen();
              setSelectedMovie(movie);
            }}
          />
          <Button
            mt={3}
            width={"full"}
            variant={"ghost"}
            colorScheme={"blue"}
            onClick={handleLoadMoreTop}
            isLoading={loadingMoreTop}
            loadingText="Loading more..."
          >
            Load More Top Rated
          </Button>
        </Flex>
      ) : null}

      <IosBottomSheet
        modalProps={{ size: "xl" }}
        title={selectedMovie?.title ?? ""}
        disclosure={movieBottomSheet}
      >
        <Flex flexDirection={"column"} gap={4}>
          {/* Movie Info Card */}
          <Box bg={bgColor} p={4} rounded="lg">
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FiStar} color="yellow.400" />
                  <Text fontWeight="bold">
                    {selectedMovie?.vote_average?.toFixed(1) || "N/A"}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    ({selectedMovie?.vote_count || 0} votes)
                  </Text>
                </HStack>
                <Badge colorScheme="blue">
                  {selectedMovie?.release_date?.split("-")?.[0] || "TBA"}
                </Badge>
              </HStack>
              {selectedMovie?.original_language && (
                <Text fontSize="sm" color="gray.500">
                  Original Language: {selectedMovie.original_language.toUpperCase()}
                </Text>
              )}
              {selectedMovie?.popularity && (
                <Text fontSize="sm" color="gray.500">
                  Popularity: {selectedMovie.popularity.toFixed(0)}
                </Text>
              )}
            </VStack>
          </Box>

          <FormControl>
            <FormLabel>Download Location</FormLabel>
            <Input
              value={savePath}
              onChange={(e) => setSavePath(e.target.value)}
              placeholder="Enter save path"
            />
          </FormControl>
          <SectionSM
            title={"Download from YTS"}
            titleRight={
              <CategorySelect
                category={addToCategory}
                onSelected={handleCategorySelect}
              />
            }
          >
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
                              // FIX 4: Use original_title for external providers too
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
          {/* TV Show Info Card */}
          <Box bg={bgColor} p={4} rounded="lg">
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FiStar} color="yellow.400" />
                  <Text fontWeight="bold">
                    {selectedTv?.vote_average?.toFixed(1) || "N/A"}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    ({selectedTv?.vote_count || 0} votes)
                  </Text>
                </HStack>
                <Badge colorScheme="purple">
                  {selectedTv?.first_air_date?.split("-")?.[0] || "TBA"}
                </Badge>
              </HStack>
              {selectedTv?.original_language && (
                <Text fontSize="sm" color="gray.500">
                  Original Language: {selectedTv.original_language.toUpperCase()}
                </Text>
              )}
              {selectedTv?.popularity && (
                <Text fontSize="sm" color="gray.500">
                  Popularity: {selectedTv.popularity.toFixed(0)}
                </Text>
              )}
              {selectedTv?.origin_country && selectedTv.origin_country.length > 0 && (
                <Text fontSize="sm" color="gray.500">
                  Origin: {selectedTv.origin_country.join(", ")}
                </Text>
              )}
            </VStack>
          </Box>

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
                          // FIX 5: Use original_name for TV shows
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
