import React, {useState} from "react";
import {ProgressBar} from "react-onsenui";
import fileSize from "filesize";
import stateDictionary from './stateDictionary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBolt, faDownload,
    faFolderOpen,
    faPallet,
    faPalletAlt,
    faShareAlt,
    faStopwatch,
    faTachometerAltFastest,
    faTachometerAltSlowest,
    faUpload,
    faUserAstronaut,
    faUserSecret
} from '@fortawesome/pro-regular-svg-icons'
import useInterval from "../utils/useInterval";
import {sync} from "../utils/TorrClient";

const TorrentInfo = (props) => {
    const {item} = props;
    const {name} = item
    const {hash} = props

    const [torrent,setTorrent] = useState(item)

    useInterval(() => {
        sync().then(resp => {
            setTorrent(resp.data.torrents[hash])
        });
    },1000)

    const AmountRow = [
        {
            value: `${fileSize(torrent.downloaded)} / ${fileSize(torrent.size)}`,
            icon: faDownload,
            label: "Downloaded"
        },
        {
            value: fileSize(torrent.downloaded_session),
            icon: faPallet,
            label: "Downloaded This Session"
        },
        {
            value: fileSize(torrent.uploaded),
            icon: faUpload,
            label: "Uploaded"
        },
        {
            value: fileSize(torrent.uploaded_session),
            icon: faPalletAlt,
            label: "Uploaded This Session"
        },
        {
            value: torrent.ratio?torrent.ratio.toFixed(2):0,
            icon: faShareAlt,
            label: "Share Ratio"
        },
    ]

    const date = new Date(0);
    date.setSeconds(torrent.eta); // specify value for SECONDS here
    const timeString = date.toISOString().substr(11, 8);

    const SpeedsRow = [
        {
            value: `${fileSize(torrent.dlspeed)}/s`,
            icon: torrent.dlspeed > 0 ? faTachometerAltFastest : faTachometerAltSlowest,
            label: "Download Speed"
        },
        {
            value: `${fileSize(torrent.upspeed)}/s`,
            icon: torrent.upspeed > 0 ? faTachometerAltFastest : faTachometerAltSlowest,
            label: "Download Speed"
        },
        {
            value: torrent.eta !== 8640000 ?
                timeString
                :0
            ,
            icon: faStopwatch,
            label: "Estimate Time Left"
        },
    ]

    const DataRow = [
        {
            value: `${torrent.num_seeds} (${torrent.num_complete})`,
            icon: faUserAstronaut,
            label: "Seeds"
        },
        {
            value: `${torrent.num_leechs} (${torrent.num_incomplete})`,
            icon: faUserSecret,
            label: "Leechs"
        },
        {
            value: torrent.save_path,
            icon: faFolderOpen,
            label: "Save Path"
        },
    ]

    const StateRow = [
        {
            value: stateDictionary[torrent.state].short,
            icon: faBolt,
            label: stateDictionary[torrent.state].long
        },
    ]

    return(
        <div className={"torrentInfoCol"}>
            <div>
                <h2>{name}</h2>
                <div>
                    <span className={"ProgressAmount"}>{(torrent.progress*100).toFixed(1)}%</span>
                    <ProgressBar
                        value={torrent.progress*100}
                        secondaryValue={100}
                    />
                </div>
            </div>
            <StatsRow data={StateRow} title={"CurrentState"}/>
            <StatsRow data={DataRow} title={"Metadata"}/>
            <StatsRow data={SpeedsRow} title={"Speeds"}/>
            <StatsRow data={AmountRow} title={"Amounts"}/>
        </div>
    )
}

export const StatsRow = (props) => {
    return(
        <div className={"infoStatsRowWrapper"}>
            <div className={"infoTitleBox"}>
                <h3>{props.title}</h3>
            </div>
            <div className={"infoStatsRow"}>
                {props.data.map((item,key) =>
                    <div className={"infoStatBox"} key={key}>
                        <h4 className={"infoStat"}>{item.value}</h4>
                        <div>
                            <FontAwesomeIcon className={"infoStatIcon"} icon={item.icon}/>
                            <span className={"infoStatLabel"}>{item.label}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TorrentInfo;
