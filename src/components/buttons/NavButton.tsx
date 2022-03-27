import React, { cloneElement, ReactElement } from "react";
import { Button, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@chakra-ui/react";

export interface NavButtonProps {
  path: string;
  icon: {
    active: ReactElement;
    inactive: ReactElement;
  };
  label: string;
}

const NavButton = (props: NavButtonProps) => {
  // const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === props.path;

  const theme = useTheme();
  const iconSize = 40;
  const activeColor = theme.colors.blue[500];

  const activeElement = cloneElement(props.icon.active, {
    size: iconSize,
    color: activeColor,
  });
  const inactiveElement = cloneElement(props.icon.inactive, { size: iconSize });

  return (
    <Button
      display={"flex"}
      flexDirection={"column"}
      onClick={() => console.log("going")}
      variant={"ghost"}
    >
      {isActive ? activeElement : inactiveElement}
      <Text color={isActive && activeColor}>{props.label}</Text>
    </Button>
  );
};

export default NavButton;
