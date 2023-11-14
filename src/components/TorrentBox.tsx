import React, {useEffect, useMemo, useState} from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import {TorrCategory, TorrTorrentInfo} from "../types";
import filesize from "filesize";
import {IoCalendar, IoCloudUpload, IoDownload, IoPricetags, IoServer, IoSpeedometer,} from "react-icons/io5";
import {StatWithIcon} from "./StatWithIcon";
import {TorrentProgress} from "./TorrentProgress";
import TorrentActions from "./TorrentActions";

export interface TorrentBoxProps {
  torrentData: Omit<TorrTorrentInfo, "hash">;
  hash: string;
  categories: TorrCategory[];
  loading?: boolean;
  style?: any;
}

export type waitingStates = "" | "mainBtn" | "category" | "name";

export const useTorrentWaiting = (torrent: TorrTorrentInfo) => {
  const state = useState<waitingStates | undefined>();

  useEffect(() => {
    state[1]("");
  }, [torrent.state, torrent.category, torrent.name]);

  return state;
};

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

  const isPaused = ["pausedDL", "pausedUP"].includes(torrentData.state);

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

  const [waiting, setWaiting] = useTorrentWaiting({...torrentData, hash});

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
        <TorrentProgress torrent={{...torrentData, hash}}/>
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
          <TorrentActions
            waiting={waiting}
            setWaiting={setWaiting}
            torrentData={torrentData}
            hash={hash}
            categories={categories}
          />
        </Flex>
      </Box>
    </div>
  );
};

export default TorrentBox;
