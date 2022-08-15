import React, { PropsWithChildren } from "react";
import { Flex, Heading, useColorModeValue, useTheme } from "@chakra-ui/react";

const SettingsBox = (props: PropsWithChildren<{ title?: string }>) => {
  const { colors } = useTheme();
  const borderColor = useColorModeValue(colors.gray[50], colors.gray[800]);
  const shadow = useColorModeValue("lg", "dark-lg");
  const backgroundColor = useColorModeValue("white", "gray.900");

  return (
    <Flex
      border={props.title ? "2px solid " + borderColor : undefined}
      flexDirection={"column"}
      shadow={props.title ? shadow : undefined}
      px={props?.title ? 4 : 0}
      py={4}
      mt={props.title ? 4 : 0}
      rounded={"lg"}
      gap={5}
      backgroundColor={props.title ? backgroundColor : undefined}
    >
      <Heading size={"md"}>{props?.title}</Heading>
      {props.children}
    </Flex>
  );
};

export default SettingsBox;
