import React, { PropsWithChildren } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  LightMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ButtonGroup,
} from "@chakra-ui/react";
import { useIsLargeScreen } from "../utils/screenSize";
import { useMutation } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { IoCheckmark, IoChevronDown, IoTv, IoFilm } from "react-icons/io5";
import { useLocalStorage } from "usehooks-ts";
import { pushToServarr } from "../utils/ServarrClient";

export interface TorrentDownloadBoxProps {
  title?: string;
  magnetURL?: string;
  onSelect?: () => Promise<string>;
  category?: string;
  existingTorrentHashes?: string[];
}

const getMagnetHash = (magnetURL?: string) => {
  if (!magnetURL?.startsWith("magnet:?")) return undefined;

  return new URLSearchParams(magnetURL.slice("magnet:?".length))
    .get("xt")
    ?.replace(/^urn:btih:/i, "")
    .toLowerCase();
};

const TorrentDownloadBox = ({
  magnetURL,
  title,
  onSelect,
  children,
  category,
  existingTorrentHashes = [],
}: PropsWithChildren<TorrentDownloadBoxProps>) => {
  const isLarge = useIsLargeScreen();

  const [sonarrUrl] = useLocalStorage("iqbit-sonarr-url", "");
  const [radarrUrl] = useLocalStorage("iqbit-radarr-url", "");

  const { mutate, isLoading, isSuccess } = useMutation(
    "addBox",
    (magnetURLParam: string) => TorrClient.addTorrent("urls", magnetURLParam, category)
  );

  const { mutate: mutateSonarr, isLoading: isSonarrLoading, isSuccess: isSonarrSuccess } = useMutation(
    "addBoxSonarr",
    (magnetURLParam: string) => pushToServarr("Sonarr", title || "Unknown", magnetURLParam)
  );

  const { mutate: mutateRadarr, isLoading: isRadarrLoading, isSuccess: isRadarrSuccess } = useMutation(
    "addBoxRadarr",
    (magnetURLParam: string) => pushToServarr("Radarr", title || "Unknown", magnetURLParam)
  );

  const {
    mutate: callbackMutation,
    isLoading: callbackLoading,
    isSuccess: callbackSuccess,
  } = useMutation("addBoxWithCallback", (target: "qbit" | "sonarr" | "radarr") => Promise.all([onSelect!(), target] as const), {
    onSuccess: ([magnetUrlResult, target]) => {
      if (target === "sonarr") mutateSonarr(magnetUrlResult);
      else if (target === "radarr") mutateRadarr(magnetUrlResult);
      else mutate(magnetUrlResult);
    },
  });

  const anyLoading = isLoading || callbackLoading || isSonarrLoading || isRadarrLoading;
  const anySuccess = isSuccess || callbackSuccess || isSonarrSuccess || isRadarrSuccess;
  const isAdded = existingTorrentHashes.includes(getMagnetHash(magnetURL) || "");

  const bgColor = useColorModeValue("grayAlpha.200", "grayAlpha.400");

  return (
    <Flex
      p={3}
      bgColor={bgColor}
      width={"100%"}
      justifyContent={"space-between"}
      rounded={6}
      alignItems={"center"}
      gap={3}
      wrap={{ base: "wrap", lg: "nowrap" }}
    >
      <Box flexGrow={2}>
        {title && (
          <Heading wordBreak={"break-all"} size={"md"} mb={2}>
            {title}
          </Heading>
        )}
        {children}
      </Box>
      <LightMode>
        <Flex width="100%">
          <ButtonGroup isAttached width={!isLarge ? "100%" : undefined} flexGrow={1}>
            <Button
              minW={32}
              disabled={isAdded || anySuccess || anyLoading}
              isLoading={isLoading || callbackLoading}
              colorScheme={"blue"}
              width={"100%"}
              onClick={() => {
                if (magnetURL) mutate(magnetURL);
                else if (onSelect) callbackMutation("qbit");
              }}
              leftIcon={isAdded || anySuccess ? <IoCheckmark /> : undefined}
            >
              {isAdded ? "Added" : anySuccess ? "Sent" : "Download"}
            </Button>

            {(sonarrUrl || radarrUrl) && (
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="blue"
                  disabled={isAdded || anySuccess || anyLoading}
                  px={2}
                  borderLeft="1px solid"
                  borderColor="blue.600"
                >
                  <IoChevronDown />
                </MenuButton>
                <MenuList color="black">
                  {sonarrUrl && (
                    <MenuItem
                      icon={<IoTv />}
                      onClick={() => {
                        if (magnetURL) mutateSonarr(magnetURL);
                        else if (onSelect) callbackMutation("sonarr");
                      }}
                    >
                      Send to Sonarr
                    </MenuItem>
                  )}
                  {radarrUrl && (
                    <MenuItem
                      icon={<IoFilm />}
                      onClick={() => {
                        if (magnetURL) mutateRadarr(magnetURL);
                        else if (onSelect) callbackMutation("radarr");
                      }}
                    >
                      Send to Radarr
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            )}
          </ButtonGroup>
        </Flex>
      </LightMode>
    </Flex>
  );
};

export default TorrentDownloadBox;
