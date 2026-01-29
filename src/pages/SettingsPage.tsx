import React, { Fragment, ReactElement, useState } from "react";
import { useIsLargeScreen } from "../utils/screenSize";
import {
  IoAlbums,
  IoChatbubble,
  IoChevronBack,
  IoChevronForward,
  IoCog,
  IoDownload,
  IoExtensionPuzzle,
  IoGitCompare,
  IoLink,
  IoLogoRss,
  IoMoon,
  IoPhonePortrait,
  IoPricetags,
  IoSpeedometer,
  IoText,
} from "react-icons/io5";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { smartMap } from "../utils/smartMap";
import WebUIPage from "../components/settings/WebUI/WebUIPage";
import { SettingsProvider } from "../components/settings/useSettings";
import DownloadsPage from "../components/settings/Downloads/DownloadsPage";
import SaveAndResetButtons from "../components/settings/SaveAndResetButtons";
import ConnectionPage from "../components/settings/Connection/ConnectionPage";
import SpeedPage from "../components/settings/Speed/SpeedPage";
import BitTorrentPage from "../components/settings/BitTorrent/BitTorrentPage";
import RSSPage from "../components/settings/RSS/RSSPage";
import AdvancedPage from "../components/settings/Advanced/AdvancedPage";
import RequestMoreSettings from "../components/settings/RequestMoreSettings";
import { logout } from "../components/Auth";
import AllAnnouncementsPage from "../components/settings/AllAnnouncements";
import SearchPluginsPage from "./SearchPluginsPage";
import CategoriesPage from "./CategoriesPage";
import FontSizeSelection from "./FontSizeSelection";
import TabSelectorPage from "./TabSelectorPage";
import AppearanceSettings from "./AppearanceSettings";
import { GlassContainer } from "../components/GlassContainer";

export interface SettingsPageProps {}

type settingsPageNames =
  | "Download"
  | "Connection"
  | "Speed"
  | "BitTorrent"
  | "RSS"
  | "Web UI"
  | "Advanced"
  | "Appearance"
  | "iQbit Updates"
  | "Search Plugins"
  | "Categories"
  | "Font Size"
  | "Mobile Bottom Tabs";

type SettingsPageObject = {
  icon: ReactElement;
  component: ReactElement;
  color: string;
  group: "Other Settings" | "qBittorrent Settings";
  mobileOnly?: boolean;
};

const iconSize = 20;

const SettingsPages: {
  [i in string]: SettingsPageObject;
} = {
  Download: {
    icon: <IoDownload size={iconSize} />,
    component: <DownloadsPage />,
    color: "cyan.500",
    group: "qBittorrent Settings",
  },
  Connection: {
    icon: <IoLink size={iconSize} />,
    component: <ConnectionPage />,
    color: "purple.500",
    group: "qBittorrent Settings",
  },
  Speed: {
    icon: <IoSpeedometer size={iconSize} />,
    component: <SpeedPage />,
    color: "green.600",
    group: "qBittorrent Settings",
  },
  BitTorrent: {
    icon: <IoGitCompare size={iconSize} />,
    component: <BitTorrentPage />,
    color: "blue.500",
    group: "qBittorrent Settings",
  },
  RSS: {
    icon: <IoLogoRss size={iconSize} />,
    component: <RSSPage />,
    color: "orange.500",
    group: "qBittorrent Settings",
  },
  "Web UI": {
    icon: <IoAlbums size={iconSize} />,
    component: <WebUIPage />,
    color: "pink.500",
    group: "qBittorrent Settings",
  },
  Advanced: {
    icon: <IoCog size={iconSize} />,
    component: <AdvancedPage />,
    color: "gray.800",
    group: "qBittorrent Settings",
  },
  "iQbit Updates": {
    icon: <IoChatbubble size={iconSize} />,
    component: <AllAnnouncementsPage />,
    color: "telegram.600",
    group: "Other Settings",
  },
  "Search Plugins": {
    icon: <IoExtensionPuzzle size={iconSize} />,
    component: <SearchPluginsPage />,
    color: "orange.800",
    group: "Other Settings",
    mobileOnly: true,
  },
  Categories: {
    icon: <IoPricetags size={iconSize} />,
    component: <CategoriesPage />,
    color: "red.900",
    group: "Other Settings",
    mobileOnly: true,
  },
  Appearance: {
    icon: <IoMoon size={iconSize} />,
    component: <AppearanceSettings />,
    color: "purple.800",
    group: "Other Settings",
  },
  "Font Size": {
    icon: <IoText size={iconSize} />,
    component: <FontSizeSelection />,
    color: "blue.700",
    group: "Other Settings",
    mobileOnly: true,
  },
  "Mobile Bottom Tabs": {
    icon: <IoPhonePortrait size={iconSize} />,
    component: <TabSelectorPage />,
    color: "teal.600",
    group: "Other Settings",
    mobileOnly: true,
  },
};

const SettingsHeader = ({
  title,
  onBackButtonPress,
}: {
  title: string;
  onBackButtonPress?: () => void;
}) => {
  const isLarge = useIsLargeScreen();

  if (!onBackButtonPress) {
    return (
      <Heading size={isLarge ? "xl" : "3xl"} mt={isLarge ? 0 : 5} mb={5}>
        {title}
      </Heading>
    );
  }

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      pt={isLarge ? 0 : 7}
      pb={5}
      width={isLarge ? "calc(100% + (var(--chakra-space-5)) * 2)" : "100vw"}
      position={isLarge ? "relative" : "fixed"}
      left={isLarge ? -5 : 0}
      zIndex={20}
      data-group
    >
      <GlassContainer position={"absolute"} left={5} px={3} rounded={99999}>
        <Button
          size={"lg"}
          variant={"unstyled"}
          display={"flex"}
          alignItems={"center"}
          onClick={onBackButtonPress}
          color={"text"}
          _groupActive={{
            transform: "scale(1.15)",
            opacity: 1,
            background: "transparent",
          }}
        >
          <IoChevronBack size={18} />
          Back
        </Button>
      </GlassContainer>
      <Heading size={"md"} alignItems={"center"}>
        {title}
      </Heading>
    </Flex>
  );
};

const SettingsPage = () => {
  const isLarge = useIsLargeScreen();
  const [page, setPage] = useState<string>();
  const mobileButtonBackground = useColorModeValue("white", "gray.900");

  return (
    <SettingsProvider>
      <SettingsHeader
        title={page || "Settings"}
        onBackButtonPress={page ? () => setPage(undefined) : undefined}
      />
      <Flex minH={"100%"} flexDirection={"column"}>
        {!!page && (
          <Box flexGrow={2} pt={isLarge ? 0 : 24}>
            {SettingsPages[page].component}
          </Box>
        )}
        {!page &&
          (isLarge ? (
            <Box flexGrow={2}>
              <Grid
                gap={2}
                pt={2}
                width={"100%"}
                justifyContent={"flex-start"}
                templateColumns={"repeat( auto-fit, minmax(150px, 1fr) )"}
              >
                {Object.entries(SettingsPages).map(
                  ([pageName, { icon, mobileOnly }]) =>
                    !mobileOnly && (
                      <Button
                        minW={"150px"}
                        gap={2}
                        variant={"outline"}
                        flexDirection={"column"}
                        flexGrow={2}
                        key={pageName}
                        p={4}
                        height={"100%"}
                        onClick={() => setPage(pageName as settingsPageNames)}
                        colorScheme={"blue"}
                      >
                        {icon}
                        {pageName}
                      </Button>
                    )
                )}
              </Grid>
            </Box>
          ) : (
            <Box flexGrow={2}>
              <Flex mt={4} flexDirection={"column"}>
                {smartMap(
                  Object.entries(SettingsPages),
                  (
                    [pageName, { icon, color, group }],
                    { isFirst, isLast, prevItem, nextItem }
                  ) => {
                    const groupFirst = isFirst || group !== prevItem?.[1].group;
                    const groupLast = isLast || group !== nextItem?.[1].group;

                    return (
                      <Fragment key={pageName}>
                        {group !== prevItem?.[1].group && (
                          <Heading mt={!isFirst ? 10 : 3} mb={3}>
                            {group}
                          </Heading>
                        )}
                        <Button
                          mb={-1}
                          gap={2}
                          variant={"outline"}
                          justifyContent={"space-between"}
                          flexGrow={2}
                          px={4}
                          py={3}
                          height={"100%"}
                          onClick={() => setPage(pageName as settingsPageNames)}
                          rounded={0}
                          roundedTop={groupFirst ? "lg" : undefined}
                          roundedBottom={groupLast ? "lg" : undefined}
                          backgroundColor={mobileButtonBackground}
                          border={"none"}
                          borderTop={groupFirst ? 0 : "1px"}
                          borderTopColor={"grayAlpha.300"}
                        >
                          <Flex as={"span"} alignItems={"center"}>
                            <Box
                              as={"span"}
                              p={2}
                              backgroundColor={color}
                              rounded={"md"}
                              color={"white"}
                              mr={3}
                            >
                              {icon}
                            </Box>
                            {pageName}
                          </Flex>
                          <IoChevronForward />
                        </Button>
                      </Fragment>
                    );
                  }
                )}
              </Flex>
            </Box>
          ))}
        <SaveAndResetButtons />
      </Flex>

      {!isLarge && !page && (
        <Button
          width={"100%"}
          colorScheme={"red"}
          variant={"ghost"}
          onClick={logout}
        >
          Log Out
        </Button>
      )}
    </SettingsProvider>
  );
};

export default SettingsPage;
