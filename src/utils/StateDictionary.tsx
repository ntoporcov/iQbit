import { TorrTorrentInfoStateUnion } from "../types";

const stateDictionary: {
  [i in TorrTorrentInfoStateUnion]: { long: string; short: string };
} = {
  error: {
    long: "Some error occurred, applies to paused torrents",
    short: "Error",
  },
  missingFiles: {
    long: "Torrent data files is missing",
    short: "Files Missing",
  },
  uploading: {
    long: "Torrent is being seeded and data is being transferred",
    short: "Seeding",
  },
  pausedUP: {
    long: "Torrent is paused and has finished downloading",
    short: "Paused / Done",
  },
  queuedUP: {
    long: "Queuing is enabled and torrent is queued for upload",
    short: "Queued For Seeding",
  },
  stalledUP: {
    long: "Torrent is being seeded, but no connections were made",
    short: "Available for Seeding",
  },
  checkingUP: {
    long: "Torrent has finished downloading and is being checked",
    short: "Checking Files",
  },
  forcedUP: {
    long: "Torrent is forced to uploading and ignore queue limit",
    short: "Force Uploading",
  },
  allocating: {
    long: "Torrent is allocating disk space for download",
    short: "Allocating Space",
  },
  downloading: {
    long: "Torrent is being downloaded and data is being transferred",
    short: "Downloading",
  },
  metaDL: {
    long: "Torrent has just started downloading and is fetching metadata",
    short: "Fetching Metadata",
  },
  pausedDL: {
    long: "Torrent is paused and has NOT finished downloading",
    short: "Paused",
  },
  queuedDL: {
    long: "Queuing is enabled and torrent is queued for download",
    short: "Queued for Download",
  },
  stalledDL: {
    long: "Torrent is being downloaded, but no connection were made",
    short: "Stalled",
  },
  checkingDL: {
    long: "Same as checkingUP, but torrent has NOT finished downloading",
    short: "Checking Files",
  },
  forcedDL: {
    long: "Torrent is forced to downloading to ignore queue limit",
    short: "Force Downloading",
  },
  checkingResumeData: {
    long: "Checking resume data on qBt startup",
    short: "Checking Resume",
  },
  moving: {
    long: "Torrent is moving to another location",
    short: "Moving Location",
  },
  unknown: {
    long: "Unknown status",
    short: "Unknown",
  },
};

export default stateDictionary;
