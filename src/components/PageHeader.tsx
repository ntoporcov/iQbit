import React from "react";
import { Button, Heading, HStack } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

export interface PageHeaderProps {
  title: string;
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <HStack justifyContent={"space-between"}>
      <Heading size={"3xl"}>{props.title}</Heading>
      <Button rounded={"100%"} width={12} height={12} colorScheme={"blue"}>
        <FaPlus size={40} />
      </Button>
    </HStack>
  );
};

export default PageHeader;
