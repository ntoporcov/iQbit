import SettingsBox from "../SettingsBox";
import { SimpleGrid, Text } from "@chakra-ui/react";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import React from "react";

export function GlobalRateLimits() {
  return (
    <SettingsBox title={"Global Rate Limits"}>
      <Text>0 means unlimited</Text>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <SettingsTextInput
          label={"Upload"}
          settingKey={"up_limit"}
          rightAddon={"KiB/s"}
        />
        <SettingsTextInput
          label={"Download"}
          settingKey={"up_limit"}
          rightAddon={"KiB/s"}
        />
      </SimpleGrid>
    </SettingsBox>
  );
}
