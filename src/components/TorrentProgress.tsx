import {TorrTorrentInfo} from "../types";
import {CreateETAString} from "../utils/createETAString";
import {Flex, Heading, HStack, LightMode, Progress, Text,} from "@chakra-ui/react";
import filesize from "filesize";
import stateDictionary from "../utils/StateDictionary";
import React from "react";
import {useIsDesktopExpanded} from "../layout/default";

export function TorrentProgress({torrent}: { torrent: TorrTorrentInfo }) {
  const isDone = (torrent.progress || 0) >= 1;

  const date = new Date(0);
  date.setSeconds(torrent.eta); // specify value for SECONDS here
  const timeString = torrent.eta ? CreateETAString(date) : "";

  const expanded = useIsDesktopExpanded();

  return (
    <>
      <Flex
        mt={expanded ? 0 : 5}
        mb={expanded ? 1 : 2}
        justifyContent={"space-between"}
        alignItems={"end"}
        w={"full"}
      >
        <HStack alignItems={"end"}>
          <Heading color={"blue.500"} fontSize={expanded ? "md" : "lg"}>
            {(100 * torrent.progress).toFixed(0)}%
          </Heading>
          {!isDone && !expanded && (
            <Text color={"grayAlpha.600"}>
              {filesize(torrent.downloaded, {round: 1})}
            </Text>
          )}
        </HStack>
        <Heading size={"md"} opacity={0.25} fontSize={"sm"}>
          {torrent.eta !== 8640000 ? (
            <span>{timeString}</span>
          ) : (
            !expanded && <span>{stateDictionary[torrent.state].short}</span>
          )}
        </Heading>
      </Flex>
      <LightMode>
        <Progress
          height={expanded ? 1 : undefined}
          rounded={100}
          size={"sm"}
          color={"blue.500"}
          value={100 * torrent.progress}
        />
      </LightMode>
    </>
  );
}
