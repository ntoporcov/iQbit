import React from "react";
import { Button, Flex, LightMode, useColorModeValue } from "@chakra-ui/react";
import { useIsLargeScreen } from "../../utils/screenSize";
import { useSettingsCtx } from "./useSettings";

const SaveAndResetButtons = () => {
  const isLarge = useIsLargeScreen();
  const BgColor = useColorModeValue("whiteAlpha.300", "blackAlpha.500");

  const { needsSaving, reset, saveSettings } = useSettingsCtx();

  if (!needsSaving) return null;

  return (
    <Flex
      position={{ base: "fixed", lg: "sticky" }}
      width={isLarge ? "calc(100% + var(--chakra-space-5) * 2)" : "100vw"}
      px={5}
      py={6}
      gap={5}
      ml={-5}
      mr={-5}
      transform={{ lg: "translateY(var(--chakra-space-5))" }}
      bottom={{ base: 20, lg: 0 }}
      zIndex={100}
      backdropFilter={"blur(5px)"}
      bgColor={BgColor}
    >
      <Button width={"100%"} size={"lg"} bgColor={"gray.500"} onClick={reset}>
        Reset
      </Button>
      <LightMode>
        <Button
          width={"100%"}
          colorScheme={"blue"}
          size={"lg"}
          onClick={saveSettings}
        >
          Save Changes
        </Button>
      </LightMode>
    </Flex>
  );
};

export default SaveAndResetButtons;
