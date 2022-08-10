import React from "react";
import Language from "./Language";
import SettingsSwitch from "../Inputs/SettingsSwitch";

export interface BehaviorPageProps {}

const WebUIPage = (props: BehaviorPageProps) => {
  return (
    <>
      <Language />
      <SettingsSwitch
        label={"Use Custom WebUI"}
        settingKey={"alternative_webui_enabled"}
      />
    </>
  );
};

export default WebUIPage;
