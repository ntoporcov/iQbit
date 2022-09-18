import React, { PropsWithChildren, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import { IconBaseProps } from "react-icons";
import { useIsLargeScreen } from "../utils/screenSize";
import { Pages } from "../Pages";
import Home from "../pages/Home";
import { useLocation } from "react-router-dom";
import useScrollPosition from "../hooks/useScrollPosition";
import { useLogin } from "../utils/useLogin";
import { logout } from "../components/Auth";
import { isAndroid, isIOS } from "react-device-detect";

export interface DefaultLayoutProps {}

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutProps>) => {
  const { handleLogin, localCreds } = useLogin();
  const { pathname } = useLocation();

  useEffect(() => {
    handleLogin({
      username: localCreds.username,
      password: localCreds.password,
    });
  }, [localCreds.username, localCreds.password, handleLogin]);

  const theme = useTheme();

  const activeColor = theme.colors.blue[500];

  const sharedNavButtonProps = {
    activeColor,
  };
  const iconProps: IconBaseProps = {
    size: 20,
  };
  const activeIconProps: IconBaseProps = {
    color: activeColor,
  };

  const BgColor = useColorModeValue("gray.75", "gray.900");
  const BgBorderColor = useColorModeValue("gray.200", "gray.600");
  const isLarge = useIsLargeScreen();

  const largeWorkAreaBgColor = useColorModeValue("white", "gray.900");
  const isTouchDevice = isAndroid || isIOS;
  const scroll = useScrollPosition();
  const fakeBodyBg = useColorModeValue("gray.50", "black");

  return (
    <Box backgroundColor={fakeBodyBg}>
      <Box
        backgroundColor={fakeBodyBg}
        position={"fixed"}
        height={"100vh"}
        width={"100vw"}
        zIndex={-1}
      />
      {isTouchDevice && (
        <Box
          zIndex={scroll > 15 ? 1000 : -1}
          h={"60px"}
          top={"-60px"}
          mb={"-60px"}
          // transform={"translateY(-60px)"}
          position={"sticky"}
          w={"100vw"}
          backgroundColor={"blackAlpha.500"}
          backdropFilter={"blur(15px)"}
          opacity={isTouchDevice ? (scroll - 30) * 0.01 * 0.6 : 0}
        />
      )}
      <Flex gap={isLarge ? 10 : undefined} as={"main"} mb={"30vh"} px={5}>
        <Box maxWidth={isLarge ? "400px" : undefined} width={"100%"}>
          {isLarge ? <Home /> : props.children}
        </Box>
        {isLarge && (
          <Flex
            flexGrow={1}
            mt={6}
            as={"aside"}
            backgroundColor={largeWorkAreaBgColor}
            height={"calc(100vh - 150px)"}
            shadow={"lg"}
            rounded={12}
            overflow={"hidden"}
            position={"fixed"}
            top={"90px"}
            width={"calc(100% - 470px)"}
            left={"450px"}
          >
            <Flex
              flexDirection={"column"}
              backgroundColor={"grayAlpha.300"}
              height={"100%"}
              justifyContent={"space-between"}
              p={5}
            >
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) => page.visibleOn.includes("sideNav")).map(
                  ({ url, Icon, label }) => (
                    <NavButton
                      key={url}
                      {...sharedNavButtonProps}
                      path={url}
                      icon={{
                        active: Icon.active({
                          ...activeIconProps,
                          ...iconProps,
                        }),
                        inactive: Icon.inactive({ ...iconProps }),
                      }}
                      label={label}
                    />
                  )
                )}
              </Flex>
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) =>
                  page.visibleOn.includes("sideNavBottom")
                ).map(({ url, Icon, label }) => (
                  <NavButton
                    key={url}
                    {...sharedNavButtonProps}
                    path={url}
                    icon={{
                      active: Icon.active({
                        ...activeIconProps,
                        ...iconProps,
                      }),
                      inactive: Icon.inactive({ ...iconProps }),
                    }}
                    label={label}
                  />
                ))}
                <Divider my={2} />
                <Button
                  variant={"ghost"}
                  colorScheme={"red"}
                  size={"xs"}
                  fontWeight={"normal"}
                  fontSize={"sm"}
                  textAlign={"left"}
                  onClick={logout}
                >
                  Log Out
                </Button>
              </Flex>
            </Flex>
            <Flex
              flexDirection={"column"}
              height={"100%"}
              p={5}
              flexGrow={2}
              overflowY={"auto"}
              overflowX={"hidden"}
            >
              {pathname === "/"
                ? Pages.filter((page) => page.label === "Search")[0].component
                : props.children}
            </Flex>
          </Flex>
        )}
      </Flex>
      {!isLarge && (
        <SimpleGrid
          as={"nav"}
          columns={4}
          width={"100%"}
          position={"fixed"}
          bottom={0}
          bgColor={BgColor}
          borderTop={"1px solid"}
          borderColor={BgBorderColor}
        >
          {Pages.filter((page) => page.visibleOn.includes("bottomNav")).map(
            ({ url, Icon, label }) => (
              <NavButton
                key={url}
                {...sharedNavButtonProps}
                path={url}
                icon={{
                  active: Icon.active({ ...activeIconProps, ...iconProps }),
                  inactive: Icon.inactive({ ...iconProps }),
                }}
                label={label}
              />
            )
          )}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default DefaultLayout;
