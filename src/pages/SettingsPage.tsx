import React, { ReactElement, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useIsLargeScreen } from "../utils/screenSize";
import {
  IoAlbums,
  IoChevronForward,
  IoCog,
  IoDownload,
  IoGitCompare,
  IoLink,
  IoLogoRss,
  IoSpeedometer,
} from "react-icons/io5";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
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

export interface SettingsPageProps {}

type settingsPageNames =
  | "Downloads"
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
};

const iconSize = 20;

const SettingsPages: { [i in settingsPageNames]: SettingsPageObject } = {
  Downloads: {
    icon: <IoDownload size={iconSize} />,
    component: <DownloadsPage />,
    color: "cyan.500",
  },
  Connection: {
    icon: <IoLink size={iconSize} />,
    component: <ConnectionPage />,
    color: "purple.500",
  },
  Speed: {
    icon: <IoSpeedometer size={iconSize} />,
    component: <SpeedPage />,
    color: "green.600",
  },
  BitTorrent: {
    icon: <IoGitCompare size={iconSize} />,
    component: <RequestMoreSettings />,
    color: "blue.500",
  },
  RSS: {
    icon: <IoLogoRss size={iconSize} />,
    component: <RequestMoreSettings />,
    color: "orange.500",
  },
  "Web UI": {
    icon: <IoAlbums size={iconSize} />,
    component: <WebUIPage />,
    color: "pink.500",
  },
  Advanced: {
    icon: <IoCog size={iconSize} />,
    component: <RequestMoreSettings />,
    color: "gray.800",
  },
};

const SettingsPage = () => {
  const isLarge = useIsLargeScreen();
  const [page, setPage] = useState<settingsPageNames>();
  const mobileButtonBackground = useColorModeValue("white", "black");

  return (
    <SettingsProvider>
      <PageHeader
        title={page || "Settings"}
        onBackButtonPress={page ? () => setPage(undefined) : undefined}
      />
      <Flex minH={"100%"} flexDirection={"column"}>
        {!!page && <Box flexGrow={2}>{SettingsPages[page].component}</Box>}
        {!page &&
          (isLarge ? (
            <Box flexGrow={2}>
              <SimpleGrid columns={4} gap={3}>
                {Object.entries(SettingsPages).map(([pageName, { icon }]) => (
                  <Button
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
                ))}
              </SimpleGrid>
            </Box>
          ) : (
            <Box flexGrow={2}>
              <Flex mt={4} flexDirection={"column"}>
                {smartMap(
                  Object.entries(SettingsPages),
                  ([pageName, { icon, color }], { isFirst, isLast }) => (
                    <Button
                      mb={-1}
                      gap={2}
                      variant={"outline"}
                      justifyContent={"space-between"}
                      flexGrow={2}
                      key={pageName}
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
                  )
                )}
              </Flex>
            </Box>
          ))}
        <SaveAndResetButtons />
      </Flex>
    </SettingsProvider>
  );
};

export default SettingsPage;
