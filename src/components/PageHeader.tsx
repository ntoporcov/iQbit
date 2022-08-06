import React from "react";
import {Button, Heading, HStack, LightMode, Text, useColorModeValue,} from "@chakra-ui/react";
import {FaPlus} from "react-icons/fa";
import {useIsLargeScreen} from "../utils/screenSize";

export interface PageHeaderProps {
  title: string;
  onAddButtonClick?: () => void;
  isHomeHeader?: boolean;
  buttonLabel?: string;
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
      backdropFilter={"blur(15px)"}
      zIndex={"docked"}
      bgColor={shouldBeBigHeader ? BgColor : undefined}
    >
      <Heading size={shouldBeBigHeader ? "3xl" : "xl"}>{props.title}</Heading>
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
