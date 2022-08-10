import React, {ReactElement, useState} from "react";
import PageHeader from "../components/PageHeader";
import {useIsLargeScreen} from "../utils/screenSize";
import {IoChevronForward, IoDownload, IoLink,} from "react-icons/io5";
import {Box, Button, Flex, SimpleGrid, useColorModeValue,} from "@chakra-ui/react";
import {smartMap} from "../utils/smartMap";
import WebUIPage from "../components/settings/WebUI/WebUIPage";
import {SettingsProvider} from "../components/settings/useSettings";
import DownloadsPage from "../components/settings/Downloads/DownloadsPage";
import SaveAndResetButtons from "../components/settings/SaveAndResetButtons";
import ConnectionPage from "../components/settings/Connection/ConnectionPage";

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
};

const iconSize = 20;

const SettingsPages: { [i in settingsPageNames]: SettingsPageObject } = {
  Downloads: {
    icon: <IoDownload size={iconSize} />,
    component: <DownloadsPage />,
  },
  Connection: {
    icon: <IoLink size={iconSize} />,
    component: <ConnectionPage />,
  },
  Speed: {
    icon: <IoDownload size={iconSize} />,
    component: <>Downloads</>,
  },
  BitTorrent: {
    icon: <IoDownload size={iconSize} />,
    component: <>Downloads</>,
  },
  RSS: {
    icon: <IoDownload size={iconSize} />,
    component: <>Downloads</>,
  },
  "Web UI": {
    icon: <IoDownload size={iconSize} />,
    component: <WebUIPage />,
  },
  Advanced: {
    icon: <IoDownload size={iconSize} />,
    component: <>Downloads</>,
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
      {!!page && SettingsPages[page].component}
      {!page &&
        (isLarge ? (
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
        ) : (
          <Flex mt={4} flexDirection={"column"}>
            {smartMap(
              Object.entries(SettingsPages),
              ([pageName, { icon }], { isFirst, isLast }) => (
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
                      backgroundColor={"blue.500"}
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
        ))}
      <SaveAndResetButtons />
    </SettingsProvider>
  );
};

export default SettingsPage;
