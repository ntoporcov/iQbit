import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import SettingsBox from "../SettingsBox";
import { Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import React from "react";

export function AlternativeRateLimits(props: {
  options: SettingsSelectOption[];
}) {
  return (
    <SettingsBox title={"Alternative Rate Limits"}>
      <Text>0 means unlimited</Text>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <SettingsTextInput
          label={"Upload"}
          settingKey={"alt_up_limit"}
          rightAddon={"KiB/s"}
        />
        <SettingsTextInput
          label={"Download"}
          settingKey={"alt_dl_limit"}
          rightAddon={"KiB/s"}
        />
      </SimpleGrid>
      <SettingsBox title={"Schedule Alternative Limit"}>
        <SettingsSwitch
          label={"Enable Alternative Rate Limit Scheduler"}
          settingKey={"scheduler_enabled"}
        />
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
          <Flex flexDirection={"column"}>
            <Heading size={"md"}>From</Heading>
            <SimpleGrid columns={2} gap={5}>
              <SettingsTextInput
                label={""}
                settingKey={"schedule_from_hour"}
                rightAddon={"h"}
              />
              <SettingsTextInput
                label={""}
                settingKey={"schedule_from_min"}
                rightAddon={"min"}
              />
            </SimpleGrid>
          </Flex>
          <Flex flexDirection={"column"}>
            <Heading size={"md"}>To</Heading>
            <SimpleGrid columns={2} gap={5}>
              <SettingsTextInput
                label={""}
                settingKey={"schedule_to_hour"}
                rightAddon={"h"}
              />
              <SettingsTextInput
                label={""}
                settingKey={"schedule_to_hour"}
                rightAddon={"min"}
              />
            </SimpleGrid>
          </Flex>
        </SimpleGrid>
        <SettingsSelect
          label={"When"}
          settingKey={"scheduler_days"}
          options={props.options}
        />
      </SettingsBox>
    </SettingsBox>
  );
}
