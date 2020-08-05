import React from "react";
import {Icon,ProgressBar} from "react-onsenui";
import fileSize from "filesize";
import stateDictionary from './stateDictionary';

const TorrentInfo = (props) => {
    const torrent = props.item;
    const {name} = props.item

    const AmountRow = [
        {
            value: `${fileSize(torrent.downloaded)} / ${fileSize(torrent.size)}`,
            icon: "fa-download",
            label: "Downloaded"
        },
        {
            value: fileSize(torrent.downloaded_session),
            icon: "fa-pallet",
            label: "Downloaded This Session"
        },
        {
            value: fileSize(torrent.uploaded),
            icon: "fa-upload",
            label: "Uploaded"
        },
        {
            value: fileSize(torrent.uploaded_session),
            icon: "fa-pallet",
            label: "Uploaded This Session"
        },
        {
            value: torrent.ratio.toFixed(2),
            icon: "fa-share-alt",
            label: "Share Ratio"
        },
    ]

    const SpeedsRow = [
        {
            value: `${fileSize(torrent.dlspeed)}/s`,
            icon: "fa-tachometer",
            label: "Download Speed"
        },
        {
            value: `${fileSize(torrent.upspeed)}/s`,
            icon: "fa-tachometer",
            label: "Download Speed"
        },
        {
            value: torrent.eta !== 8640000 ?
                torrent.eta.toISOString().substr(11, 8)
                :0
            ,
            icon: "fa-stopwatch",
            label: "Estimate Time Left"
        },
    ]

    const DataRow = [
        {
            value: `${torrent.num_seeds} (${torrent.num_complete})`,
            icon: "fa-user-astronaut",
            label: "Seeds"
        },
        {
            value: `${torrent.num_leechs} (${torrent.num_incomplete})`,
            icon: "fa-user-secret",
            label: "Leechs"
        },
        {
            value: torrent.save_path,
            icon: "fa-folder-open",
            label: "Save Path"
        },
    ]

    const StateRow = [
        {
            value: stateDictionary[torrent.state].short,
            icon: "fa-bolt",
            label: stateDictionary[torrent.state].long
        },
    ]

    const StatsRow = (props) => {
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
                                <Icon className={"infoStatIcon"} icon={item.icon} size={20}/>
                                <span className={"infoStatLabel"}>{item.label}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return(
        <div className={"torrentInfoCol"}>
            <div className={"stickyRow"}>
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

export default TorrentInfo;
