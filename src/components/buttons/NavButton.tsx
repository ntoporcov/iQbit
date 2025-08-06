import React, { ReactElement } from "react";
import { Button, ColorProps, Text } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";
import { useIsLargeScreen } from "../../utils/screenSize";
import { GlassContainer } from "../GlassContainer";

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
    <NavLink to={props.path} style={{ flexGrow: 1 }}>
      {({ isActive: navActive }) => {
        const isActive =
          isSearch && props.label === "Search" ? true : navActive;

        return (
          <Button
            draggable={false}
            display={"flex"}
            flexDirection={isLarge ? "row" : "column"}
            variant={"ghost"}
            px={3}
            minHeight={isLarge ? undefined : 16}
            height={isLarge ? 8 : undefined}
            width={"100%"}
            rounded={isLarge ? 5 : 0}
            bgColor={isLarge && isActive ? "grayAlpha.300" : "transparent"}
            pos={"relative"}
            _hover={{ bgColor: !isLarge ? "transparent" : undefined }}
            _active={{
              bgColor: !isLarge ? "transparent" : undefined,
              transform: "scale(1.15)",
            }}
            data-group
            _focus={{ bgColor: !isLarge ? "transparent" : undefined }}
            sx={{
              "& > *": {
                zIndex: 2,
              },
            }}
          >
            <GlassContainer
              opacity={isActive && !isLarge ? 1 : 0}
              pos={"absolute"}
              width={"calc(100% - 10px)"}
              height={"calc(100% - 10px)"}
              rounded={9999999}
              zIndex={0}
              _groupActive={
                isLarge
                  ? {}
                  : {
                      transform: "scale(1.15)",
                      opacity: 1,
                      background: "transparent",
                    }
              }
            />
            {isActive ? props.icon.active : props.icon.inactive}
            <Text
              width={"100%"}
              color={isActive ? props.activeColor : undefined}
              mt={isLarge ? 0 : "2px"}
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
