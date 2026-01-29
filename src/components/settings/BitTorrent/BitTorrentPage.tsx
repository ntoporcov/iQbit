import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsTextArea from "../Inputs/SettingsTextArea";
import { TorSettingsEncryption, TorrSettingsMaxRatioAction } from "../../../types";
import { Heading, Stack } from "@chakra-ui/react";

const BitTorrentPage = () => {
  const encryptionOptions: SettingsSelectOption[] = [
    { label: "Allow encryption", value: TorSettingsEncryption.Prefer },
    { label: "Require encryption", value: TorSettingsEncryption.ForceOn },
    { label: "Disable encryption", value: TorSettingsEncryption.ForceOff },
  ];

  const ratioActionOptions: SettingsSelectOption[] = [
    { label: "Stop torrent", value: TorrSettingsMaxRatioAction.pause },
    { label: "Remove torrent", value: TorrSettingsMaxRatioAction.remove },
  ];

  return (
    <Stack spacing={4}>
      <SettingsBox title={"Privacy"}>
        <SettingsSwitch
          label={"Enable DHT (decentralized network) to find more peers"}
          settingKey={"dht"}
        />
        <SettingsSwitch
          label={"Enable Peer Exchange (PeX) to find more peers"}
          settingKey={"pex"}
        />
        <SettingsSwitch
          label={"Enable Local Peer Discovery to find more peers"}
          settingKey={"lsd"}
        />
        <SettingsSelect
          label={"Encryption mode"}
          settingKey={"encryption"}
          options={encryptionOptions}
        />
        <SettingsSwitch
          label={"Enable anonymous mode"}
          settingKey={"anonymous_mode"}
        />
      </SettingsBox>

      <SettingsBox title={"Torrent Queueing"}>
        <SettingsTextInput
          label={"Max active checking torrents"}
          settingKey={"max_active_checking_torrents"}
        />
        <SettingsSwitch
          label={"Torrent Queueing"}
          settingKey={"queueing_enabled"}
        />
        <SettingsTextInput
          label={"Maximum active downloads"}
          settingKey={"max_active_downloads"}
        />
        <SettingsTextInput
          label={"Maximum active uploads"}
          settingKey={"max_active_uploads"}
        />
        <SettingsTextInput
          label={"Maximum active torrents"}
          settingKey={"max_active_torrents"}
        />
        <SettingsSwitch
          label={"Do not count slow torrents in these limits"}
          settingKey={"dont_count_slow_torrents"}
        />
        <SettingsTextInput
          label={"Download rate threshold (KiB/s)"}
          settingKey={"slow_torrent_dl_rate_threshold"}
        />
        <SettingsTextInput
          label={"Upload rate threshold (KiB/s)"}
          settingKey={"slow_torrent_ul_rate_threshold"}
        />
        <SettingsTextInput
          label={"Torrent inactivity timer (seconds)"}
          settingKey={"slow_torrent_inactive_timer"}
        />
      </SettingsBox>

      <SettingsBox title={"Seeding Limits"}>
        <Stack spacing={2}>
          <Heading size="xs">When ratio reaches</Heading>
          <SettingsSwitch label="Enabled" settingKey="max_ratio_enabled" />
          <SettingsTextInput
            label="Ratio"
            settingKey="max_ratio"
            disabled={false} // Would be nice if it was dynamic based on enabled
          />
        </Stack>
        <Stack spacing={2} mt={4}>
          <Heading size="xs">When total seeding time reaches (minutes)</Heading>
          <SettingsSwitch label="Enabled" settingKey="max_seeding_time_enabled" />
          <SettingsTextInput
            label="Minutes"
            settingKey="max_seeding_time"
          />
        </Stack>
        <Stack spacing={2} mt={4}>
          <Heading size="xs">When inactive seeding time reaches (minutes)</Heading>
          <SettingsSwitch label="Enabled" settingKey="max_inactive_seeding_time_enabled" />
          <SettingsTextInput
            label="Minutes"
            settingKey="max_inactive_seeding_time"
          />
        </Stack>
        <SettingsSelect
          label={"then"}
          settingKey={"max_ratio_act"}
          options={ratioActionOptions}
        />
      </SettingsBox>

      <SettingsBox title={"Trackers"}>
        <SettingsSwitch
          label={"Automatically append these trackers to new downloads"}
          settingKey={"add_trackers_enabled"}
        />
        <SettingsTextArea
          label={"Trackers"}
          settingKey={"add_trackers"}
        />
        <SettingsSwitch
          label={"Automatically append trackers from URL to new downloads"}
          settingKey={"add_trackers_from_url_enabled"}
        />
        <SettingsTextInput
          label={"URL"}
          settingKey={"add_trackers_url"}
        />
        <SettingsTextArea
          label={"Fetched trackers"}
          settingKey={"add_trackers_url_list"}
          disabled
        />
      </SettingsBox>
    </Stack>
  );
};

export default BitTorrentPage;
