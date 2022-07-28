import React, { cloneElement, ReactElement } from "react";
import { Box, Button, ColorHues, ColorProps, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@chakra-ui/react";
import { useIsLargeScreen } from "../../utils/screenSize";

export interface NavButtonProps {
  path: string;
  icon: {
    active: ReactElement;
    inactive: ReactElement;
  };
  label: string;
  activeColor: ColorProps["color"];
}

const NavButton = (props: NavButtonProps) => {
  // const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === props.path;
  const isLarge = useIsLargeScreen();

  return (
    <Button
      display={"flex"}
      flexDirection={isLarge ? "row" : "column"}
      onClick={() => console.log("going")}
      variant={"ghost"}
      minHeight={isLarge ? undefined : 20}
      pb={isLarge ? undefined : 2}
      width={"100%"}
      rounded={isLarge ? 5 : 0}
    >
      {isActive ? props.icon.active : props.icon.inactive}
      <Text
        width={"100%"}
        color={isActive ? props.activeColor : undefined}
        mt={isLarge ? 0 : 1}
        ml={isLarge ? 2 : 0}
        fontSize={"sm"}
        textAlign={isLarge ? "left" : "center"}
      >
        {props.label}
      </Text>
    </Button>
  );
};

export default NavButton;
