import React, { cloneElement, ReactElement } from "react";
import { Box, Button, ColorHues, ColorProps, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@chakra-ui/react";

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

  return (
    <Button
      flexGrow={2}
      display={"flex"}
      flexDirection={"column"}
      onClick={() => console.log("going")}
      variant={"ghost"}
      minHeight={16}
      rounded={0}
    >
      {isActive ? props.icon.active : props.icon.inactive}
      <Text color={isActive ? props.activeColor : undefined}>
        {props.label}
      </Text>
    </Button>
  );
};

export default NavButton;
