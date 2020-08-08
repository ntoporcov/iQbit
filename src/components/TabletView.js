import TorrentsCol from "./TorrentsCol";
import {Icon, Page, Toolbar, ToolbarButton} from "react-onsenui";
import Search from "./Search";
import React, {useContext} from "react";
import { Context } from "../App"
import RoundLogo from "../images/logo_round.png"
import TorrentTopControls from "./TorrentsTopControls";
import Settings from "./Settings";

const TabletView = () => {

    const {settings,updateModal} = useContext(Context)

    return (
        <>
            <Toolbar>
                <div className="left tabletHeader">
                    <div>
                        {settings.loggedin?<img className={"loginImage-small"} alt={"iQbit Logo"} src={RoundLogo}/>:null}
                        <h1>iQbit</h1>
                    </div>
                    {settings.loggedin?
                        <TorrentTopControls/>
                        :null
                    }
                </div>
                <div className="right">
                    <ToolbarButton
                        onClick={()=>updateModal({
                            open:true,
                            content:<Settings/>,
                        })}
                    >
                        <Icon size={35} icon="ion-ios-cog" />
                    </ToolbarButton>
                </div>
            </Toolbar>
            <Page>
                <div className="tabletView">
                    <TorrentsCol/>
                    <Search/>
                </div>
            </Page>
        </>
    )
}

export default TabletView;
