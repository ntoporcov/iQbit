import React from "react";
import {Flex, Text} from "@chakra-ui/react";
import {StatWithIcon} from "./StatWithIcon";
import {IoPeople} from "react-icons/io5";
import {useIsLargeScreen} from "../utils/screenSize";

export interface SeedsAndPeersProps {
  seeds: string;
  peers: string;
}

const SeedsAndPeers = ({ seeds, peers }: SeedsAndPeersProps) => {
  const isLarge = useIsLargeScreen();

  return (
    <Flex gap={3} justifyContent={isLarge ? "flex-start" : "center"}>
      <StatWithIcon
        lit
        icon={<IoPeople />}
        label={<Text fontSize={"md"}>{seeds} Seeds</Text>}
      />
      <StatWithIcon
        lit
        icon={<IoPeople />}
        label={<Text fontSize={"md"}>{peers} Peers</Text>}
      />
    </Flex>
  );
};

export default SeedsAndPeers;
