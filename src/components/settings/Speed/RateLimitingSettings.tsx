import SettingsBox from "../SettingsBox";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import React from "react";

export function RateLimitingSettings() {
  return (
    <SettingsBox title={"Rate Limiting Settings"}>
      <SettingsSwitch
        label={"Apply rate limit to µTP protocol"}
        settingKey={"limit_utp_rate"}
      />
      <SettingsSwitch
        label={"Apply rate limit to transport overhead"}
        settingKey={"limit_tcp_overhead"}
      />
      <SettingsSwitch
        label={"Apply rate limit to peers on LAN"}
        settingKey={"limit_lan_peers"}
      />
    </SettingsBox>
  );
}
