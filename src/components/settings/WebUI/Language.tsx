import React from "react";
import ISO6391 from "iso-639-1";
import {useSettingsCtx} from "../useSettings";
import SettingsSelect, {SettingsSelectOption} from "../Inputs/SettingsSelect";
import SettingsBox from "../SettingsBox";

export interface InterfaceProps {}

const Language = (props: InterfaceProps) => {
  const { settings, updateSetting } = useSettingsCtx();

  console.log(settings?.locale);

  const options: SettingsSelectOption[] = ISO6391.getAllNativeNames().map(
    (lang) => ({
      label: lang,
      value: ISO6391.getCode(lang),
    })
  );

  return (
    <SettingsBox title={"Language"}>
      <SettingsSelect
        label={"User Interface Language"}
        settingKey={"locale"}
        options={options}
      />
    </SettingsBox>
  );
};

export default Language;
