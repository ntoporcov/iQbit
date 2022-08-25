import React, { PropsWithChildren } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  LightMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useIsLargeScreen } from "../utils/screenSize";
import { useMutation } from "react-query";
import { TorrClient } from "../utils/TorrClient";
import { IoCheckmark } from "react-icons/io5";

export interface TorrentDownloadBoxProps {
  title?: string;
  magnetURL?: string;
  onSelect?: () => Promise<string>;
}

const TorrentDownloadBox = ({
  magnetURL,
  title,
  onSelect,
  children,
}: PropsWithChildren<TorrentDownloadBoxProps>) => {
  const isLarge = useIsLargeScreen();

  const { mutate, isLoading, isSuccess } = useMutation(
    "addBox",
    (magnetURLParam: string) => TorrClient.addTorrent("urls", magnetURLParam)
  );

  const {
    mutate: callbackMutation,
    isLoading: callbackLoading,
    isSuccess: callbackSuccess,
  } = useMutation("addBoxWithCallback", () => onSelect!(), {
    onSuccess: (magnetURL) => mutate(magnetURL),
  });

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
        <Button
          disabled={
            isSuccess || callbackSuccess || callbackLoading || isLoading
          }
          isLoading={isLoading || callbackLoading}
          colorScheme={"blue"}
          width={!isLarge ? "100%" : undefined}
          onClick={() => {
            if (magnetURL) {
              mutate(magnetURL);
            } else if (onSelect) {
              callbackMutation();
            }
          }}
          leftIcon={isSuccess ? <IoCheckmark /> : undefined}
        >
          {isSuccess ? "Added" : "Download"}
        </Button>
      </LightMode>
    </Flex>
  );
};

export default TorrentDownloadBox;
