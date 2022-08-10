import React from "react";
import {
  Button,
  Flex,
  Heading,
  HStack,
  LightMode,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useIsLargeScreen } from "../utils/screenSize";
import { IoChevronBack } from "react-icons/io5";

export interface PageHeaderProps {
  title: string;
  onAddButtonClick?: () => void;
  isHomeHeader?: boolean;
  buttonLabel?: string;
  onBackButtonPress?: () => void;
}

const PageHeader = (props: PageHeaderProps) => {
  const BgColor = useColorModeValue("whiteAlpha.300", "blackAlpha.500");
  const isLarge = useIsLargeScreen();

  const shouldBeBigHeader = props?.isHomeHeader || !isLarge;
  const headerInBox = !props?.isHomeHeader && isLarge;

  return (
    <HStack
      position={shouldBeBigHeader ? "fixed" : undefined}
      top={0}
      left={0}
      p={headerInBox ? 0 : 5}
      width={"100%"}
      justifyContent={"space-between"}
      zIndex={"docked"}
      backdropFilter={"blur(15px)"}
      bgColor={shouldBeBigHeader ? BgColor : undefined}
    >
      <Flex gap={2} alignItems={"center"} mb={3}>
        {props.onBackButtonPress && (
          <Button
            variant={"ghost"}
            onClick={() => props.onBackButtonPress && props.onBackButtonPress()}
          >
            <IoChevronBack size={25} />
          </Button>
        )}
        <Heading size={shouldBeBigHeader ? "3xl" : "xl"}>{props.title}</Heading>
      </Flex>
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
    </HStack>
  );
};

export default PageHeader;
