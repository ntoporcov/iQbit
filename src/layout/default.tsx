import React, {PropsWithChildren, useEffect, useState} from "react";
import {Box, Button, Divider, Flex, SimpleGrid, useColorModeValue, useTheme,} from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import {IconBaseProps} from "react-icons";
import {useIsLargeScreen} from "../utils/screenSize";
import {PageLabels, Pages} from "../Pages";
import Home from "../pages/Home";
import {useLocation} from "react-router-dom";
import useScrollPosition from "../hooks/useScrollPosition";
import {useLogin} from "../utils/useLogin";
import {logout} from "../components/Auth";
import {isAndroid, isIOS} from "react-device-detect";
import {useLocalStorage, useReadLocalStorage} from "usehooks-ts";
import {defaultTabs} from "../pages/TabSelectorPage";
import {IoLayersOutline, IoReorderFourOutline} from "react-icons/io5";

const expandedKey = "desktop-expanded";

export const useIsDesktopExpanded = () => {
  const isLarge = useIsLargeScreen();
  const expandedLS = useReadLocalStorage(expandedKey);

  return isLarge && expandedLS;
};

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

  const storedTabs = useReadLocalStorage<(PageLabels | "")[]>("tabs");
  const tabsSelected = storedTabs ?? defaultTabs;

  const DownloadsPage = Pages.find((page) => page.label === "Downloads");
  const SettingsPage = Pages.find((page) => page.label === "Settings");

  const [desktopExpanded, setDesktopExpanded] = useLocalStorage(
    expandedKey,
    true
  );
  const [workArea, setWorkArea] = useState("");

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
        <Box
          maxWidth={
            isLarge
              ? desktopExpanded
                ? "calc(100vw - 270px)"
                : "400px"
              : undefined
          }
          width={"100%"}
          zIndex={desktopExpanded ? 10 : 0}
          mt={desktopExpanded ? 5 : 0}
        >
          {isLarge ? <Home expanded={desktopExpanded}/> : props.children}
        </Box>
        {isLarge && (
          <Flex
            flexGrow={1}
            mt={6}
            as={"aside"}
            height={"calc(100vh - 150px)"}
            rounded={"xl"}
            position={"fixed"}
            top={"90px"}
            width={"calc(100% - 470px)"}
            left={"450px"}
            justifyContent={"flex-end"}
            zIndex={workArea ? 30 : 0}
          >
            <Flex
              flexDirection={"column"}
              backgroundColor={"grayAlpha.300"}
              height={"100%"}
              justifyContent={"space-between"}
              p={5}
              order={!desktopExpanded ? 0 : 1}
              roundedLeft={"2xl"}
              rounded={desktopExpanded ? "2xl" : undefined}
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
                      notLit={!workArea}
                      onClick={() =>
                        setWorkArea((curr) => (curr === label ? "" : label))
                      }
                    />
                  )
                )}
              </Flex>
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                <NavButton
                  key={"nothing"}
                  {...sharedNavButtonProps}
                  icon={{
                    active: (desktopExpanded
                      ? IoLayersOutline
                      : IoReorderFourOutline)({
                      ...activeIconProps,
                      ...iconProps,
                    }),
                    inactive: (desktopExpanded
                      ? IoLayersOutline
                      : IoReorderFourOutline)({...iconProps}),
                  }}
                  label={desktopExpanded ? "Show Cards" : "Show Table"}
                  notLit={!workArea}
                  onClick={() => setDesktopExpanded((curr) => !curr)}
                />
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
                    notLit={!workArea}
                    onClick={() =>
                      setWorkArea((curr) => (curr === label ? "" : label))
                    }
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
              backgroundColor={largeWorkAreaBgColor}
              flexDirection={"column"}
              height={"100%"}
              p={5}
              flexGrow={2}
              overflowY={"auto"}
              overflowX={"hidden"}
              order={!desktopExpanded ? 1 : 0}
              mr={!desktopExpanded ? 0 : 3}
              roundedRight={"2xl"}
              rounded={desktopExpanded && workArea ? "2xl" : undefined}
              display={desktopExpanded && !workArea ? "none" : undefined}
              shadow={desktopExpanded && workArea ? "2xl" : undefined}
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
          columns={(tabsSelected?.filter((curr) => !!curr).length || 0) + 2}
          width={"100%"}
          position={"fixed"}
          bottom={0}
          bgColor={BgColor}
          borderTop={"1px solid"}
          borderColor={BgBorderColor}
        >
          {DownloadsPage && (
            <NavButton
              key={DownloadsPage.url}
              {...sharedNavButtonProps}
              path={DownloadsPage.url}
              icon={{
                active: DownloadsPage.Icon.active({
                  ...activeIconProps,
                  ...iconProps,
                }),
                inactive: DownloadsPage.Icon.inactive({ ...iconProps }),
              }}
              label={DownloadsPage.label}
            />
          )}
          {tabsSelected.map((tab) => {
            const pageData = Pages.find((page) => page.label === tab);

            if (!pageData) return null;

            const { url, Icon, label } = pageData;

            return (
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
            );
          })}
          {SettingsPage && (
            <NavButton
              key={SettingsPage.url}
              {...sharedNavButtonProps}
              path={SettingsPage.url}
              icon={{
                active: SettingsPage.Icon.active({
                  ...activeIconProps,
                  ...iconProps,
                }),
                inactive: SettingsPage.Icon.inactive({ ...iconProps }),
              }}
              label={SettingsPage.label}
            />
          )}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default DefaultLayout;
