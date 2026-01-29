import React from "react";
import SettingsBox from "../SettingsBox";
import SettingsSwitch from "../Inputs/SettingsSwitch";
import SettingsTextInput from "../Inputs/SettingsTextInput";
import SettingsSelect, { SettingsSelectOption } from "../Inputs/SettingsSelect";
import { Stack } from "@chakra-ui/react";
import { TorrSettingsDiskIOMode, TorrSettingsDiskIOType, TorrSettingsUploadChokingAlgo, TorrSettingsUploadSlotsBehavior, TorrSettingsUTPTCPMixedMode } from "../../../types";

const AdvancedPage = () => {
  const resumeStorageOptions: SettingsSelectOption[] = [
    { label: "Fastresume files", value: "Legacy" },
    { label: "SQLite database", value: "SQLite" },
  ];

  const removeOptionOptions: SettingsSelectOption[] = [
    { label: "Delete files permanently", value: "Delete" },
    { label: "Move to trash", value: "MoveToTrash" },
  ];

  const diskIOTypeOptions: SettingsSelectOption[] = [
    { label: "Default", value: TorrSettingsDiskIOType.Default },
    { label: "POSIX", value: TorrSettingsDiskIOType.POSIX },
    { label: "Memory mapped", value: TorrSettingsDiskIOType.MemoryMapped },
  ];

  const diskIOModeOptions: SettingsSelectOption[] = [
    { label: "Disable OS cache", value: TorrSettingsDiskIOMode.DisableOSCache },
    { label: "Enable OS cache", value: TorrSettingsDiskIOMode.EnableOSCache },
    { label: "Write through", value: TorrSettingsDiskIOMode.WriteThrough },
  ];

  const mixedModeOptions: SettingsSelectOption[] = [
    { label: "Prefer TCP", value: TorrSettingsUTPTCPMixedMode.preferTCP },
    { label: "Peer proportional", value: TorrSettingsUTPTCPMixedMode.peerProportional },
  ];

  const uploadSlotsBehaviorOptions: SettingsSelectOption[] = [
    { label: "Fixed slots", value: TorrSettingsUploadSlotsBehavior.FixedSlots },
    { label: "Upload rate based", value: TorrSettingsUploadSlotsBehavior.UplaodRateBased },
  ];

  const uploadChokingAlgoOptions: SettingsSelectOption[] = [
    { label: "Round robin", value: TorrSettingsUploadChokingAlgo.RoundRobin },
    { label: "Fastest upload", value: TorrSettingsUploadChokingAlgo.FastestUpload },
    { label: "Anti-leech", value: TorrSettingsUploadChokingAlgo.AntiLeech },
  ];

  return (
    <Stack spacing={4}>
      <SettingsBox title={"qBittorrent Section"}>
        <SettingsSelect
          label={"Resume data storage type (requires restart)"}
          settingKey={"resume_data_storage_type"}
          options={resumeStorageOptions}
        />
        <SettingsSelect
          label={"Torrent content removing mode"}
          settingKey={"torrent_content_remove_option"}
          options={removeOptionOptions}
        />
        <SettingsTextInput
          label={"Physical memory (RAM) usage limit (MiB)"}
          settingKey={"memory_working_set_limit"}
        />
        <SettingsTextInput
          label={"Network interface"}
          settingKey={"current_network_interface"}
        />
        <SettingsTextInput
          label={"Optional IP address to bind to"}
          settingKey={"current_interface_address"}
        />
        <SettingsTextInput
          label={"Save resume data interval (min)"}
          settingKey={"save_resume_data_interval"}
        />
        <SettingsTextInput
          label={"Save statistics interval (min)"}
          settingKey={"save_statistics_interval"}
        />
        <SettingsTextInput
          label={".torrent file size limit (MiB)"}
          settingKey={"torrent_file_size_limit"}
        />
        <SettingsSwitch
          label={"Confirm torrent recheck"}
          settingKey={"confirm_torrent_recheck"}
        />
        <SettingsSwitch
          label={"Recheck torrents on completion"}
          settingKey={"recheck_completed_torrents"}
        />
        <SettingsTextInput
          label={"Customize application instance name"}
          settingKey={"app_instance_name"}
        />
        <SettingsTextInput
          label={"Refresh interval (ms)"}
          settingKey={"refresh_interval"}
        />
        <SettingsSwitch
          label={"Resolve peer countries"}
          settingKey={"resolve_peer_countries"}
        />
        <SettingsSwitch
          label={"Reannounce to all trackers when IP or port changed"}
          settingKey={"reannounce_when_address_changed"}
        />
        <SettingsSwitch
          label={"Enable embedded tracker"}
          settingKey={"enable_embedded_tracker"}
        />
        <SettingsTextInput
          label={"Embedded tracker port"}
          settingKey={"embedded_tracker_port"}
        />
        <SettingsSwitch
          label={"Enable port forwarding for embedded tracker"}
          settingKey={"embedded_tracker_port_forwarding"}
        />
        <SettingsSwitch
          label={"Ignore SSL errors"}
          settingKey={"ignore_ssl_errors"}
        />
        <SettingsTextInput
          label={"Python executable path (may require restart)"}
          settingKey={"python_executable_path"}
        />
      </SettingsBox>

      <SettingsBox title={"libtorrent Section"}>
        <SettingsTextInput
          label={"Bdecode depth limit"}
          settingKey={"bdecode_depth_limit"}
        />
        <SettingsTextInput
          label={"Bdecode token limit"}
          settingKey={"bdecode_token_limit"}
        />
        <SettingsTextInput
          label={"Asynchronous I/O threads"}
          settingKey={"async_io_threads"}
        />
        <SettingsTextInput
          label={"Hashing threads"}
          settingKey={"hashing_threads"}
        />
        <SettingsTextInput
          label={"File pool size"}
          settingKey={"file_pool_size"}
        />
        <SettingsTextInput
          label={"Outstanding memory when checking torrents (MiB)"}
          settingKey={"checking_memory_use"}
        />
        <SettingsTextInput
          label={"Disk queue size (KiB)"}
          settingKey={"disk_queue_size"}
        />
        <SettingsSelect
          label={"Disk IO type (requires restart)"}
          settingKey={"disk_io_type"}
          options={diskIOTypeOptions}
        />
        <SettingsSelect
          label={"Disk IO read mode"}
          settingKey={"disk_io_read_mode"}
          options={diskIOModeOptions}
        />
        <SettingsSelect
          label={"Disk IO write mode"}
          settingKey={"disk_io_write_mode"}
          options={diskIOModeOptions}
        />
        <SettingsSwitch
          label={"Use piece extent affinity"}
          settingKey={"enable_piece_extent_affinity"}
        />
        <SettingsSwitch
          label={"Send upload piece suggestions"}
          settingKey={"enable_upload_suggestions"}
        />
        <SettingsTextInput
          label={"Send buffer watermark (KiB)"}
          settingKey={"send_buffer_watermark"}
        />
        <SettingsTextInput
          label={"Send buffer low watermark (KiB)"}
          settingKey={"send_buffer_low_watermark"}
        />
        <SettingsTextInput
          label={"Send buffer watermark factor (%)"}
          settingKey={"send_buffer_watermark_factor"}
        />
        <SettingsTextInput
          label={"Outgoing connections per second"}
          settingKey={"connection_speed"}
        />
        <SettingsTextInput
          label={"Socket send buffer size [0: system default] (KiB)"}
          settingKey={"socket_send_buffer_size"}
        />
        <SettingsTextInput
          label={"Socket receive buffer size [0: system default] (KiB)"}
          settingKey={"socket_receive_buffer_size"}
        />
        <SettingsTextInput
          label={"Socket backlog size"}
          settingKey={"socket_backlog_size"}
        />
        <SettingsTextInput
          label={"Outgoing ports (Min) [0: disabled]"}
          settingKey={"outgoing_ports_min"}
        />
        <SettingsTextInput
          label={"Outgoing ports (Max) [0: disabled]"}
          settingKey={"outgoing_ports_max"}
        />
        <SettingsTextInput
          label={"UPnP lease duration [0: permanent lease]"}
          settingKey={"upnp_lease_duration"}
        />
        <SettingsTextInput
          label={"Type of service (ToS) for connections to peers"}
          settingKey={"peer_tos"}
        />
        <SettingsSelect
          label={"μTP-TCP mixed mode algorithm"}
          settingKey={"utp_tcp_mixed_mode"}
          options={mixedModeOptions}
        />
        <SettingsSwitch
          label={"Support internationalized domain name (IDN)"}
          settingKey={"idn_support_enabled"}
        />
        <SettingsSwitch
          label={"Allow multiple connections from the same IP address"}
          settingKey={"enable_multi_connections_from_same_ip"}
        />
        <SettingsSwitch
          label={"Validate HTTPS tracker certificate"}
          settingKey={"validate_https_tracker_certificate"}
        />
        <SettingsSwitch
          label={"Server-side request forgery (SSRF) mitigation"}
          settingKey={"ssrf_mitigation"}
        />
        <SettingsSwitch
          label={"Disallow connection to peers on privileged ports"}
          settingKey={"block_peers_on_privileged_ports"}
        />
        <SettingsSelect
          label={"Upload slots behavior"}
          settingKey={"upload_slots_behavior"}
          options={uploadSlotsBehaviorOptions}
        />
        <SettingsSelect
          label={"Upload choking algorithm"}
          settingKey={"upload_choking_algorithm"}
          options={uploadChokingAlgoOptions}
        />
        <SettingsSwitch
          label={"Always announce to all trackers in a tier"}
          settingKey={"announce_to_all_trackers"}
        />
        <SettingsSwitch
          label={"Always announce to all tiers"}
          settingKey={"announce_to_all_tiers"}
        />
        <SettingsTextInput
          label={"IP address reported to trackers (requires restart)"}
          settingKey={"announce_ip"}
        />
        <SettingsTextInput
          label={"Port reported to trackers (requires restart) [0: listening port]"}
          settingKey={"announce_port"}
        />
        <SettingsTextInput
          label={"Max concurrent HTTP announces"}
          settingKey={"max_concurrent_http_announces"}
        />
        <SettingsTextInput
          label={"Stop tracker timeout [0: disabled]"}
          settingKey={"stop_tracker_timeout"}
        />
        <SettingsTextInput
          label={"Peer turnover disconnect percentage (%)"}
          settingKey={"peer_turnover"}
        />
        <SettingsTextInput
          label={"Peer turnover threshold percentage (%)"}
          settingKey={"peer_turnover_cutoff"}
        />
        <SettingsTextInput
          label={"Peer turnover disconnect interval (s)"}
          settingKey={"peer_turnover_interval"}
        />
        <SettingsTextInput
          label={"Maximum outstanding requests to a single peer"}
          settingKey={"request_queue_size"}
        />
        <SettingsTextInput
          label={"DHT bootstrap nodes"}
          settingKey={"dht_bootstrap_nodes"}
        />
        <SettingsTextInput
          label={"I2P inbound quantity"}
          settingKey={"i2p_inbound_quantity"}
        />
        <SettingsTextInput
          label={"I2P outbound quantity"}
          settingKey={"i2p_outbound_quantity"}
        />
        <SettingsTextInput
          label={"I2P inbound length"}
          settingKey={"i2p_inbound_length"}
        />
        <SettingsTextInput
          label={"I2P outbound length"}
          settingKey={"i2p_outbound_length"}
        />
      </SettingsBox>
    </Stack>
  );
};

export default AdvancedPage;
