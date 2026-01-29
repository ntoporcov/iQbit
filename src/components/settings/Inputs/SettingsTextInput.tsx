import React, { ReactNode, useState } from "react";
import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  InputRightAddon,
  LightMode,
  Switch,
} from "@chakra-ui/react";
import { TorrSettings } from "../../../types";
import { useSettingsCtx } from "../useSettings";
import { Input, InputGroup } from "@chakra-ui/input";

export interface SettingsSwitchProps {
  label: string;
  settingKey: keyof TorrSettings;
  disabled?: boolean;
  helperText?: ReactNode;
  withToggle?: boolean;
  disableDefaultValue?: string;
  rightAddon?: string;
  placeholder?: string;
}

const SettingsTextInput = (props: SettingsSwitchProps) => {
  const { settings, updateSetting } = useSettingsCtx();
  const [enabled, setEnabled] = useState(false);

  return (
    <>
      <Flex gap={3} width={"full"}>
        {props.withToggle && (
          <LightMode>
            <FormControl width={"auto"}>
              <FormLabel>
                <FormLabel>Enabled</FormLabel>
                <Switch
                  size={"lg"}
                  isChecked={enabled}
                  onChange={(event) => {
                    setEnabled(event.target.checked);
                    updateSetting(
                      props?.settingKey,
                      event.target.checked
                        ? props.disableDefaultValue || ""
                        : -1
                    );
                  }}
                />
              </FormLabel>
            </FormControl>
          </LightMode>
        )}
        <FormControl>
          <FormLabel>{props.label}</FormLabel>
          <InputGroup size={"lg"}>
            <Input
              placeholder={props.placeholder}
              type={
                typeof settings?.[props.settingKey] === "number"
                  ? "number"
                  : "text"
              }
              isDisabled={props.withToggle ? !enabled : props.disabled}
              value={
                props.withToggle && !enabled
                  ? props.disableDefaultValue || ""
                  : settings?.[props?.settingKey]?.toString() || ""
              }
              onChange={(e) =>
                updateSetting(
                  props.settingKey,
                  typeof settings?.[props.settingKey] === "number"
                    ? parseFloat(e.target.value)
                    : e.target.value
                )
              }
            />
            {props.rightAddon && (
              <InputRightAddon>{props.rightAddon}</InputRightAddon>
            )}
          </InputGroup>
          <FormHelperText>{props.helperText}</FormHelperText>
        </FormControl>
      </Flex>
    </>
  );
};

export default SettingsTextInput;
