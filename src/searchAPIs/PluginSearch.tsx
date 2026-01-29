import React, { useEffect, useMemo, useState } from "react";
import { SearchProviderComponentProps } from "../types";
import IosSearch from "../components/ios/IosSearch";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  LightMode,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import TorrentDownloadBox from "../components/TorrentDownloadBox";
import SeedsAndPeers from "../components/SeedsAndPeers";
import {
  IoArrowDown,
  IoArrowUp,
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoClose,
  IoFilter,
  IoList,
  IoStop,
} from "react-icons/io5";
import { useIsLargeScreen } from "../utils/screenSize";
import { StatWithIcon } from "../components/StatWithIcon";
import { parseFromString, qualityAliases, typeAliases } from "./tpb";
import Filters from "../components/Filters";
import CategorySelect from "../components/CategorySelect";
import { SectionSM } from "./yts";
import IosActionSheet from "../components/ios/IosActionSheet";
import { deepCompare } from "../utils/deepCompare";

const PluginSearch = (props: SearchProviderComponentProps) => {
  const [searchId, setSearchId] = useState<number>();
  const [addToCategory, setAddToCategory] = useState<string>("");
  const [savePath, setSavePath] = useState<string>("");
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const sortDisclosure = useDisclosure();

  const { data: categories } = useQuery(
    "torrentsCategoryPlugin",
    TorrClient.getCategories, {
      staleTime: 10000
    }
  );

  const { data: installedPlugins } = useQuery(
    "searchPlugins",
    TorrClient.getSearchPlugins,
    {
      staleTime: 60000,
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

  const isLarge = useIsLargeScreen();

  const stickyBgColorInTab = useColorModeValue(
    isLarge ? "whiteAlpha.800" : "whiteAlpha.300",
    "blackAlpha.500"
  );

  const inputBgColor = useColorModeValue("white", "gray.800");
  const ButtonBgColorHover = useColorModeValue("grayAlpha.300", "grayAlpha.900");

  const { mutate: createSearch, isLoading: createLoading } = useMutation(
    "createSearch",
    (query: string) => TorrClient.createSearch(query),
    {
      onSuccess: (res) => {
        setSearchId(res.id);
        setIsStopped(false);
        props.filterState.setSourceList([]);
      },
    }
  );

  const { mutate: deleteSearch } = useMutation(
    "deleteSearch",
    () => TorrClient.deleteSearch(searchId!),
    {
      onSuccess: () => setSearchId(undefined),
    }
  );

  const { mutate: stopSearch } = useMutation(
    "stopSearch",
    () => TorrClient.stopSearch(searchId!),
    {
      onSuccess: () => {
        setIsStopped(true);
      },
    }
  );

  const [isStopped, setIsStopped] = useState(false);

  const { data } = useQuery(
    "getSearches",
    () => TorrClient.getResults(searchId!),
    {
      refetchInterval: !isStopped ? 1000 : false,
      enabled: !!searchId,
    }
  );

  useEffect(() => {
    if (data?.status === "Stopped") {
      setIsStopped(true);
    }
  }, [data?.status]);

  useEffect(() => {
    return () => {
      if (searchId) {
        TorrClient.deleteSearch(searchId).catch(console.error);
      }
    };
  }, [searchId]);

  const { setSourceList, sourceList: currentSourceList } = props.filterState;

  useEffect(() => {
    if (data?.results) {
      const sourceList = new Set<string>();
      data.results.forEach((torr) => {
        const type = parseFromString(torr.fileName, typeAliases);
        if (type) sourceList.add(type);
      });
      const newSourceList = Array.from(sourceList);
      if (!deepCompare(newSourceList, currentSourceList)) {
        setSourceList(newSourceList);
      }
    }
  }, [data?.results, setSourceList, currentSourceList]);

  const uniqueEngines = useMemo(() => {
    const enginesFromResults = (data?.results || []).map(
      (r) => r.engineName || "Jackett"
    );
    const enginesFromPlugins = (installedPlugins || [])
      .filter((p) => p.enabled)
      .map((p) => p.name);
    return [...new Set([...enginesFromResults, ...enginesFromPlugins])];
  }, [data?.results, installedPlugins]);

  const filteredResults = useMemo(() => {
    let results = (data?.results || [])
      .filter((Torr) => {
        if (props.filterState.qualitySelected !== undefined) {
          const qual = parseFromString(Torr.fileName, qualityAliases);
          return qual === props.filterState.qualitySelected;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.selectedSource !== "") {
          const type = parseFromString(Torr.fileName, typeAliases);
          return type === props.filterState.selectedSource;
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (props.filterState.minSeeds !== "0") {
          return Torr.nbSeeders >= parseInt(props.filterState.minSeeds || "0");
        } else {
          return true;
        }
      })
      .filter((Torr) => {
        if (selectedEngines.length > 0) {
          return selectedEngines.includes(Torr.engineName || "Jackett");
        } else {
          return true;
        }
      });

    if (sortBy) {
      results = results.sort((a, b) => {
        let comparison = 0;
        if (sortBy === "fileName") {
          comparison = a.fileName.localeCompare(b.fileName);
        } else if (sortBy === "fileSize") {
          comparison = a.fileSize - b.fileSize;
        } else if (sortBy === "nbSeeders") {
          comparison = a.nbSeeders - b.nbSeeders;
        } else if (sortBy === "pubDate") {
          const parseDate = (date: any) => {
            const d = typeof date === "number" ? date : parseInt(date);
            if (d === -1) return 0; // Treat -1 as oldest (1970)
            if (!isNaN(d)) {
              return d < 30000000000 ? d * 1000 : d;
            }
            return new Date(date).getTime();
          };
          comparison = parseDate(a.pubDate) - parseDate(b.pubDate);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }

    return results;
  }, [
    data,
    props.filterState.selectedSource,
    props.filterState.minSeeds,
    props.filterState.qualitySelected,
    selectedEngines,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchId,
    props.filterState.selectedSource,
    props.filterState.minSeeds,
    props.filterState.qualitySelected,
    selectedEngines,
    sortBy,
    sortOrder,
    itemsPerPage,
  ]);

  const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortOptions = [
    { label: "None", onClick: () => setSortBy(""), checked: sortBy === "" },
    {
      label: "File Name",
      onClick: () => setSortBy("fileName"),
      checked: sortBy === "fileName",
    },
    {
      label: "File Size",
      onClick: () => setSortBy("fileSize"),
      checked: sortBy === "fileSize",
    },
    {
      label: "Seeders",
      onClick: () => setSortBy("nbSeeders"),
      checked: sortBy === "nbSeeders",
    },
    {
      label: "Publish Date",
      onClick: () => setSortBy("pubDate"),
      checked: sortBy === "pubDate",
    },
  ];

  return (
    <VStack>
      <IosSearch
        value={props.searchState[0]}
        onChange={(e) => props.searchState[1](e.target.value)}
        isLoading={createLoading}
        onSearch={() => createSearch(props.searchState[0])}
        placeholder={`Search ${props.category}...`}
      />

      {searchId && (
        <Flex
          position={"sticky"}
          top={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          rounded={"lg"}
          p={4}
          w={"100%"}
          backdropFilter={"blur(15px)"}
          bgColor={stickyBgColorInTab}
          zIndex={50}
        >
          <Flex alignItems={"center"} gap={4}>
            {data?.status !== "Stopped" && <Spinner color={"blue.500"} />}
            <Flex flexDirection={"column"} alignItems={"start"}>
              <Heading size={"md"}>
                {data?.status === "Stopped"
                  ? "Search stopped"
                  : "Search in progress..."}
              </Heading>
              <StatWithIcon
                icon={<IoList />}
                label={(data?.total || 0) + " Results"}
              />
            </Flex>
          </Flex>
          <LightMode>
            {data?.status === "Stopped" ? (
              <Button
                leftIcon={<IoClose />}
                colorScheme={"gray"}
                onClick={() => deleteSearch()}
              >
                Clear
              </Button>
            ) : (
              <Button
                leftIcon={<IoStop />}
                colorScheme={"blue"}
                onClick={() => stopSearch()}
              >
                Stop
              </Button>
            )}
          </LightMode>
        </Flex>
      )}
      <Filters
        {...props.filterState}
        indicator={selectedEngines.length + (sortBy ? 1 : 0)}
      >
        {uniqueEngines.length > 0 && (
          <Box>
            <FormLabel fontSize="sm" fontWeight="bold" mb={2}>
              Filter by Engine
            </FormLabel>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={Button}
                size="sm"
                variant="outline"
                rightIcon={<IoChevronDown />}
                w="full"
                textAlign="left"
                fontWeight="normal"
              >
                {selectedEngines.length > 0
                  ? `${selectedEngines.length} Engines Selected`
                  : "All Engines"}
              </MenuButton>
              <MenuList
                maxH="300px"
                overflowY="auto"
                backgroundColor={"transparent"}
                className={"glassEffect"}
                rounded={20}
                border={"none"}
                shadow={"xl"}
                p={0}
                zIndex={1001}
                overflow="hidden"
              >
                <Box className={"glassTint"} />
                <Box className={"glassShine"} />
                <Box position="relative" zIndex={3} py={2}>
                  <MenuOptionGroup
                    type="checkbox"
                    value={selectedEngines}
                    onChange={(val) => setSelectedEngines(val as string[])}
                  >
                    {uniqueEngines.map((engine) => (
                      <MenuItemOption
                        key={engine}
                        value={engine}
                        backgroundColor={"transparent"}
                        _hover={{
                          bgColor: ButtonBgColorHover,
                        }}
                        rounded={0}
                      >
                        {engine}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </Box>
              </MenuList>
            </Menu>
          </Box>
        )}

        {data?.results && data.results.length > 0 && (
          <Box>
            <FormLabel fontSize="sm" fontWeight="bold" mb={2}>
              Sort Results
            </FormLabel>
            <Flex gap={2}>
              <IosActionSheet
                disclosure={sortDisclosure}
                options={sortOptions}
                trigger={
                  <Button
                    size="sm"
                    variant="outline"
                    rightIcon={<IoFilter />}
                    onClick={sortDisclosure.onOpen}
                    flexGrow={1}
                    justifyContent="space-between"
                    fontWeight="normal"
                  >
                    {sortBy
                      ? sortOptions.find((o) => o.checked)?.label
                      : "Sort by..."}
                  </Button>
                }
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                px={3}
              >
                {sortOrder === "asc" ? <IoArrowUp /> : <IoArrowDown />}
              </Button>
            </Flex>
          </Box>
        )}
      </Filters>

      {data?.results && (
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="bold">
            Download Location
          </FormLabel>
          <Input
            size="sm"
            rounded="md"
            value={savePath}
            onChange={(e) => setSavePath(e.target.value)}
            placeholder="Enter save path"
            bg={inputBgColor}
          />
        </FormControl>
      )}

      {data?.results && (
        <SectionSM
          title={`Results (${filteredResults.length})`}
          titleRight={
            <CategorySelect
              category={addToCategory}
              onSelected={handleCategorySelect}
            />
          }
        >
          {currentResults.map((result) => (
            <TorrentDownloadBox
              key={result.fileUrl}
              magnetURL={result.fileUrl}
              title={result.fileName}
              category={addToCategory}
              savePath={savePath}
            >
              <SeedsAndPeers
                seeds={result.nbSeeders.toString()}
                peers={result.nbLeechers.toString()}
                size={result.fileSize}
                engine={result.engineName || "Jackett"}
                date={result.pubDate}
              />
            </TorrentDownloadBox>
          ))}
          {filteredResults.length > 0 && (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mt={4}
              gap={4}
              wrap="wrap"
            >
              {pageCount > 1 && (
                <Flex alignItems="center" gap={2}>
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    isDisabled={currentPage === 1}
                    size="sm"
                    leftIcon={<IoChevronBack />}
                  >
                    Prev
                  </Button>
                  <Text fontSize="sm" whiteSpace="nowrap">
                    Page {currentPage} of {pageCount}
                  </Text>
                  <Button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(pageCount, p + 1))
                    }
                    isDisabled={currentPage === pageCount}
                    size="sm"
                    rightIcon={<IoChevronForward />}
                  >
                    Next
                  </Button>
                </Flex>
              )}
              <Flex alignItems="center" gap={2}>
                <Text fontSize="sm" whiteSpace="nowrap">
                  Items per page:
                </Text>
                <Select
                  size="sm"
                  width="80px"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  rounded="md"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Select>
              </Flex>
            </Flex>
          )}
        </SectionSM>
      )}
    </VStack>
  );
};

export default PluginSearch;
