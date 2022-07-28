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
