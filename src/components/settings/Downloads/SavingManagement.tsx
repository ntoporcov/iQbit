import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import {Flex} from "@chakra-ui/react";
import {useSettingsCtx} from "../useSettings";

const SavingManagement = () => {
  const { settings } = useSettingsCtx();

  return (
    <>
      <SettingsBox title={"Saving Management"}>
        <SettingsSwitch
          label={"Use Automatic Torrent Management Mode"}
          settingKey={"auto_tmm_enabled"}
        />
        <SettingsSwitch
          label={"Relocate Torrent on Category Change"}
          settingKey={"torrent_changed_tmm_enabled"}
        />
        <SettingsSwitch
          label={"Relocate Torrent on Default Save Path Change"}
          settingKey={"save_path_changed_tmm_enabled"}
        />
        <SettingsSwitch
          label={"Relocate Torrent on Category Save Path Change"}
          settingKey={"category_changed_tmm_enabled"}
        />
        <SettingsTextInput
          label={"Default Save Path"}
          settingKey={"save_path"}
        />
        <Flex gap={3}>
          <SettingsSwitch
            labelAbove
            label={"Ue Temp Folder"}
            settingKey={"temp_path_enabled"}
          />
          <SettingsTextInput
            label={"Temporary Folder for Incomplete Files"}
            settingKey={"temp_path"}
            disabled={!settings?.temp_path_enabled}
          />
        </Flex>
        <SettingsTextInput
          label={"Copy .torrent files to"}
          settingKey={"export_dir"}
        />
        <SettingsTextInput
          label={"Copy .torrent files for finished downlads to"}
          settingKey={"export_dir_fin"}
        />
      </SettingsBox>
    </>
  );
};

export default SavingManagement;
