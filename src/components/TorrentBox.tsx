import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  LightMode,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Skeleton,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { TorrCategory, TorrTorrentInfo } from "../types";
import stateDictionary from "../utils/StateDictionary";
import filesize from "filesize";
import {
  IoArrowDown,
  IoCalendar,
  IoCloudUpload,
  IoDownload,
  IoOptions,
  IoPause,
  IoPlay,
  IoPricetags,
  IoServer,
  IoSpeedometer,
} from "react-icons/io5";
import { StatWithIcon } from "./StatWithIcon";
import { useMutation } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import IosActionSheet from "./ios/IosActionSheet";
import IosBottomSheet from "./ios/IosBottomSheet";
import { Input } from "@chakra-ui/input";
import TorrentInformationContent from "./TorrentInformationContent";
import { CreateETAString } from "../utils/createETAString";

export interface TorrentBoxProps {
  torrentData: Omit<TorrTorrentInfo, "hash">;
  hash: string;
  categories: TorrCategory[];
  loading?: boolean;
  style?: any;
}

const TorrentBox = ({
  torrentData,
  hash,
  categories,
  loading,
  style,
}: TorrentBoxProps) => {
  const BoxShadow = useColorModeValue("lg", "dark-lg");
  const BoxBg = useColorModeValue("white", "gray.900");

  const isDone = (torrentData.progress || 0) >= 1;

  const isPaused = ["pausedDL", "pausedUP", "stoppedUP", "stoppedDL"].includes(torrentData.state);

  const isDownloading = [
    "downloading",
    "metaDL",
    "queuedDL",
    "stalledDL",
    "checkingDL",
    "forceDL",
    "checkingResumeData",
    "allocating",
  ].includes(torrentData.state);

  const date = new Date(0);
  date.setSeconds(torrentData.eta); // specify value for SECONDS here
  const timeString = torrentData.eta ? CreateETAString(date) : "";

  const [waiting, setWaiting] = useState<
    | ""
    | "mainBtn"
    | "category"
    | "name"
    | "sequential"
    | "firstLastPriority"
    | "autoManagement"
  >();

  useEffect(() => {
    setWaiting("");
  }, [
    torrentData.state,
    torrentData.category,
    torrentData.name,
    torrentData.seq_dl,
    torrentData.f_l_piece_prio,
    torrentData.auto_tmm,
  ]);

  const { mutate: pause } = useMutation(
    "pauseTorrent",
    () => TorrClient.pause(hash),
    {
      onMutate: () => setWaiting("mainBtn"),
      onError: () => setWaiting(""),
    }
  );

  const { mutate: resume } = useMutation(
    "resumeTorrent",
    () => TorrClient.resume(hash),
    {
      onMutate: () => setWaiting("mainBtn"),
      onError: () => setWaiting(""),
    }
  );

  const deleteConfirmationDisclosure = useDisclosure();
  const { mutate: remove } = useMutation(
    "deleteTorrent",
    (deleteFiles: boolean) => TorrClient.remove(hash, deleteFiles),
    {
      onMutate: () => setWaiting("mainBtn"),
      onError: () => setWaiting(""),
    }
  );

  const categoryChangeDisclosure = useDisclosure();
  const { mutate: changeCategory } = useMutation(
    "changeCategory",
    (category: string) => TorrClient.setTorrentCategory(hash, category),
    {
      onMutate: () => setWaiting("category"),
      onError: () => setWaiting(""),
    }
  );

  const [newName, setNewName] = useState(torrentData.name);
  const renameTorrentDisclosure = useDisclosure();
  const { mutate: renameTorrent, isLoading: renameLoading } = useMutation(
    "changeCategory",
    () => TorrClient.renameTorrent(hash, newName),
    {
      onMutate: () => setWaiting("name"),
      onError: () => setWaiting(""),
      onSuccess: () => renameTorrentDisclosure.onClose(),
    }
  );

  const { mutate: toggleSequentialDownload } = useMutation(
    "sequential-download",
    () => TorrClient.toggleSequentialDownload(hash),
    {
      onMutate: () => setWaiting("sequential"),
      onError: () => setWaiting(""),
    }
  );

  const { mutate: toggleFirstLastPiecePrio } = useMutation(
    "first-last-priority",
    () => TorrClient.toggleFirstLastPiecePrio(hash),
    {
      onMutate: () => setWaiting("firstLastPriority"),
      onError: () => setWaiting(""),
    }
  );

  const { mutate: toggleAutoManagement } = useMutation(
    "first-last-priority",
    async () => {
      return TorrClient.setAutoManagement(
        hash,
        (!torrentData.auto_tmm).toString()
      );
    },
    {
      onMutate: () => setWaiting("autoManagement"),
      onError: () => setWaiting(""),
    }
  );

  const TorrentInformationDisclosure = useDisclosure();

  const actionSheetDisclosure = useDisclosure();

  const memoizedLoading = useMemo(
    () => (
      <Box
        shadow={BoxShadow}
        px={5}
        py={4}
        rounded={"xl"}
        bgColor={"grayAlpha.200"}
      >
        <Skeleton
          height={5}
          width={(Math.random() * (100 - 40) + 40).toString() + "%"}
        />
        <Flex mt={2} gap={2}>
          <Skeleton height={4} width={24} />
          <Skeleton height={4} width={16} />
          <Skeleton height={4} width={12} />
        </Flex>
        <Flex
          mt={4}
          gap={2}
          justifyContent={"space-between"}
          alignItems={"end"}
        >
          <Skeleton
            height={8}
            width={16}
            startColor={"blue.500"}
            endColor={"blue.700"}
          />
          <Skeleton height={5} width={20} />
        </Flex>
        <Skeleton
          mt={2}
          height={3}
          width={"100%"}
          startColor={"blue.500"}
          endColor={"blue.700"}
        />
        <Flex mt={4} justifyContent={"space-between"} alignItems={"center"}>
          <Flex gap={2}>
            <Skeleton height={4} width={16} />
            <Skeleton height={4} width={24} />
          </Flex>
          <Flex gap={2}>
            <Skeleton height={8} width={12} />
            <Skeleton
              height={8}
              width={12}
              startColor={"blue.500"}
              endColor={"blue.700"}
            />
          </Flex>
        </Flex>
      </Box>
    ),
    //eslint-disable-next-line
    []
  );

  if (loading) {
    return memoizedLoading;
  }

  return (
    <div style={style}>
      <Box
        shadow={BoxShadow}
        px={5}
        py={4}
        rounded={"xl"}
        bgColor={BoxBg}
        mb={5}
      >
        <Popover placement={"top"}>
          <PopoverTrigger>
            <Flex alignItems={"center"}>
              <Heading
                textAlign={"left"}
                cursor={"pointer"}
                noOfLines={1}
                size={"lg"}
                _hover={{ base: {}, lg: { opacity: 0.7 } }}
              >
                {torrentData.name}
              </Heading>
              {waiting === "name" && (
                <Flex>
                  <Spinner size={"sm"} />
                </Flex>
              )}
            </Flex>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody textAlign={"center"}>{torrentData.name}</PopoverBody>
          </PopoverContent>
        </Popover>
        <HStack color={"grayAlpha.800"} gap={2}>
          <StatWithIcon
            icon={<IoCalendar />}
            label={new Date(torrentData.added_on * 1000).toLocaleDateString()}
          />
          <StatWithIcon
            icon={<IoServer />}
            label={filesize(torrentData.total_size, { round: 1 })}
          />
          <StatWithIcon
            loading={waiting === "category"}
            icon={<IoPricetags />}
            label={torrentData.category || "–"}
          />
        </HStack>
        <Flex mt={5} mb={2} justifyContent={"space-between"} alignItems={"end"}>
          <HStack alignItems={"end"}>
            <Heading color={"blue.500"} size={"lg"}>
              {(100 * torrentData.progress).toFixed(0)}%
            </Heading>
            {!isDone && (
              <Text color={"grayAlpha.600"}>
                {filesize(torrentData.downloaded, { round: 1 })}
              </Text>
            )}
          </HStack>
          <Heading size={"md"} opacity={0.25}>
            {torrentData.eta !== 8640000 ? (
              <span>{timeString}</span>
            ) : (
              <span>{stateDictionary[torrentData.state]?.short ?? torrentData.state}</span>
            )}
          </Heading>
        </Flex>
        <LightMode>
          <Progress
            rounded={100}
            size={"sm"}
            color={"blue.500"}
            value={100 * torrentData.progress}
          />
        </LightMode>
        <Flex justifyContent={"flex-end"} alignItems={"center"} mt={3}>
          {isPaused || (
            <Flex alignItems={"center"} gap={4} flexGrow={2}>
              <StatWithIcon
                lit={
                  isDownloading
                    ? torrentData.num_seeds > 0
                    : isDone
                    ? torrentData.num_leechs > 0
                    : false
                }
                icon={
                  isDownloading ? (
                    <IoDownload size={25} />
                  ) : (
                    <IoCloudUpload size={20} />
                  )
                }
                label={
                  isDownloading
                    ? torrentData.num_seeds
                    : isDone
                    ? torrentData.num_leechs
                    : 0
                }
              />
              <StatWithIcon
                lit={isDone ? torrentData.upspeed > 0 : torrentData.dlspeed > 0}
                icon={<IoSpeedometer />}
                label={
                  (isPaused
                    ? 0
                    : isDone
                    ? filesize(torrentData.upspeed, { round: 1 })
                    : filesize(torrentData.dlspeed, { round: 1 })) + "/s"
                }
              />
            </Flex>
          )}
          <Flex gap={0.5}>
            <IosActionSheet
              trigger={
                <Button
                  variant={"ghost"}
                  size={"md"}
                  onClick={actionSheetDisclosure.onOpen}
                >
                  <IoOptions size={25} />
                </Button>
              }
              disclosure={actionSheetDisclosure}
              options={[
                {
                  label: "Remove Torrent",
                  onClick: () => deleteConfirmationDisclosure.onOpen(),
                  danger: true,
                },
                {
                  label: "Change Category",
                  onClick: () => categoryChangeDisclosure.onOpen(),
                },
                {
                  label: `Sequential Download`,
                  onClick: toggleSequentialDownload,
                  checked: torrentData.seq_dl,
                },
                {
                  label: "First and Last piece first",
                  onClick: toggleFirstLastPiecePrio,
                  checked: torrentData.f_l_piece_prio,
                },
                {
                  label: "Automatic management",
                  onClick: toggleAutoManagement,
                  checked: torrentData.auto_tmm,
                },
                {
                  label: "Rename Torrent",
                  onClick: () => renameTorrentDisclosure.onOpen(),
                },
                {
                  label: "Torrent Information",
                  onClick: () => TorrentInformationDisclosure.onOpen(),
                },
              ]}
            />
            <IosActionSheet
              disclosure={deleteConfirmationDisclosure}
              options={[
                {
                  label: "Delete Files",
                  onClick: () => remove(true),
                  danger: true,
                },
                {
                  label: "Remove Torrent Only",
                  onClick: () => remove(false),
                },
              ]}
            />
            <IosActionSheet
              disclosure={categoryChangeDisclosure}
              options={categories
                .filter((cat) => torrentData.category !== cat.name)
                .map((cat) => ({
                  label: cat.name,
                  onClick: () => changeCategory(cat.name),
                }))}
            />
            {isPaused ? (
              <LightMode>
                <Button
                  size={"md"}
                  colorScheme={"blue"}
                  onClick={() => resume()}
                  isLoading={waiting === "mainBtn"}
                >
                  <IoPlay size={25} />
                </Button>
              </LightMode>
            ) : (
              <Button
                size={"md"}
                variant={"ghost"}
                color={"blue.500"}
                onClick={() => pause()}
                isLoading={waiting === "mainBtn"}
              >
                <IoPause size={25} />
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
      <IosBottomSheet
        title={"Rename Torrent"}
        disclosure={renameTorrentDisclosure}
      >
        <VStack gap={10}>
          <FormControl>
            <FormLabel>Rename Torrent</FormLabel>
            <Input
              disabled={renameLoading}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            {newName !== torrentData.name && (
              <FormHelperText fontSize={"sm"} textAlign={"center"}>
                <VStack mt={7}>
                  <span>{torrentData.name}</span>
                  <IoArrowDown />
                  <span>{newName}</span>
                </VStack>
              </FormHelperText>
            )}
          </FormControl>
          <LightMode>
            <Button
              disabled={newName === torrentData.name}
              colorScheme={"blue"}
              w={"100%"}
              onClick={() => renameTorrent()}
              isLoading={renameLoading}
            >
              Save New Name
            </Button>
          </LightMode>
        </VStack>
      </IosBottomSheet>
      <IosBottomSheet
        title={"Torrent Information"}
        disclosure={TorrentInformationDisclosure}
        modalProps={{ size: "3xl" }}
      >
        <TorrentInformationContent torrentData={{ ...torrentData, hash }} />
      </IosBottomSheet>
    </div>
  );
};

export default TorrentBox;
