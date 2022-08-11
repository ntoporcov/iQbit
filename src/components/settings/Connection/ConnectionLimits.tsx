import React from "react";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsBox from "../SettingsBox";

export interface ConnectionLimitsProps {}

const ConnectionLimits = (props: ConnectionLimitsProps) => {
  return (
    <SettingsBox title={"Connection Limits"}>
      <SettingsTextInput
        label={"Global Max Connection Limit"}
        settingKey={"max_connec"}
        withToggle
        disableDefaultValue={"500"}
      />
      <SettingsTextInput
        label={"Max Connection Limit per Torrent"}
        settingKey={"max_connec_per_torrent"}
        withToggle
        disableDefaultValue={"100"}
      />
      <SettingsTextInput
        label={"Global Max Upload Slots Limit"}
        settingKey={"max_uploads"}
        withToggle
        disableDefaultValue={"20"}
      />
      <SettingsTextInput
        label={"Max Upload Slots Limit per Torrent"}
        settingKey={"max_uploads"}
        withToggle
        disableDefaultValue={"4"}
      />
    </SettingsBox>
  );
};

export default ConnectionLimits;
