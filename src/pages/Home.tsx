import PageHeader from "../components/PageHeader";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  LightMode,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Switch,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { IoDocumentAttach, IoPause, IoPlay, IoClose, IoTrash } from "react-icons/io5";
import { useMutation, useQuery } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { useMemo, useState } from "react";
import TorrentBox from "../components/TorrentBox";
import { TorrTorrentInfo } from "../types";
import IosBottomSheet from "../components/ios/IosBottomSheet";
import { Input } from "@chakra-ui/input";
import { randomTorrent } from "../data";
import "react-virtualized/styles.css";
import { FilterHeading } from "../components/Filters";
import stateDictionary from "../utils/StateDictionary";
import { useLocalStorage } from "usehooks-ts";
import { useFontSizeContext } from "../components/FontSizeProvider";
import { useQueryClient } from "react-query";

import { useIsLargeScreen } from "../utils/screenSize";
import { useIsPWA } from "../hooks/useIsPWA";

import { List, WindowScroller } from "react-virtualized";

const Home = () => {
  const queryClient = useQueryClient();
  const isLarge = useIsLargeScreen();
  const isPWA = useIsPWA();
  
  const { mutate: resumeAll } = useMutation("resumeAll", TorrClient.resumeAll);

  const { mutate: pauseAll } = useMutation("resumeAll", TorrClient.pauseAll);

  const [rid, setRid] = useState(0);

  const [torrentsTx, setTorrentsTx] = useState<{
    [i: string]: TorrTorrentInfo;
  }>({});

  const [removedTorrs, setRemovedTorrs] = useState<string[]>([]);
  const [selectedTorrents, setSelectedTorrents] = useState<string[]>([]);

  const toggleSelection = (hash: string) => {
    setSelectedTorrents((prev) => {
      if (prev.includes(hash)) {
        return prev.filter((h) => h !== hash);
      } else {
        return [...prev, hash];
      }
    });
  };

  const deleteMultipleDisclosure = useDisclosure();
  const { mutate: removeMultiple } = useMutation(
    "deleteMultipleTorrents",
    async (deleteFiles: boolean) => {
      await Promise.all(
        selectedTorrents.map((hash) => TorrClient.remove(hash, deleteFiles))
      );
    },
    {
      onSuccess: () => {
        setSelectedTorrents([]);
        deleteMultipleDisclosure.onClose();
        queryClient.invalidateQueries("torrentsTxData");
      },
    }
  );

  const { mutate: pauseMultiple } = useMutation(
    "pauseMultipleTorrents",
    async () => {
      await Promise.all(
        selectedTorrents.map((hash) => TorrClient.pause(hash))
      );
    },
    {
      onSuccess: () => {
        setSelectedTorrents([]);
        queryClient.invalidateQueries("torrentsTxData");
      },
    }
  );

  const { mutate: resumeMultiple } = useMutation(
    "resumeMultipleTorrents",
    async () => {
      await Promise.all(
        selectedTorrents.map((hash) => TorrClient.resume(hash))
      );
    },
    {
      onSuccess: () => {
        setSelectedTorrents([]);
        queryClient.invalidateQueries("torrentsTxData");
      },
    }
  );

  const { data: categories } = useQuery(
    "torrentsCategory",
    TorrClient.getCategories
  );

  const { isLoading } = useQuery(
    "torrentsTxData",
    () => TorrClient.sync(rid),
    {
      refetchInterval: 1000,
      refetchOnWindowFocus: false,
      async onSuccess(data) {
        setRid(data.rid);
        setRemovedTorrs((curr) => [...curr, ...(data.torrents_removed || [])]);

        if (data.full_update) {
          // await refetch();
          setTorrentsTx(data.torrents as any);
        } else {
          if (!data.torrents) return;

          Object.entries(data.torrents).forEach(([hash, info]) => {
            Object.entries(info).forEach(([key, val]) => {
              setTorrentsTx((curr) => {
                const newObject = {
                  ...curr,
                  [hash]: {
                    ...curr[hash],
                    [key]: val,
                  },
                };

                if ((data.torrents_removed || []).includes(hash)) {
                  delete newObject[hash];
                }

                return newObject;
              });
            });
          });
        }
      },
    }
  );

  const addModalDisclosure = useDisclosure();
  const [textArea, setTextArea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [automaticManagment, setAutomaticManagment] = useState(false);
  const [sequentialDownload, setSequentialDownload] = useState(false);
  const [firstAndLastPiece, setFirstAndLastPiece] = useState(false);
  const [downloadFolder, setDownloadFolder] = useState<string>("");

  const [fileError, setFileError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [draggingOver, setDraggingOver] = useState(false);

  const { data: settings } = useQuery(
    "settings-mainpage",
    TorrClient.getSettings,
    { refetchInterval: 30000 }
  );

  const validateAndSelectFiles = (fileList: FileList) => {
    let validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.name.endsWith(".torrent")) {
        validFiles.push(file);
      } else {
        setFileError("One or more files are not .torrent files");
        setDraggingOver(false);
        return;
      }
    }
    setFiles(validFiles);
    setFileError("");
    setDraggingOver(false);
  };

  const { mutate: attemptAddTorrent, isLoading: attemptAddLoading } = useMutation(
    async (opts: { autoTmm?: boolean, payload?: string | File | File[], downloadFolder?: string, category?: string }) => {
      if (!!textArea) {
        return await TorrClient.addTorrent("urls", textArea, opts.category, opts.downloadFolder);
      } else {
        if (Array.isArray(opts.payload)) {
          return await Promise.all(opts.payload.map((file) => TorrClient.addTorrent("torrents", file, opts.category || "", opts.downloadFolder)));
        } else {
          return await TorrClient.addTorrent("torrents", opts.payload as File, opts.category, opts.downloadFolder);
        }
      }
    },
    { 
      onSuccess: () => {
        // Clear form
        setTextArea("");
        setFiles([]);
        setSelectedCategory("");
        setDownloadFolder("");
        
        addModalDisclosure.onClose();
        // Invalidate the sync query to force a full update and show new torrent immediately
        queryClient.invalidateQueries("torrentsTxData");
      }
    }
  );

  const filterDisclosure = useDisclosure();
  const [filterSearch, setFilterSearch] = useLocalStorage(
    "home-filter-search",
    ""
  );
  const [filterCategory, setFilterCategory] = useLocalStorage(
    "home-filter-category",
    "Show All"
  );
  const [filterStatus, setFilterStatus] = useLocalStorage(
    "home-filter-status",
    "Show All"
  );

  const resetFilters = () => {
    setFilterStatus("Show All");
    setFilterCategory("Show All");
    setFilterSearch("");
  };

  const bgColor = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const filterIndicator = useMemo(() => {
    let indicator = 0;
    if (filterSearch !== "") indicator++;
    if (filterStatus !== "Show All") indicator++;
    if (filterCategory !== "Show All") indicator++;

    return indicator;
  }, [filterCategory, filterSearch, filterStatus]);

  const Torrents = useMemo(() => {
    if (torrentsTx === undefined) {
      return [];
    }

    return Object.entries(torrentsTx)
      ?.sort((a, b) => b[1]?.added_on - a[1]?.added_on)
      ?.filter(([hash]) => !removedTorrs.includes(hash))
      ?.filter(([hash, torr]) =>
        filterCategory !== "Show All" ? torr.category === filterCategory : true
      )
      ?.filter(([hash, torr]) =>
        filterStatus !== "Show All" ? torr.state === filterStatus : true
      )
      ?.filter(([hash, torr]) => torr.name.includes(filterSearch));
  }, [torrentsTx, removedTorrs, filterCategory, filterStatus, filterSearch]);

  const Categories = useMemo(() => {
    return Object.values(categories || {}).map((c) => ({
      label: c.name,
      value: c.name,
    }));
  }, [categories]);

  const fontSizeContext = useFontSizeContext();

  return (
    <WindowScroller>
      {({ isScrolling, scrollTop, width, height }) => (
        <Flex flexDirection={"column"} width={"100%"}>
          <PageHeader
            title={"Downloads"}
            onAddButtonClick={addModalDisclosure.onOpen}
            rightSlot={
              <>
                <IconButton
                  onClick={() => resumeAll()}
                  variant={"ghost"}
                  aspectRatio={"1 / 1"}
                  rounded={9999}
                  aria-label={"Resume All"}
                  color={"text"}
                  _hover={{
                    bgColor: "grayAlpha.400",
                  }}
                >
                  <IoPlay />
                </IconButton>
                <IconButton
                  onClick={() => pauseAll()}
                  variant={"ghost"}
                  aspectRatio={"1 / 1"}
                  rounded={9999}
                  aria-label={"Pause All"}
                  color={"text"}
                  _hover={{
                    bgColor: "grayAlpha.400",
                  }}
                >
                  <IoPause />
                </IconButton>
              </>
            }
            isHomeHeader
          />

          <IosBottomSheet title={"Add Torrent"} disclosure={addModalDisclosure}>
            <VStack gap={4}>
              <FormControl isDisabled={files.length > 0}>
                <FormLabel>{"Magnet Link / URL"}</FormLabel>
                <Textarea
                  _disabled={{ bgColor: "gray.50" }}
                  value={textArea}
                  onChange={(e) => setTextArea(e.target.value)}
                />
              </FormControl>
              <FormControl isDisabled={!!textArea} isInvalid={!!fileError}>
                <Flex
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={2}
                >
                  <FormLabel mb={0}>{"Add with .torrent file"}</FormLabel>
                  {files.length > 0 && (
                    <Button
                      size={"sm"}
                      variant={"ghost"}
                      colorScheme={"blue"}
                      onClick={(e) => {
                        e.preventDefault();
                        setFiles([]);
                      }}
                    >
                      {"Clear"}
                    </Button>
                  )}
                </Flex>
                <Flex
                  gap={4}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  position={"relative"}
                  borderColor={files.length > 0 ? "green.500" : "blue.500"}
                  borderWidth={1}
                  rounded={"lg"}
                  bgColor={
                    draggingOver ? "blue.500" : files.length > 0 ? "green.50" : "blue.50"
                  }
                  p={4}
                  color={
                    draggingOver ? "white" : files.length > 0 ? "green.500" : "blue.500"
                  }
                  opacity={!!textArea ? 0.5 : undefined}
                >
                  <IoDocumentAttach size={40} />
                  <Heading size={"sm"} noOfLines={1}>
                    {draggingOver ? "Drop it" : files.length > 0 ? (files.length === 1 ? files[0].name : `${files.length} files selected`) : "Click or Drag and Drop"}
                  </Heading>
                  <Input
                    accept={".torrent"}
                    multiple
                    onDragEnter={() => {
                      if (!!textArea) return;
                      setFileError("");
                      setDraggingOver(true);
                    }}
                    onDragLeave={() => setDraggingOver(false)}
                    onDrop={(e) => validateAndSelectFiles(e.dataTransfer.files)}
                    onChange={(e) => e?.target?.files && validateAndSelectFiles(e.target.files)}
                    opacity={0}
                    _disabled={{ opacity: 0 }}
                    type={"file"}
                    position={"absolute"}
                    top={0}
                    width={"100%"}
                    height={"100%"}
                  />
                </Flex>
                <FormErrorMessage>{fileError}</FormErrorMessage>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="automaticManagment" mb="0">
                  Automatic Managment
                </FormLabel>
                <Switch
                  id="automaticManagment"
                  isChecked={automaticManagment}
                  onChange={(e) => {
                    setAutomaticManagment(e.target.checked);
                  }}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="sequentialDownload" mb="0">
                  Sequential Download
                </FormLabel>
                <Switch
                  id="sequentialDownload"
                  isChecked={sequentialDownload}
                  onChange={(e) => {
                    setSequentialDownload(e.target.checked);
                  }}
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="firstAndLastPiece" mb="0">
                  Download first and last piece first
                </FormLabel>
                <Switch
                  id="firstAndLastPiece"
                  isChecked={firstAndLastPiece}
                  onChange={(e) => {
                    setFirstAndLastPiece(e.target.checked);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Download Folder</FormLabel>
                <Input
                  type="text"
                  value={downloadFolder || ((settings as any)?.save_path || '')}
                  onChange={(e) => setDownloadFolder(e.target.value)}
                />
              </FormControl>
              {Categories.length && (
                <FormControl>
                  <FormLabel>{"Category"}</FormLabel>
                  <Select
                    placeholder="Select category"
                    value={selectedCategory}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSelectedCategory(selected);
                      // Auto-set download folder from category's savePath
                      if (selected && categories && categories[selected]) {
                        setDownloadFolder(categories[selected].savePath);
                      }
                    }}
                  >
                    {Categories.map((c) => (
                      <option key={c.label}>{c.label}</option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </VStack>
            <LightMode>
              <Button
                disabled={!textArea && files.length === 0}
                isLoading={attemptAddLoading}
                width={"100%"}
                size={"lg"}
                colorScheme={"blue"}
                mt={16}
                onClick={() =>
                  attemptAddTorrent({ 
                    autoTmm: settings?.auto_tmm_enabled, 
                    downloadFolder, 
                    category: selectedCategory,
                    payload: !!textArea ? textArea : files 
                  })
                }
              >
                {"Add Torrent"}
              </Button>
            </LightMode>
          </IosBottomSheet>

          <Box bgColor={bgColor} rounded={"lg"} mb={5} mt={10}>
            <FilterHeading
              indicator={filterIndicator}
              disclosure={filterDisclosure}
            />
            {filterDisclosure.isOpen && (
              <Flex flexDirection={"column"} gap={5} px={5} pb={5}>
                <FormControl>
                  <FormLabel>Search</FormLabel>
                  <Input
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option>Show All</option>
                    {Categories.map((cat) => (
                      <option key={cat.label}>{cat.label}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>Show All</option>
                    {Object.entries(stateDictionary).map(([key, data]) => (
                      <option key={key} value={key}>
                        {data.short}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>
            )}
          </Box>

          <Flex flexDirection={"column"} gap={5}>
            {!Torrents?.length && isLoading && filterIndicator === 0 && Array.from(Array(10).keys()).map((key) => (
              <TorrentBox
                key={key}
                torrentData={randomTorrent}
                categories={[]}
                hash={""}
                loading
              />
            ))}

            {Torrents.length === 0 && filterIndicator > 0 && (
              <Flex alignItems={"center"} flexDirection={"column"} gap={4}>
                <Heading size={"md"}>Could not find any results</Heading>
                <LightMode>
                  <Button onClick={resetFilters} colorScheme={"blue"}>
                    Reset Filters
                  </Button>
                </LightMode>
              </Flex>
            )}

            <List
              autoWidth
              rowCount={Torrents.length}
              rowHeight={(230 * fontSizeContext.scale) / 100}
              width={width}
              height={height}
              scrollTop={scrollTop}
              isScrolling={isScrolling}
              containerStyle={{
                paddingBottom: "300px",
                boxSizing: "content-box",
              }}
              rowRenderer={({
                key, // Unique key within array of rows
                index, // Index of row within collection
                style, // Style object to be applied to row (to position it)
              }) => (
                <TorrentBox
                  key={key}
                  torrentData={Torrents[index][1]}
                  hash={Torrents[index][0]}
                  categories={Object.values(categories || {})}
                  isSelected={selectedTorrents.includes(Torrents[index][0])}
                  selectionMode={selectedTorrents.length > 0}
                  toggleSelection={toggleSelection}
                  style={{
                    ...style,
                    paddingBottom:
                      index === Torrents.length - 1 ? "30vh" : undefined,
                  }}
                />
              )}
            />

            {selectedTorrents.length > 0 && (
              <Box
                position="fixed"
                bottom={
                  isLarge
                    ? 12
                    : isPWA
                    ? "calc(140px + env(safe-area-inset-bottom))"
                    : "130px"
                }
                left="50%"
                transform="translateX(-50%)"
                zIndex={1000}
                bgColor={bgColor}
                boxShadow="lg"
                rounded="full"
                px={6}
                py={3}
                display="flex"
                alignItems="center"
                gap={4}
                borderWidth={1}
                borderColor={borderColor}
              >
                <Text fontWeight="bold">
                  {selectedTorrents.length} selected
                </Text>
                <HStack>
                  <IconButton
                    aria-label="Resume selected"
                    icon={<IoPlay />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => resumeMultiple()}
                  />
                  <IconButton
                    aria-label="Pause selected"
                    icon={<IoPause />}
                    size="sm"
                    colorScheme="orange"
                    onClick={() => pauseMultiple()}
                  />
                  <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<IoTrash />}
                    onClick={deleteMultipleDisclosure.onOpen}
                  >
                    Delete
                  </Button>
                </HStack>
                <IconButton
                  aria-label="Cancel selection"
                  icon={<IoClose />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedTorrents([])}
                />
              </Box>
            )}

            <IosBottomSheet
              title="Delete Torrents"
              disclosure={deleteMultipleDisclosure}
            >
              <VStack gap={3} pb={6}>
                <Text>
                  Are you sure you want to delete {selectedTorrents.length}{" "}
                  torrents?
                </Text>
                <Button
                  width="100%"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => removeMultiple(false)}
                >
                  Remove
                </Button>
                <Button
                  width="100%"
                  colorScheme="red"
                  onClick={() => removeMultiple(true)}
                >
                  Remove and delete files
                </Button>
              </VStack>
            </IosBottomSheet>

            {/*{Object.entries(torrentsTx)*/}
            {/*  ?.sort((a, b) => b[1]?.added_on - a[1]?.added_on)*/}
            {/*  ?.filter(([hash]) => !removedTorrs.includes(hash))*/}
            {/*  ?.map(([hash, info]) => (*/}
            {/*    <TorrentBox*/}
            {/*      key={hash}*/}
            {/*      torrentData={info}*/}
            {/*      hash={hash}*/}
            {/*      categories={Object.values(categories || {})}*/}
            {/*    />*/}
            {/*  ))}*/}
          </Flex>
        </Flex>
      )}
    </WindowScroller>
  );
};

export default Home;
