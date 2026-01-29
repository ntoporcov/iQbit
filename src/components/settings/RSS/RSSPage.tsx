import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsTextArea from "../Inputs/SettingsTextArea";
import { Stack, Button } from "@chakra-ui/react";
import RequestMoreSettings from "../RequestMoreSettings";

const RSSPage = () => {
  return (
    <Stack spacing={4}>
      <SettingsBox title={"RSS Reader"}>
        <SettingsSwitch
          label={"Enable fetching RSS feeds"}
          settingKey={"rss_processing_enabled"}
        />
        <SettingsTextInput
          label={"Feeds refresh interval (min)"}
          settingKey={"rss_refresh_interval"}
        />
        <SettingsTextInput
          label={"Same host request delay (sec)"}
          settingKey={"rss_fetch_delay"}
        />
        <SettingsTextInput
          label={"Maximum number of articles per feed"}
          settingKey={"rss_max_articles_per_feed"}
        />
      </SettingsBox>

      <SettingsBox title={"RSS Torrent Auto Downloader"}>
        <SettingsSwitch
          label={"Enable auto downloading of RSS torrents"}
          settingKey={"rss_auto_downloading_enabled"}
        />
        <Button variant={"outline"} colorScheme={"blue"} width={"full"} mt={2}>
          Edit auto downloading rules...
        </Button>
      </SettingsBox>

      <SettingsBox title={"RSS Smart Episode Filter"}>
        <SettingsSwitch
          label={"Download REPACK/PROPER episodes"}
          settingKey={"rss_download_repack_proper_episodes"}
        />
        <SettingsTextArea
          label={"Filters"}
          settingKey={"rss_smart_episode_filters"}
        />
      </SettingsBox>
    </Stack>
  );
};

export default RSSPage;
