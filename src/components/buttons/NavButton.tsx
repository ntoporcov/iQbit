import React, { ReactElement } from "react";
import { Button, ColorProps, Text } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
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
  const isLarge = useIsLargeScreen();
  const location = useLocation();
  const isSearch =
    location.pathname.includes("/search") ||
    (isLarge && location.pathname === "/");

  return (
    <NavLink to={props.path}>
      {({ isActive: navActive }) => {
        const isActive =
          isSearch && props.label === "Search" ? true : navActive;

        return (
          <Button
            display={"flex"}
            flexDirection={isLarge ? "row" : "column"}
            variant={"ghost"}
            minHeight={isLarge ? undefined : 20}
            pb={isLarge ? undefined : 6}
            height={isLarge ? 8 : undefined}
            width={"100%"}
            rounded={isLarge ? 5 : 0}
            bgColor={isLarge && isActive ? "grayAlpha.300" : "transparent"}
            _hover={{ bgColor: !isLarge ? "transparent" : undefined }}
            _active={{ bgColor: !isLarge ? "transparent" : undefined }}
            _focus={{ bgColor: !isLarge ? "transparent" : undefined }}
          >
            {isActive ? props.icon.active : props.icon.inactive}
            <Text
              width={"100%"}
              color={isActive ? props.activeColor : undefined}
              mt={isLarge ? 0 : 1}
              ml={isLarge ? 2 : 0}
              fontSize={isLarge ? "sm" : 10}
              textAlign={isLarge ? "left" : "center"}
            >
              {props.label}
            </Text>
          </Button>
        );
      }}
    </NavLink>
  );
};

export default NavButton;
