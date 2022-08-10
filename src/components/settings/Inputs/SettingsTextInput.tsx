import React from "react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { TorrSettings } from "../../../types";
import { useSettingsCtx } from "../useSettings";
import { Input } from "@chakra-ui/input";

export interface SettingsSwitchProps {
  label: string;
  settingKey: keyof TorrSettings;
  disabled?: boolean;
}

const SettingsTextInput = (props: SettingsSwitchProps) => {
  const { settings, updateSetting } = useSettingsCtx();

  return (
    <>
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Input
          isDisabled={props.disabled}
          size={"lg"}
          value={settings?.[props.settingKey] as string}
          onChange={(e) => updateSetting(props.settingKey, e.target.checked)}
        />
      </FormControl>
    </>
  );
};

export default SettingsTextInput;
