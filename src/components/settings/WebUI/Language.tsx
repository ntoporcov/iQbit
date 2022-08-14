import React from "react";
import ISO6391 from "iso-639-1";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import SettingsBox from "../SettingsBox";

const Language = () => {
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
        helperText={"Has no effect on iQbit"}
      />
    </SettingsBox>
  );
};

export default Language;
