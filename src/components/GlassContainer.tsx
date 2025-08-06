import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

export const GlassContainer = ({
  noTint,
  ...props
}: BoxProps & { noTint?: boolean }) => {
  return (
    <Box
      pos={"relative"}
      {...props}
      className={`glassEffect ${noTint ? " glassNoTint " : " "}${
        props.className ? " " + props.className : ""
      }`}
    >
      {!noTint && <Box className={"glassTint"} rounded={props.rounded} />}
      <Box className={"glassShine"} rounded={props.rounded} />
      {props.children}
    </Box>
  );
};
