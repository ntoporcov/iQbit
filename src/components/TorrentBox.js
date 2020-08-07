import React, {useState, useEffect, useContext} from 'react';
import { Icon, ProgressBar, ProgressCircular } from 'react-onsenui';
import stateDictionary from './stateDictionary';
import {pause, resume, getProperties, getTorrents, sync} from '../utils/TorrClient';
import filesize from "filesize"
import {IonSpinner} from "@ionic/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCloudDownload, faCloudUpload, faTachometerAltFast} from "@fortawesome/pro-regular-svg-icons";
import useInterval from "../utils/useInterval";

const TorrentBox = ( props ) => {

  const { item } = props;
  const { hash } = item;
  const { name } = item;

  const { filter } = props;

  const [torrentData,setTorrentData] = useState(item)

  const { progress } = torrentData || 0
  const { eta } = torrentData || 0
  const { state } = torrentData || 0
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


  useInterval(() => {
    sync().then(resp => {
      setTorrentData(resp.data.torrents[hash])
    });
  },1000)

  const handleFilter = (progress) => {
    switch (filter) {
      case "downloading": return progress < 1;
      case "complete": return progress === 1
      default: return  true;
    }
  }

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
