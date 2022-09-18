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
  IoSpeedometer,
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
import RequestMoreSettings from "../components/settings/RequestMoreSettings";
import { logout } from "../components/Auth";
import AllAnnouncementsPage from "../components/settings/AllAnnouncements";
import SearchPluginsPage from "./SearchPluginsPage";

export interface SettingsPageProps {}

type settingsPageNames =
  | "Download"
  | "Connection"
  | "Speed"
  | "BitTorrent"
  | "RSS"
  | "Web UI"
  | "Advanced";

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
    component: <RequestMoreSettings />,
    color: "blue.500",
    group: "qBittorrent Settings",
  },
  RSS: {
    icon: <IoLogoRss size={iconSize} />,
    component: <RequestMoreSettings />,
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
    component: <RequestMoreSettings />,
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
      borderBottomWidth={3}
      borderBottomStyle={"solid"}
      borderColor={"grayAlpha.300"}
      bgColor={"gray.900"}
      backdropFilter={"blur(15px)"}
      zIndex={20}
    >
      <Button
        size={"lg"}
        variant={"unstyled"}
        display={"flex"}
        alignItems={"center"}
        position={"absolute"}
        left={5}
        onClick={onBackButtonPress}
        color={"blue.500"}
      >
        <IoChevronBack size={18} />
        Back
      </Button>
      <Heading size={"md"} alignItems={"center"}>
        {title}
      </Heading>
    </Flex>
  );
};

const SettingsPage = () => {
  const isLarge = useIsLargeScreen();
  const [page, setPage] = useState<string>();
  const mobileButtonBackground = useColorModeValue("white", "black");

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
                    { isFirst, isLast, prevItem }
                  ) => {
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
                          roundedTop={isFirst ? "lg" : undefined}
                          roundedBottom={isLast ? "lg" : undefined}
                          backgroundColor={mobileButtonBackground}
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
