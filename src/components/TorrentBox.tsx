import React from "react";
import { Box, Flex, Heading, Progress } from "@chakra-ui/react";
import { TorrTorrentInfo } from "../types";
import stateDictionary from "../utils/StateDictionary";

export interface TorrentBoxProps {
  torrentData: TorrTorrentInfo;
}

const TorrentBox = ({ torrentData }: TorrentBoxProps) => {
  return (
    <Box shadow={"lg"} p={5} rounded={"xl"}>
      <Heading size={"lg"}>{torrentData.name}</Heading>
      <Flex mt={5} mb={2} justifyContent={"space-between"}>
        <Heading color={"blue.500"} size={"md"}>
          {100 / torrentData.progress}%
        </Heading>
        <Heading size={"md"} opacity={0.25}>
          {stateDictionary[torrentData.state].short}
        </Heading>
      </Flex>
      <Progress
        rounded={100}
        size={"sm"}
        color={"blue.500"}
        isAnimated
        value={100 / torrentData.progress}
      />
    </Box>
  );
};

export default TorrentBox;
