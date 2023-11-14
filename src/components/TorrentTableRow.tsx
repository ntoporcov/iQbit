import React, {CSSProperties} from "react";
import {Box, BoxProps, Button, Flex, FlexProps, Text, Tooltip, useColorModeValue,} from "@chakra-ui/react";
import {TorrCategory, TorrTorrentInfo} from "../types";
import {TorrentProgress} from "./TorrentProgress";
import stateDictionary from "../utils/StateDictionary";
import {StatWithIcon} from "./StatWithIcon";
import {IoChevronDownCircle, IoDownload, IoServer,} from "react-icons/io5";
import filesize from "filesize";
import TorrentActions from "./TorrentActions";
import {useTorrentWaiting} from "./TorrentBox";
import useScrollPosition from "../hooks/useScrollPosition";

export interface TorrentTableRowProps {
  style: CSSProperties;
  bgColor: string;
  torrent: TorrTorrentInfo;
  hash: string;
  categories: TorrCategory[];
}

const colWidths = {
  name: {width: "20%"},
  progress: {width: "15%"},
  size: {width: "15%"},
  download: {width: "15%"},
  upload: {width: "15%"},
};

const sharedCellProps = (key: keyof typeof colWidths): BoxProps => {
  return {
    px: 5,
    fontSize: "sm",
    fontWeight: "bold",
    display: "flex",
    flexDir: "column",
    justifyContent: "center",
    ...colWidths[key],
  };
};

const actionColProps: FlexProps = {
  justifyContent: "flex-end",
  grow: 2,
  pr: 2,
  alignItems: "center",
};

export const TorrentTableHeading = ({bgColor}: { bgColor: string }) => {

  const scroll = useScrollPosition();

  console.log(scroll)

  return (
    <Flex rounded={"lg"} bgColor={bgColor} mb={3} py={1} position={'sticky'} top={'100px'} zIndex={2000} shadow={'xl'}>
      <Box {...sharedCellProps("name")}>Name</Box>
      <Box {...sharedCellProps("progress")}>Progress</Box>
      <Box {...sharedCellProps("size")}>Size</Box>
      <Box {...sharedCellProps("download")}>Download</Box>
      <Box {...sharedCellProps("upload")}>Upload</Box>
      <Flex {...actionColProps}>
        <Button size={'sm'} variant={'ghost'}>
          <IoChevronDownCircle/>
        </Button>
      </Flex>
    </Flex>
  );
};

const TorrentTableRow = ({
                           style,
                           bgColor,
                           torrent,
                           hash,
                           categories,
                         }: TorrentTableRowProps) => {
  const hoverBgColor = useColorModeValue("gray.50", "gray.800");

  const [waiting, setWaiting] = useTorrentWaiting({...torrent, hash});

  return (
    <Flex
      style={style}
      bgColor={bgColor}
      _first={{roundedTop: "xl"}}
      _last={{roundedBottom: "xl"}}
      _hover={{bgColor: hoverBgColor}}
    >
      <Box {...sharedCellProps("name")}>
        <Tooltip label={torrent.name} placement={"top-start"}>
          <Text noOfLines={1} textOverflow={"ellipsis"} fontSize={"sm"}>
            {torrent.name}
          </Text>
        </Tooltip>
        <Tooltip
          label={stateDictionary[torrent.state].long}
          placement={"top-start"}
        >
          <Text
            noOfLines={1}
            textOverflow={"ellipsis"}
            fontSize={"xs"}
            opacity={0.5}
          >
            {stateDictionary[torrent.state].short}
          </Text>
        </Tooltip>
      </Box>
      <Box {...sharedCellProps("progress")}>
        <TorrentProgress torrent={torrent}/>
      </Box>
      <Box {...sharedCellProps("size")}>
        <StatWithIcon
          icon={<IoServer opacity={0.2}/>}
          label={filesize(torrent.total_size, {round: 1})}
        />
      </Box>
      <Box {...sharedCellProps("download")}>
        <StatWithIcon
          icon={<IoDownload opacity={0.2}/>}
          label={filesize(torrent.dlspeed, {round: 1})}
        />
      </Box>
      <Box {...sharedCellProps("upload")}>
        <StatWithIcon
          icon={<IoDownload opacity={0.2}/>}
          label={filesize(torrent.upspeed, {round: 1})}
        />
      </Box>
      <Flex {...actionColProps}>
        <TorrentActions
          waiting={waiting}
          setWaiting={setWaiting}
          torrentData={torrent}
          hash={hash}
          categories={categories}
        />
      </Flex>
    </Flex>
  );
};

export default TorrentTableRow;
