import React from "react";
import {Box, Link, Text} from "@chakra-ui/react";
import SettingsBox from "./SettingsBox";
import SettingsSwitch from "./Inputs/SettingsSwitch";
import {IoOpen} from "react-icons/io5";

export interface RequestMoreSettingsProps {}

const RequestMoreSettings = (props: RequestMoreSettingsProps) => {
  return (
    <SettingsBox title={"Need other settings from this page?"}>
      <Text>
        I wasn't able to add all settings since... well, there's a lot of them.
        <br />
        <br />I do plan to eventually have all of them, but I appologize if I'm
        missing something you need. Please use the toggle below to turn off this
        custom UI and change whatever you need 😃
      </Text>
      <SettingsSwitch
        label={"Use Custom WebUI"}
        settingKey={"alternative_webui_enabled"}
      />
      <Box>
        <Text>
          Also, feel free to put up an issue for the setting you need (if one
          doesn't exist yet).
        </Text>
        <Link
          textDecoration={"underline"}
          href={"https://github.com/ntoporcov/iQbit/issues"}
          target={"_blank"}
          rel="noreferrer"
        >
          Github Issues <IoOpen style={{ display: "inline" }} />
        </Link>
      </Box>
    </SettingsBox>
  );
};

export default RequestMoreSettings;
