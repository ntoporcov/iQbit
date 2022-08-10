import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import SettingsSwitch from "../Inputs/SettingsSwitch";

export interface WhenAddingTorrentProps {}

const WhenAddingTorrent = (props: WhenAddingTorrentProps) => {
  const createSubfolderOptions: SettingsSelectOption[] = [
    { label: "Original", value: "Original" },
    { label: "Create subfolder", value: "Subfolder" },
    { label: "Do not create subfolder", value: "NoSubfolder" },
  ];

  return (
    <SettingsBox title={"When adding a torrent"}>
      <SettingsSelect
        label={"Torrent content layout"}
        settingKey={"torrent_content_layout"}
        options={createSubfolderOptions}
      />
      <SettingsSwitch
        label={"Do not start the download automatically"}
        settingKey={"start_paused_enabled"}
      />
      <SettingsSwitch
        label={"Delete .torrent files afterwards"}
        settingKey={"auto_delete_mode"}
      />
    </SettingsBox>
  );
};

export default WhenAddingTorrent;
