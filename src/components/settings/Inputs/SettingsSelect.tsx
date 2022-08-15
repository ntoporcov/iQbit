import React from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { TorrSettings } from "../../../types";
import { useSettingsCtx } from "../useSettings";

export type SettingsSelectOption = {
  label: string;
  value: any;
};

export interface SettingsSelectProps {
  label: string;
  settingKey: keyof TorrSettings;
  options: SettingsSelectOption[];
  helperText?: string;
}

const SettingsSelect = (props: SettingsSelectProps) => {
  const { settings, updateSetting } = useSettingsCtx();

  return (
    <>
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <Select
          value={settings?.[props.settingKey] as string}
          onChange={(e) =>
            updateSetting(
              props.settingKey,
              typeof settings?.[props.settingKey] === "number"
                ? parseInt(e.target.value)
                : e.target.value
            )
          }
        >
          {props.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {props.helperText && (
          <FormHelperText>{props.helperText}</FormHelperText>
        )}
      </FormControl>
    </>
  );
};

export default SettingsSelect;
