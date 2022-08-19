import React, { ReactElement } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { StatWithIcon } from "./StatWithIcon";

export function InfoDataBox(props: {
  label: string;
  icon: ReactElement;
  title: string;
}) {
  return (
    <Box flexGrow={1} bgColor={"grayAlpha.300"} p={4} rounded={"xl"}>
      <Heading size={"xs"} fontWeight={"medium"}>
        {props.title}
      </Heading>
      <StatWithIcon icon={props.icon} label={props.label} />
    </Box>
  );
}
