import React, {useState,useEffect} from 'react';
import { Icon, ProgressBar, ProgressCircular } from 'react-onsenui';
import stateDictionary from './stateDictionary';
import { pause, resume } from '../utils/TorrClient';
import filesize from "filesize"
import {IonSpinner} from "@ionic/react";

const TorrentBox = ( props ) => {

  const { item } = props;
  const { name } = item
  const { hash } = item
  const { progress } = item
  const { eta } = item
  const { state } = item
  const { num_leechs } = item
  const { num_seeds } = item
  const { upspeed } = item
  const { dlspeed } = item

  const [actionLoading,setActionLoading] = useState(false)

  const date = new Date(0);
  date.setSeconds(eta); // specify value for SECONDS here
  const timeString = date.toISOString().substr(11, 8);


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
  }

  useEffect(()=>{
    if(actionLoading){
      setTimeout(()=>{
          setActionLoading(false)
      },1000)
    }
  },[actionLoading])

  return (
    <div className="torrentBox">
      <h3>{name}</h3>
      <div className="stats">
        <span>{(progress*100).toFixed(0)}%</span>
        {eta !== 8640000 ? <span>{timeString}</span> : <span>{stateDictionary[state].short}</span>}
      </div>
      <ProgressBar
        style={{paddingBottom:10}}
        value={progress*100}
        secondaryValue={100}
      />
      <div className="details">
        <div className="statsRow">
          <span>
            <Icon style={statsIconStyle} statsIconStyle size={20}
                  icon={isDone()?"ion-ios-cloud-upload":"ion-ios-cloud-download"}
            />
            <span className={"data"}>
              {isDone()?num_leechs:num_seeds}
            </span>
          </span>
          <span>
            <Icon style={statsIconStyle} statsIconStyle size={20} icon="ion-ios-speedometer"/>
            <span className={"data"}>
              {isPaused() || isDone() ? "0" : filesize(isDone()?upspeed:dlspeed,{round:1})+"/s"}
            </span>
          </span>
        </div>
        {
          actionLoading?
              <IonSpinner name={"lines"}/>
              :<div className="buttonsRow">
                <button
                    type="button"
                    onClick={() => {
                      props.openAction(hash)
                    }}
                >
                  <Icon size={30} icon="ion-ios-more" />
                </button>
                <button
                    className={isPaused()? "active" : null}
                    type="button"
                    disabled={isDone()}
                    onClick={() => {
                      setActionLoading(true)
                      pause(hash)
                    }}
                >
                  <Icon size={30} icon="ion-ios-pause" />
                </button>
                <button
                    className={isDL()? "active" : null}
                    type="button"
                    disabled={isDone()}
                    onClick={() => {
                      setActionLoading(true)
                      resume(hash)
                    }}
                >
                  <Icon size={30} icon="ion-ios-play" />
                </button>
              </div>
        }
      </div>
    </div>
  )
}

export default TorrentBox;
