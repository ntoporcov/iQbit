import React, { PropsWithChildren } from "react";
import { TorrTorrentInfo } from "../types";
import {
  Box,
  Button,
  Flex,
  GridItem,
  GridItemProps,
  Heading,
  LightMode,
  Progress,
  SimpleGrid,
  useDisclosure,
  useTheme,
} from "@chakra-ui/react";
import filesize from "filesize";
import SwarmVisualizer from "./SwarmVisualizer";
import { CreateETAString } from "../utils/createETAString";
import ActivityRing from "./ActivityRing";

export interface TorrentInformationContentProps {
  torrentData: TorrTorrentInfo;
}

const IosGridBox = ({
  children,
  title,
  ...props
}: PropsWithChildren<GridItemProps & { title?: string }>) => {
  return (
    <GridItem
      overflow={"hidden"}
      backgroundColor={"grayAlpha.300"}
      rounded={32}
      p={5}
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}
      justifyContent={"center"}
      gap={2}
      {...props}
    >
      {title && <Heading size={"lg"}>{title}</Heading>}
      {children}
    </GridItem>
  );
};

const defaultGap = 3;

const TorrentInformationContent = ({
  torrentData,
}: TorrentInformationContentProps) => {
  const { colors } = useTheme();

  const fullRatios = Math.floor(torrentData.ratio);
  const RatioRowAmount = fullRatios - 1;
  const showFullRatio = useDisclosure();

  const date = new Date(0);
  date.setSeconds(torrentData.eta); // specify value for SECONDS here
  const timeString = torrentData.eta ? CreateETAString(date) : "";

  return (
    <>
      <IosGridBox mb={3} title={"Torrent Name"}>
        <Heading wordBreak={"break-all"}>{torrentData.name}</Heading>
      </IosGridBox>
      <IosGridBox mb={3} title={"Save Location"}>
        <Heading size="sm" wordBreak={"break-all"} textAlign="center">
          {torrentData.save_path || torrentData.content_path || "Unknown"}
        </Heading>
      </IosGridBox>
      <SimpleGrid columns={4} templateRows={"auto"} gap={defaultGap}>
        <IosGridBox
          order={1}
          colSpan={{ base: 4, lg: 2 }}
          rowSpan={2}
          gap={0}
          pt={-2}
        >
          <Flex alignItems={"center"} gap={5} my={4}>
            <ActivityRing
              rings={[
                {
                  value: torrentData.ratio * 100,
                  color: colors.blue[500],
                },
              ]}
              size={100}
              strokeWidth={15}
            />
            <Heading>{torrentData.ratio.toFixed(2)} Ratio</Heading>
          </Flex>
          {RatioRowAmount > 0 && (
            <Flex
              gap={3}
              wrap={"wrap"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {Array.from(Array(RatioRowAmount).keys()).map(
                (value) =>
                  (value < 4 || showFullRatio.isOpen) && (
                    <Box
                      key={value}
                      w={16}
                      h={16}
                      rounded={"100%"}
                      borderWidth={12}
                      borderStyle={"solid"}
                      borderColor={"green.500"}
                    />
                  )
              )}
            </Flex>
          )}
          {torrentData.ratio > 6 && (
            <Button
              variant={"ghost"}
              w={"100%"}
              mt={3}
              onClick={showFullRatio.onToggle}
            >
              {showFullRatio.isOpen ? "Hide Some Rings" : "Show All Rings"}
            </Button>
          )}
        </IosGridBox>
        <IosGridBox
          order={2}
          title={"Torrent Size"}
          colSpan={{ base: 4, sm: 2 }}
          flexGrow={2}
          h={"100%"}
        >
          <Heading size={"2xl"} color={"green.500"}>
            {filesize(torrentData.size, { round: 1 })}
          </Heading>
        </IosGridBox>
        <IosGridBox
          order={3}
          title={"Uploaded"}
          colSpan={{ base: 4, sm: 2 }}
          flexGrow={2}
          h={"100%"}
        >
          <Heading size={"2xl"} color={"green.500"}>
            {filesize(torrentData.uploaded, { round: 1 })}
          </Heading>
        </IosGridBox>
        <IosGridBox
          order={4}
          title={"Download Progress"}
          flexGrow={2}
          h={"100%"}
          colSpan={4}
        >
          <LightMode>
            <Progress
              w={"100%"}
              rounded={100}
              size={"xs"}
              colorScheme={torrentData.progress === 1 ? "green" : "blue"}
              value={100 * torrentData.progress}
            />
          </LightMode>
          <Flex justifyContent={"space-between"} w={"100%"} wrap={"wrap"}>
            {[
              `${(100 * torrentData.progress).toFixed(0)}%`,
              timeString,
              filesize(torrentData.downloaded, { round: 1 }),
            ].map((string, index) => (
              <Heading
                key={index}
                size={"2xl"}
                color={torrentData.progress === 1 ? "green.500" : "blue.500"}
              >
                {string}
              </Heading>
            ))}
          </Flex>
        </IosGridBox>
        <IosGridBox order={5} colSpan={{ base: 4, md: 2 }} rowSpan={2}>
          <SwarmVisualizer
            height={32}
            connected={torrentData.num_seeds}
            swarm={torrentData.num_complete}
            label={"Seeds"}
          />
        </IosGridBox>
        <IosGridBox
          order={6}
          colSpan={{ base: 4, sm: 2 }}
          title={"Download Speed"}
        >
          <Heading
            size={"2xl"}
            color={torrentData.dlspeed > 0 ? "blue.500" : "gray.500"}
          >
            {filesize(torrentData.dlspeed, { round: 1 })}/s
          </Heading>
        </IosGridBox>
        <IosGridBox
          order={7}
          colSpan={{ base: 4, sm: 2 }}
          title={`Download Limit`}
        >
          <Heading
            size={"2xl"}
            color={torrentData.dl_limit > 0 ? "red.500" : "gray.500"}
          >
            {torrentData.dl_limit > 0 ? (
              <>{filesize(torrentData.dl_limit, { round: 1 })}/s</>
            ) : (
              "Unlimited"
            )}
          </Heading>
        </IosGridBox>
        <IosGridBox
          order={8}
          colSpan={{ base: 4, sm: 2 }}
          title={"Upload Speed"}
        >
          <Heading
            size={"2xl"}
            color={torrentData.upspeed > 0 ? "blue.500" : "gray.500"}
          >
            {filesize(torrentData.upspeed, { round: 1 })}/s
          </Heading>
        </IosGridBox>
        <IosGridBox
          order={{ base: 7, md: 9 }}
          colSpan={{ base: 4, md: 2 }}
          rowSpan={2}
        >
          <SwarmVisualizer
            height={32}
            connected={torrentData.num_leechs}
            swarm={torrentData.num_incomplete}
            label={"Leeches"}
          />
        </IosGridBox>
        <IosGridBox
          order={10}
          colSpan={{ base: 4, sm: 2 }}
          title={"Upload Limit"}
        >
          <Heading
            size={"2xl"}
            color={torrentData.up_limit > 0 ? "red.500" : "gray.500"}
          >
            {torrentData.up_limit > 0 ? (
              <>{filesize(torrentData.dl_limit, { round: 1 })}/s</>
            ) : (
              "Unlimited"
            )}
          </Heading>
        </IosGridBox>
      </SimpleGrid>
    </>
  );
};

export default TorrentInformationContent;
