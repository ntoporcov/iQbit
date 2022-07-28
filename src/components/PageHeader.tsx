import React from "react";
import { Button, Heading, HStack, useColorModeValue } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

export interface PageHeaderProps {
  title: string;
  onAddButtonClick?: () => void;
}

const PageHeader = (props: PageHeaderProps) => {
  const BgColor = useColorModeValue("whiteAlpha.300", "blackAlpha.500");

  return (
    <HStack
      position={"fixed"}
      top={0}
      left={0}
      p={5}
      width={"100%"}
      justifyContent={"space-between"}
      backdropFilter={"blur(15px)"}
      zIndex={"docked"}
      bgColor={BgColor}
    >
      <Heading size={"3xl"}>{props.title}</Heading>
      {props?.onAddButtonClick && (
        <Button
          rounded={"100%"}
          width={12}
          height={12}
          colorScheme={"blue"}
          onClick={props.onAddButtonClick}
        >
          <FaPlus size={40} />
        </Button>
      )}
    </HStack>
  );
};

export default PageHeader;
