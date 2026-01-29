import React, { ReactNode } from "react";
import {
  Button,
  Flex,
  Heading,
  LightMode,
  Text,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useIsLargeScreen } from "../utils/screenSize";
import { IoChevronBack } from "react-icons/io5";
import { GlassContainer } from "./GlassContainer";

export interface PageHeaderProps {
  title: string;
  onAddButtonClick?: () => void;
  isHomeHeader?: boolean;
  buttonLabel?: string;
  onBackButtonPress?: () => void;
  rightSlot?: ReactNode;
}

const PageHeader = (props: PageHeaderProps) => {
  const isLarge = useIsLargeScreen();

  return (
    <Flex
      position={props.isHomeHeader ? "sticky" : "unset"}
      top="max(20px, env(safe-area-inset-top))"
      left={0}
      pb={2}
      width={"100%"}
      justifyContent={"space-between"}
      zIndex={"docked"}
      alignItems={"center"}
    >
      <Flex gap={2} grow={1} alignItems={"center"}>
        {props.onBackButtonPress && (
          <Button
            variant={"ghost"}
            onClick={() => props.onBackButtonPress && props.onBackButtonPress()}
            width={12}
            h={12}
            p={1}
          >
            <IoChevronBack size={25} />
          </Button>
        )}
        <Heading size={"xl"} m={0}>
          {props.title}
        </Heading>
      </Flex>
      {props.rightSlot && (
        <GlassContainer rounded={9999} p={1} mr={2} noTint>
          <LightMode>{props.rightSlot}</LightMode>
        </GlassContainer>
      )}
      <LightMode>
        {props?.onAddButtonClick && (
          <Button
            position={"relative"}
            rounded={"100%"}
            width={12}
            height={12}
            colorScheme={"blue"}
            onClick={props.onAddButtonClick}
            role={"group"}
          >
            <Text
              position={"absolute"}
              right={"110%"}
              mr={3}
              color={"blue.500"}
              fontWeight={"semibold"}
              opacity={0}
              _groupHover={{ opacity: isLarge ? 1 : 0 }}
            >
              {props?.buttonLabel}
            </Text>
            <FaPlus size={40} />
          </Button>
        )}
      </LightMode>
    </Flex>
  );
};

export default PageHeader;
