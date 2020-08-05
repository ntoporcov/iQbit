import Torrents from "./Torrents";
import {Icon, Page, Toolbar, ToolbarButton} from "react-onsenui";
import Search from "./Search";
import React, {useContext, useState} from "react";
import { Context } from "../App"
import RoundLogo from "../images/logo_round.png"

const TabletView = () => {

    const LocalContext = useContext(Context)

    return (
        <>
            <Toolbar style={{alignItems:"flex-end"}}>
                <div className="left" style={{alignItems:"center"}}>
                    <img className={"loginImage-small"} alt={"iQbit Logo"} src={RoundLogo}/>
                    <h1>iQbit</h1>
                </div>
                <div className="right">
                    <ToolbarButton>
                        <Icon size={35} icon="ion-ios-cog" />
                    </ToolbarButton>
                </div>
            </Toolbar>
            <Page>
                <div className="tabletView">
                    <Torrents/>
                    <Search/>
                </div>
            </Page>
        </>
    )
}

export default TabletView;
