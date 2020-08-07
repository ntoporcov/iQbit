import Torrents from "./Torrents";
import {Icon, Page, Tab, Tabbar, Toolbar, ToolbarButton} from "react-onsenui";
import Search from "./Search";
import Settings from "./Settings";
import React, {useContext, useEffect, useState} from "react";
import {Context} from "../App"
import TorrentTopControls from "./TorrentsTopControls";

const Tabs = () => {
    const [activeTab,setActiveTab] = useState(0)

    const pageTitles = [
        "Your Torrents",
        "Search",
        "Settings"
    ]

    const {settings,bigScreen} = useContext(Context);
    const [loggedin,setLoggedin] = useState(settings.loggedin)

    useEffect(()=>{
        setLoggedin(settings)
    },[settings])

    return (
        <>
            <Toolbar>
                <div className="left">
                    <h1>
                        {pageTitles[activeTab]}
                    </h1>
                </div>
                <div className="right">
                    {settings.loggedin && !bigScreen && activeTab===0?
                        <TorrentTopControls/>
                        :null
                    }
                </div>
            </Toolbar>
            <Tabbar
                className={"tabWrapper"}
                position='bottom'
                onPreChange={({index}) => setActiveTab(index)}
                index={activeTab}
                renderTabs={(activeIndex) => [
                    {
                        content: <Page><Torrents title={pageTitles[0]} active={activeIndex === 0}/></Page>,
                        tab: <Tab label="Torrents" icon="ion-ios-download"/>
                    },
                    {
                        content: <Page><Search title={pageTitles[1]} active={activeIndex === 1}/></Page>,
                        tab: <Tab label="Search" icon="ion-ios-search"/>
                    },
                    {
                        content: <Page><Settings title={pageTitles[2]} active={activeIndex === 1}/></Page>,
                        tab: <Tab label="Settings" icon="ion-ios-cog"/>
                    },
                ]
                }
            />
        </>
    )
}

export default Tabs;
