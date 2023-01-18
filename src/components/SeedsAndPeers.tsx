import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { StatWithIcon } from "./StatWithIcon";
import {IoPeople, IoServer} from "react-icons/io5";
import { useIsLargeScreen } from "../utils/screenSize";
import filesize from "filesize";
export interface SeedsAndPeersProps {
  seeds: string;
  peers: string;
  size?: number;
}

const SeedsAndPeers = ({ seeds, peers, size }: SeedsAndPeersProps) => {
  const isLarge = useIsLargeScreen();

  return (
    <Flex gap={3} justifyContent={isLarge ? "flex-start" : "center"}>
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
        />)}


    </Flex>
  );
};

export default SeedsAndPeers;
