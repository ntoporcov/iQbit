import React from "react";
import { FormControl, FormLabel, LightMode, Switch } from "@chakra-ui/react";
import { TorrSettings } from "../../../types";
import { useSettingsCtx } from "../useSettings";

export interface SettingsSwitchProps {
  label: string;
  settingKey: keyof TorrSettings;
  labelAbove?: boolean;
}

const SettingsSwitch = (props: SettingsSwitchProps) => {
  const { settings, updateSetting } = useSettingsCtx();

  return (
    <>
      <FormControl
        display={"flex"}
        flexDirection={props?.labelAbove ? "column" : "row"}
        alignItems={props?.labelAbove ? "flex-start" : "center"}
        gap={3}
        width={"auto"}
      >
        {props?.labelAbove && (
          <FormLabel whiteSpace={"nowrap"} mb={0}>
            {props.label}
          </FormLabel>
        )}
        <LightMode>
          <Switch
            size={"lg"}
            isChecked={settings?.[props.settingKey] as boolean}
            onChange={(e) => updateSetting(props.settingKey, e.target.checked)}
          />
        </LightMode>
        {!props?.labelAbove && <FormLabel mb={0}>{props.label}</FormLabel>}
      </FormControl>
    </>
  );
};

export default SettingsSwitch;
