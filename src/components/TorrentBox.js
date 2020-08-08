import React, {useState, useEffect} from 'react';
import { Icon, ProgressBar } from 'react-onsenui';
import stateDictionary from './stateDictionary';
import {pause, resume} from '../utils/TorrClient';
import filesize from "filesize"
import {IonSpinner} from "@ionic/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCloudDownload, faCloudUpload, faTachometerAltFast} from "@fortawesome/pro-regular-svg-icons";

const TorrentBox = ( props ) => {

  // const template = {
  //   added_on: 1596849714,
  //   amount_left: 2025018553,
  //   auto_tmm: false,
  //   availability: 0.004999999888241291,
  //   category: "",
  //   completed: 19824640,
  //   completion_on: 18000,
  //   dl_limit: -1,
  //   dlspeed: 0,
  //   downloaded: 19542669,
  //   downloaded_session: 19900384,
  //   eta: 8640000,
  //   f_l_piece_prio: false,
  //   force_start: false,
  //   last_activity: 0,
  //   magnet_uri: "magnet:?xt=urn:btih:633545e90ff160e875f0bc267b4895abe828542e&dn=Blood%20Diamond%20(2006)%20%5b1080p%5d",
  //   max_ratio: -1,
  //   max_seeding_time: -1,
  //   name: "Blood Diamond (2006) [1080p]",
  //   num_complete: 25,
  //   num_incomplete: 206,
  //   num_leechs: 0,
  //   num_seeds: 0,
  //   priority: 3,
  //   progress: 0.009694943880227397,
  //   ratio: 0,
  //   ratio_limit: -2,
  //   save_path: "/home/ntoporcov/Downloads/",
  //   seeding_time_limit: -2,
  //   seen_complete: 1596849724,
  //   seq_dl: false,
  //   size: 2044843193,
  //   state: "pausedDL",
  //   super_seeding: false,
  //   tags: "",
  //   time_active: 11,
  //   total_size: 2044843193,
  //   tracker: "",
  //   up_limit: -1,
  //   uploaded: 0,
  //   uploaded_session: 0,
  //   upspeed: 0}

  const item = props.item;
  const  hash  = props.hash;
  const { name } = item;

  const { filter } = props;

  // const {syncData} = useContext(Context)

  const torrentData = item ;

  const { progress } = torrentData || 0
  const { eta } = torrentData || 0
  const { state } = torrentData || ""
  const { num_leechs } = torrentData || 0
  const { num_seeds } = torrentData || 0
  const { upspeed } = torrentData || 0
  const { dlspeed } = torrentData || 0

  const [actionLoading,setActionLoading] = useState(false)

  const date = new Date(0);
  date.setSeconds(eta); // specify value for SECONDS here
  const timeString = eta?date.toISOString().substr(11, 8):0;

  const isDone = () => {
    return !!state.includes("UP");
  }

  const isPaused = () => {
    switch (state) {
      case "pausedDL" : return true;
      case "pausedUP" : return true;
      default: return false;
    }
  }

  const isDL = () => {
    switch (state) {
      case "downloading" : return true;
      case "metaDL" : return true;
      case "queuedDL" : return true;
      case "stalledDL" : return true;
      case "checkingDL" : return true;
      case "forceDL" : return true;
      case "checkingResumeData" : return true;
      case "allocating" : return true;
      default: return false;
    }
  }

  const statsIconStyle = {
      color:isDL()?"#0076ff":"#b2b2b2",
      marginRight:5,
  }

  useEffect(()=>{
    if(actionLoading){
      setTimeout(()=>{
          setActionLoading(false)
      },1000)
    }
  },[actionLoading])


  if(
      (filter=== "downloading" && progress < 1)
      || (filter === "complete" && progress === 1)
      || (filter === "all")
  ) {
    return (
        <div className="torrentBox">
          <h3>{name}</h3>
          <div className="stats">
            <span>{(progress * 100).toFixed(0)}%</span>
            {eta !== 8640000 ? <span>{timeString}</span> : <span>{stateDictionary[state].short}</span>}
          </div>
          <ProgressBar
              style={{paddingBottom: 10}}
              value={progress * 100}
              secondaryValue={100}
          />
          <div className="details">
            <div className="statsRow">
            <span>
              <FontAwesomeIcon style={statsIconStyle}
                               icon={isDone() ? faCloudUpload : faCloudDownload}
              />
              <span className={"data"}>
                {isDone() ? num_leechs : num_seeds}
              </span>
            </span>
              <span>
              <FontAwesomeIcon style={statsIconStyle} icon={faTachometerAltFast}/>
              <span className={"data"}>
                {isPaused() || isDone() ? "0" : filesize(isDone() ? upspeed : dlspeed, {round: 1}) + "/s"}
              </span>
            </span>
            </div>
            {
              actionLoading ?
                  <IonSpinner name={"lines"}/>
                  : <div className="buttonsRow">
                    <button
                        type="button"
                        onClick={() => {
                          props.openAction(hash,torrentData)
                        }}
                    >
                      <Icon size={30} icon="ion-ios-more"/>
                    </button>
                    <button
                        className={isPaused() ? "active" : null}
                        type="button"
                        disabled={isDone()}
                        onClick={() => {
                          setActionLoading(true)
                          pause(hash)
                        }}
                    >
                      <Icon size={30} icon="ion-ios-pause"/>
                    </button>
                    <button
                        className={isDL() ? "active" : null}
                        type="button"
                        disabled={isDone()}
                        onClick={() => {
                          setActionLoading(true)
                          resume(hash)
                        }}
                    >
                      <Icon size={30} icon="ion-ios-play"/>
                    </button>
                  </div>
            }
          </div>
        </div>
    )
  }else{
    return null
  }
}

export default TorrentBox;
