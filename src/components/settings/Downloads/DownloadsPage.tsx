import React from "react";
import WhenAddingTorrent from "./WhenAddingTorrent";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsBox from "../SettingsBox";
import SavingManagement from "./SavingManagement";
import RequestMoreSettings from "../RequestMoreSettings";

export interface DownloadsPageProps {}

const DownloadsPage = (props: DownloadsPageProps) => {
  return (
    <>
      <WhenAddingTorrent />
      <SettingsBox>
        <SettingsSwitch
          label={"Pre-allocate disk space for all files"}
          settingKey={"preallocate_all"}
        />
        <SettingsSwitch
          label={"Append .!qB extension to incomplete files"}
          settingKey={"incomplete_files_ext"}
        />
      </SettingsBox>
      <SavingManagement />
      <RequestMoreSettings />
    </>
  );
};

export default DownloadsPage;
