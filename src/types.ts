import { Dispatch, SetStateAction } from "react";
import { useFilterStateReturn } from "./components/Filters";

export type TorrCategories = {
  [i: string]: TorrCategory;
};

export type TorrCategory = { name: string; savePath: string };

export type TorrServerState = {
  refresh_interval: number;
  dht_nodes: number;
  total_peer_connections: number;
  average_time_queue: number;
  free_space_on_disk: number;
  total_queued_size: number;
  dl_info_data: number;
  queueing: boolean;
  connection_status: string;
  alltime_ul: number;
  up_info_speed: number;
  read_cache_overload: string;
  global_ratio: string;
  dl_rate_limit: number;
  write_cache_overload: string;
  queued_io_jobs: number;
  total_buffers_size: number;
  read_cache_hits: string;
  use_alt_speed_limits: boolean;
  up_info_data: number;
  total_wasted_session: number;
  up_rate_limit: number;
  alltime_dl: number;
  dl_info_speed: number;
  last_external_address_v4?: string;
};

export const TorrTorrentInfoStates = [
  "error",
  "missingFiles",
  "uploading",
  "pausedUP",
  "queuedUP",
  "stalledUP",
  "checkingUP",
  "forcedUP",
  "allocating",
  "downloading",
  "metaDL",
  "pausedDL",
  "queuedDL",
  "stalledDL",
  "checkingDL",
  "forcedDL",
  "checkingResumeData",
  "moving",
  "stoppedUP",
  "unknown",
] as const;
export type TorrTorrentInfoStateUnion = typeof TorrTorrentInfoStates[number];

export type TorrTorrentInfo = {
  max_ratio: number;
  infohash_v1: string;
  infohash_v2: string;
  force_start: boolean;
  dl_limit: number;
  eta: number;
  download_path: string;
  num_complete: number;
  seen_complete: number;
  completion_on: number;
  ratio_limit: number;
  state: TorrTorrentInfoStateUnion;
  downloaded_session: number;
  completed: number;
  priority: number;
  super_seeding: boolean;
  downloaded: number;
  tags: string;
  size: number;
  magnet_uri: string;
  name: string;
  content_path: string;
  hash: string;
  amount_left: number;
  auto_tmm: boolean;
  seeding_time: number;
  trackers_count: number;
  availability: number;
  num_incomplete: number;
  seeding_time_limit: number;
  save_path: string;
  num_seeds: number;
  last_activity: number;
  num_leechs: number;
  tracker: string;
  uploaded: number;
  added_on: number;
  time_active: number;
  total_size: number;
  seq_dl: boolean;
  f_l_piece_prio: boolean;
  upspeed: number;
  uploaded_session: number;
  up_limit: number;
  max_seeding_time: number;
  progress: number;
  category: string;
  dlspeed: number;
  ratio: number;
};

export type TorrMainData = {
  rid: number;
  full_update: boolean;
  torrents: {
    [i: string]: Partial<TorrTorrentInfo>;
  };
  torrents_removed: string[];
  categories: TorrCategories;
  categories_removed: string[];
  tags: string[];
  tags_removed: string[];
  server_state: TorrServerState;
};

export type TorrPlugin = {
  enabled: boolean;
  name: string;
  fullName: string;
  supportedCategories: { name: string; id: string }[];
  url: string;
  version: string;
};

export type TorrPublicPlugin = {
  img?: string;
  name: string;
  website?: string;
  lastUpdated?: string;
  authors?: string[];
  version?: string;
  link?: string;
  comments?: string;
  readme?: string;
};

export type TorrSearchStatuses = "Running" | "Stopped";

export type TorrSearchStatus = {
  id: number;
  status: TorrSearchStatuses;
  total: number;
};

export type TorrPluginSearchResult = {
  descrLink: string;
  fileName: string;
  siteUrl: string;
  nbLeechers: number;
  fileSize: number;
  nbSeeders: number;
  fileUrl: string;
};

export type TorrPluginSearchResultResponse = {
  results: TorrPluginSearchResult[];
  status: TorrSearchStatuses;
  total: number;
};

export enum TorrSettingsScanDirsEnum {
  DownloadToMonitoredFolder,
  DownloadToDefaultSavePath,
}

export type TorrSettingsScanDirs = {
  [i: string]: TorrSettingsScanDirsEnum | string;
};

export enum TorrSettingsSchedulerDays {
  EveryDay,
  EveryWeekday,
  EveryWeekend,
  EveryMonday,
  EveryTuesday,
  EveryWednesday,
  EveryThursday,
  EveryFriday,
  EverySaturday,
  EverySunday,
}

export enum TorSettingsEncryption {
  Prefer,
  ForceOn,
  ForceOff,
}

export enum TorrSettingsProxyType {
  disabled = -1,
  HTTPWithoutAuth = 1,
  SOCKS5WithoutAuth,
  HTTPWithAuth,
  SOCKS5WithAuth,
  SOCKS4WithoutAuth,
}

export enum TorrDynDNSService {
  UseDynDNS,
  useNOIP,
}

export enum TorrSettingsMaxRatioAction {
  pause,
  remove,
}

export enum TorrSettingsBitTorrentProtocol {
  tcpANDutp,
  tcp,
  utp,
}

export enum TorrSettingsUploadChokingAlgo {
  RoundRobin,
  FastestUpload,
  AntiLeech,
}

export enum TorrSettingsUploadSlotsBehavior {
  FixedSlots,
  UplaodRateBased,
}

export enum TorrSettingsDiskIOType {
  Default,
  POSIX,
  MemoryMapped,
}

export enum TorrSettingsDiskIOMode {
  DisableOSCache,
  EnableOSCache,
  WriteThrough,
}

export enum TorrSettingsUTPTCPMixedMode {
  preferTCP,
  peerProportional,
}

export type TorrSettingContentLayout = "Original" | "Subfolder" | "NoSubfolder";

export type TorrSettings = {
  torrent_content_layout: TorrSettingContentLayout;
  embedded_tracker_port: number;
  web_ui_max_auth_fail_count: number;
  limit_lan_peers: boolean;
  max_ratio_enabled: boolean;
  web_ui_domain_list: string;
  proxy_password: string;
  alternative_webui_path: string;
  web_ui_ban_duration: number;
  announce_to_all_trackers: boolean;
  send_buffer_watermark: number;
  torrent_changed_tmm_enabled: boolean;
  dl_limit: number;
  autorun_program: string;
  async_io_threads: number;
  resolve_peer_countries: boolean;
  web_ui_clickjacking_protection_enabled: boolean;
  byfpass_auth_subnet_whitelist_enabled: boolean;
  rss_auto_downloading_enabled: boolean;
  temp_path_enabled: boolean;
  pex: boolean;
  incomplete_files_ext: boolean;
  send_buffer_low_watermark: number;
  scan_dirs: TorrSettingsScanDirs;
  preallocate_all: boolean;
  dyndns_username: string;
  current_network_interface: string;
  autorun_enabled: boolean;
  scheduler_days: TorrSettingsSchedulerDays;
  limit_tcp_overhead: boolean;
  mail_notification_ssl_enabled: boolean;
  proxy_peer_connections: boolean;
  dyndns_enabled: boolean;
  random_port: boolean;
  anonymous_mode: boolean;
  rss_max_articles_per_feed: number;
  ip_filter_enabled: boolean;
  mail_notification_smtp: string;
  web_ui_https_cert_path: string;
  enable_coalesce_read_write: boolean;
  banned_IPs: string;
  schedule_to_hour: number;
  rss_processing_enabled: boolean;
  save_path: string;
  save_path_changed_tmm_enabled: boolean;
  encryption: TorSettingsEncryption;
  proxy_auth_enabled: boolean;
  ip_filter_path: string;
  web_ui_csrf_protection_enabled: boolean;
  max_ratio_act: TorrSettingsMaxRatioAction;
  mail_notification_email: string;
  proxy_username: string;
  web_ui_address: string;
  max_connec: number;
  announce_ip: string;
  export_dir_fin: string;
  add_trackers: string;
  dht: boolean;
  send_buffer_watermark_factor: number;
  stop_tracker_timeout: number;
  web_ui_username: string;
  web_ui_password: string;
  current_interface_address: string;
  slow_torrent_dl_rate_threshold: number;
  max_seeding_time: number;
  web_ui_host_header_validation_enabled: boolean;
  dont_count_slow_torrents: boolean;
  schedule_from_hour: number;
  use_https: boolean;
  proxy_type: TorrSettingsProxyType;
  disk_cache: number;
  max_ratio: number;
  rss_refresh_interval: number;
  rss_fetch_delay: number;
  web_ui_port: number;
  upload_slots_behavior: TorrSettingsUploadSlotsBehavior;
  limit_utp_rate: boolean;
  bittorrent_protocol: TorrSettingsBitTorrentProtocol;
  disk_cache_ttl: number;
  dyndns_password: string;
  bypass_local_auth: boolean;
  enable_piece_extent_affinity: boolean;
  upload_choking_algorithm: TorrSettingsUploadChokingAlgo;
  enable_os_cache: boolean;
  ip_filter_trackers: boolean;
  schedule_from_min: number;
  queueing_enabled: boolean;
  category_changed_tmm_enabled: boolean;
  max_seeding_time_enabled: boolean;
  max_uploads_per_torrent: number;
  socket_backlog_size: number;
  web_ui_upnp: boolean;
  proxy_port: number;
  bypass_auth_subnet_whitelist: string;
  listen_port: number;
  mail_notification_sender: string;
  upnp: boolean;
  web_ui_use_custom_http_headers_enabled: boolean;
  create_subfolder_enabled: boolean;
  alt_up_limit: number;
  max_active_downloads: number;
  max_active_checking_torrents: number;
  slow_torrent_inactive_timer: number;
  max_active_uploads: number;
  lsd: boolean;
  utp_tcp_mixed_mode: TorrSettingsUTPTCPMixedMode;
  max_inactive_seeding_time: number;
  max_inactive_seeding_time_enabled: boolean;
  auto_delete_mode: number;
  outgoing_ports_min: number;
  slow_torrent_ul_rate_threshold: number;
  web_ui_https_key_path: string;
  enable_multi_connections_from_same_ip: boolean;
  proxy_torrents_only: boolean;
  locale: string;
  alternative_webui_enabled: boolean;
  max_connec_per_torrent: number;
  rss_download_repack_proper_episodes: boolean;
  alt_dl_limit: number;
  recheck_completed_torrents: boolean;
  enable_upload_suggestions: boolean;
  mail_notification_password: string;
  save_resume_data_interval: number;
  schedule_to_min: number;
  web_ui_custom_http_headers: string;
  dyndns_service: TorrDynDNSService;
  dyndns_domain: string;
  temp_path: string;
  proxy_ip: string;
  announce_to_all_tiers: boolean;
  max_uploads: number;
  enable_embedded_tracker: boolean;
  mail_notification_enabled: boolean;
  web_ui_session_timeout: number;
  file_pool_size: number;
  start_paused_enabled: boolean;
  rss_smart_episode_filters: string;
  add_trackers_enabled: boolean;
  add_trackers_from_url_enabled: boolean;
  add_trackers_url: string;
  add_trackers_url_list: string;
  web_ui_secure_cookie_enabled: boolean;
  checking_memory_use: number;
  mail_notification_auth_enabled: boolean;
  up_limit: number;
  scheduler_enabled: boolean;
  auto_tmm_enabled: boolean;
  outgoing_ports_max: number;
  max_active_torrents: number;
  mail_notification_username: string;
  export_dir: string;
  web_ui_reverse_proxy_enabled: boolean;
  web_ui_reverse_proxies_list: string;
  resume_data_storage_type: string;
  torrent_content_remove_option: string;
  memory_working_set_limit: number;
  torrent_file_size_limit: number;
  confirm_torrent_recheck: boolean;
  app_instance_name: string;
  reannounce_when_address_changed: boolean;
  embedded_tracker_port_forwarding: boolean;
  ignore_ssl_errors: boolean;
  python_executable_path: string;
  bdecode_depth_limit: number;
  bdecode_token_limit: number;
  hashing_threads: number;
  disk_queue_size: number;
  disk_io_type: TorrSettingsDiskIOType;
  disk_io_read_mode: TorrSettingsDiskIOMode;
  disk_io_write_mode: TorrSettingsDiskIOMode;
  connection_speed: number;
  socket_send_buffer_size: number;
  socket_receive_buffer_size: number;
  upnp_lease_duration: number;
  peer_tos: number;
  idn_support_enabled: boolean;
  validate_https_tracker_certificate: boolean;
  ssrf_mitigation: boolean;
  block_peers_on_privileged_ports: boolean;
  announce_port: number;
  max_concurrent_http_announces: number;
  peer_turnover: number;
  peer_turnover_cutoff: number;
  peer_turnover_interval: number;
  request_queue_size: number;
  dht_bootstrap_nodes: string;
  i2p_inbound_quantity: number;
  i2p_outbound_quantity: number;
  i2p_inbound_length: number;
  i2p_outbound_length: number;
};

export type SearchProviderComponentProps = {
  category: string;
  searchState: [string, Dispatch<SetStateAction<string>>];
  filterState: useFilterStateReturn;
  onSearch?: () => void;
};

export interface YTSTorrent {
  size_bytes: number;
  size: string;
  seeds: number;
  date_uploaded: string;
  peers: number;
  date_uploaded_unix: number;
  type: string;
  url: string;
  hash: string;
  quality: string;
}

export interface YTSMovies {
  small_cover_image: string;
  year: number;
  description_full: string;
  rating: number;
  large_cover_image: string;
  title_long: string;
  language: string;
  yt_trailer_code: string;
  title: string;
  mpa_rating: string;
  genres: string[];
  title_english: string;
  id: number;
  state: string;
  slug: string;
  summary: string;
  date_uploaded: string;
  runtime: number;
  synopsis: string;
  url: string;
  imdb_code: string;
  background_image: string;
  torrents: YTSTorrent[];
  date_uploaded_unix: number;
  background_image_original: string;
  medium_cover_image: string;
}

export interface YTSData {
  movies: YTSMovies[];
  page_number: number;
  movie_count: number;
  limit: number;
}

export type TPBRecord = {
  added: string;
  category: string;
  id: string;
  imdb: string;
  info_hash: string;
  leechers: string;
  name: string;
  num_files: string;
  seeders: string;
  size: string;
  status: string;
  username: string;
};

export type rarbgTorrent = {
  title: string;
  category: string;
  download: string;
  seeders: number;
  leechers: number;
  size: number;
  pubdate: Date;
  episode_info: {
    imdb?: string;
    tvrage?: string;
    tvdb?: string;
    themoviedb?: string;
  };
  ranked: number;
  info_page: string;
};

export type TorrFilePriority = 0 | 1 | 2 | 7; // 0=skip, 1=normal, 2=high, 7=maximal

export type TorrFile = {
  index: number;
  name: string;
  size: number;
  progress: number;
  priority: TorrFilePriority;
  is_seed?: boolean;
  piece_range?: [number, number];
};

export type TorrFileContent = {
  index: number;
  name: string;
  size: number;
  progress: number;
  priority: TorrFilePriority;
};