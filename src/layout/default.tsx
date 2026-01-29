import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import { IconBaseProps } from "react-icons";
import { useIsLargeScreen } from "../utils/screenSize";
import { PageLabels, Pages } from "../Pages";
import Home from "../pages/Home";
import { useLocation } from "react-router-dom";
import { useLogin } from "../utils/useLogin";
import { logout } from "../components/Auth";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { defaultTabs } from "../pages/TabSelectorPage";
import { GlassContainer } from "../components/GlassContainer";
import { useIsPWA } from "../hooks/useIsPWA";
import StatusBar from "../components/StatusBar";

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
    size: 24,
  };
  const activeIconProps: IconBaseProps = {
    color: activeColor,
  };

  const isPWA = useIsPWA();
  const isLarge = useIsLargeScreen();
  const [sidebarWidth, setSidebarWidth] = useLocalStorage(
    "sidebar-width-v1",
    400
  );
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.min(
          Math.max(mouseMoveEvent.clientX - 20, 300),
          800
        );
        setSidebarWidth(newWidth);
      }
    },
    [isResizing, setSidebarWidth]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const largeWorkAreaBgColor = useColorModeValue("white", "gray.900");
  const resizeLineColor = useColorModeValue("gray.200", "gray.700");
  const resizeHandleColor = useColorModeValue("gray.300", "gray.600");

  const storedTabs = useReadLocalStorage<(PageLabels | "")[]>("tabs-v2");
  const tabsSelected = storedTabs ?? defaultTabs;

  const middleTab = tabsSelected[0] || "Trending";
  const rightTab = tabsSelected[1] || "Search";

  const DownloadsPage = Pages.find((page) => page.label === "Downloads")!;
  const SettingsPage = Pages.find((page) => page.label === "Settings")!;
  const MiddleTab = Pages.find((page) => page.label === middleTab)!;
  const RightTab = Pages.find((page) => page.label === rightTab)!;

  return (
    <Box px={5} pb={100}>
      <Flex
        gap={isLarge ? 10 : undefined}
        as={"main"}
        mb={"30vh"}
        id={"app-container"}
      >
        <Box maxWidth={isLarge ? sidebarWidth + "px" : undefined} width={"100%"}>
          {isLarge ? <Home /> : props.children}
        </Box>
        {isLarge && (
          <>
            <Box
              position={"fixed"}
              left={`${sidebarWidth + 15}px`}
              width={"40px"}
              height={"100vh"}
              top={0}
              cursor={"col-resize"}
              onMouseDown={startResizing}
              zIndex={100}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              _hover={{
                "& .resize-line": {
                  opacity: 0.5,
                  backgroundColor: "blue.500",
                },
                "& .resize-handle": {
                  opacity: 1,
                  transform: "scale(1.2)",
                  backgroundColor: "blue.500",
                },
              }}
            >
              <Box
                className="resize-line"
                width={"1px"}
                height={"100%"}
                backgroundColor={isResizing ? "blue.500" : resizeLineColor}
                opacity={isResizing ? 1 : 0.5}
                transition={"all 0.2s"}
              />
              <Box
                className="resize-handle"
                position={"absolute"}
                width={"6px"}
                height={"40px"}
                backgroundColor={isResizing ? "blue.500" : resizeHandleColor}
                rounded={"full"}
                opacity={isResizing ? 1 : 0.8}
                transition={"all 0.2s"}
              />
            </Box>
            <Flex
              flexGrow={1}
              as={"aside"}
              backgroundColor={largeWorkAreaBgColor}
              position={"fixed"}
              top={6}
              bottom={"45px"}
              shadow={"lg"}
              rounded={12}
              overflow={"hidden"}
              width={`calc(100% - ${sidebarWidth + 70}px)`}
              left={`${sidebarWidth + 50}px`}
              id={"desktop-container"}
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
          </>
        )}
      </Flex>
      {!isLarge && (
        <Flex
          width={"calc(100% - 40px)"}
          left={"20px"}
          position={"fixed"}
          bottom={isPWA ? "calc(60px + env(safe-area-inset-bottom))" : "40px"}
          gap={3}
          id={"mobile-container"}
        >
          <GlassContainer
            flexGrow={1}
            rounded={99999999}
            zIndex={1000}
            noTint
            overflow={"visible"}
          >
            <Flex as={"nav"} width={"100%"}>
              {[DownloadsPage, MiddleTab, SettingsPage].map(
                ({ url, Icon, label }) => {
                  return (
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
                  );
                }
              )}
            </Flex>
          </GlassContainer>
          <GlassContainer rounded={"100%"} h={16} aspectRatio={"1 / 1"} noTint>
            <NavButton
              {...sharedNavButtonProps}
              path={RightTab.url}
              icon={{
                active: RightTab.Icon.active({
                  ...activeIconProps,
                  ...iconProps,
                }),
                inactive: RightTab.Icon.inactive({ ...iconProps }),
              }}
              label={""}
            />
          </GlassContainer>
        </Flex>
      )}
      <StatusBar/>
    </Box>
  );
};

export default DefaultLayout;
