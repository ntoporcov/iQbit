import React from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { TorrSettings } from "../../../types";
import { useSettingsCtx } from "../useSettings";

export interface SettingsSwitchProps {
  label: string;
  settingKey: keyof TorrSettings;
  disabled?: boolean;
  helperText?: string;
}

const SettingsTextArea = (props: SettingsSwitchProps) => {
  const { settings, updateSetting } = useSettingsCtx();

  return (
    <>
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Textarea
          isDisabled={props.disabled}
          size={"lg"}
          value={settings?.[props.settingKey] as string}
          onChange={(e) => updateSetting(props.settingKey, e.target.value)}
        />
        <FormHelperText>{props.helperText}</FormHelperText>
      </FormControl>
    </>
  );
};

export default SettingsTextArea;
