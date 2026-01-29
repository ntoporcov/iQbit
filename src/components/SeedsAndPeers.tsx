import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { StatWithIcon } from "./StatWithIcon";
import {IoCalendar, IoEarth, IoPeople, IoServer} from "react-icons/io5";
import { useIsLargeScreen } from "../utils/screenSize";
import filesize from "filesize";
export interface SeedsAndPeersProps {
  seeds: string;
  peers: string;
  size?: number;
  engine?: string;
  date?: string;
}

const SeedsAndPeers = ({ seeds, peers, size, engine, date }: SeedsAndPeersProps) => {
  const isLarge = useIsLargeScreen();

  return (
    <Flex gap={3} justifyContent={isLarge ? "flex-start" : "center"} wrap={"wrap"}>
      <StatWithIcon
        lit
        icon={<IoPeople />}
        label={
          <Text as={"span"} fontSize={"md"}>
            {seeds} Seeds
          </Text>
        }
      />
      <StatWithIcon
        lit
        icon={<IoPeople />}
        label={
          <Text as={"span"} fontSize={"md"}>
            {peers} Peers
          </Text>
        }
      />
      {size && (
        <StatWithIcon
          lit
          icon={<IoServer />}
          label={
            <Text as={"span"} fontSize={"md"}>
              {filesize(size, { round: 1 })}
            </Text>
          }
        />
      )}
      {engine && (
        <StatWithIcon
          lit
          icon={<IoEarth />}
          label={
            <Text as={"span"} fontSize={"md"}>
              {engine}
            </Text>
          }
        />
      )}
      {date && (
        <StatWithIcon
          lit
          icon={<IoCalendar />}
          label={
            <Text as={"span"} fontSize={"md"}>
              {(() => {
                const d = typeof date === "number" ? date : parseInt(date);
                if (d === -1) return "Unknown";
                // If it's an epoch in seconds (less than year 3000 in ms), multiply by 1000
                const dateObj = d < 30000000000 ? new Date(d * 1000) : new Date(d);
                return isNaN(dateObj.getTime()) ? date : dateObj.toLocaleDateString();
              })()}
            </Text>
          }
        />
      )}
    </Flex>
  );
};

export default SeedsAndPeers;
