import React, {useContext, useEffect, useRef, useState} from 'react';
import {List, ListItem, ListHeader, Switch, AlertDialog, Button} from "react-onsenui"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faAngleRight,
    faEdit, faEthernet,
    faFolderDownload, faFolderMinus,
    faFolders, faKey,
    faMinusHexagon, faNetworkWired, faOutlet, faPaintBrushAlt,
    faUser, faUserLock, faUserRobot, faUsersClass, faWifi
} from "@fortawesome/pro-solid-svg-icons";
import {getPrefs, updatePref} from "../utils/TorrClient";
import {Context} from "../App";
import {saveStorage} from "../utils/Storage";

const Settings = (props) =>{

    const {settings,updateAlert,prefs} = useContext(Context)
    const [preferences,setPreferences] = useState(prefs)
    const [prefsRefresh,setPrefsRefresh] = useState(true)

    useEffect(()=>{
        if(prefsRefresh){
            getPrefs().then(response=>{
                setPreferences(response.data)
                setPrefsRefresh(false);
            })
        }
    },[prefsRefresh,settings.loggedin,prefs])

    const SwitchRow = (props) =>{
        return(
            <ListItem>
                <div className="center">
                    <div className={"iconBox"} style={{backgroundColor:props.color?props.color:"#636363"}}>
                        <FontAwesomeIcon icon={props.icon}/>
                    </div>
                    {props.title}
                </div>
                <div className="right">
                    <Switch checked={preferences[props.objKey]} onChange={()=>{
                        updatePref(`{"${props.objKey}":${!preferences[props.objKey]}}`).then(()=>{
                            setTimeout(()=>{
                                let updatedObj = {...preferences}
                                updatedObj[props.objKey] = !preferences[props.objKey];
                                setPreferences(updatedObj)
                            },350)
                        }).catch(()=>{
                            setPrefsRefresh(true);
                            updateAlert("Settings Update Failed","Settings could not be updated")
                        })
                    }}/>
                </div>
                SubFolders
            </ListItem>
        )
    }

    const InputRow = (props) =>{
        return(
            <ListItem tappable
                onClick={()=>setAlert({open: true,label: props.title, objKey:props.objKey})}
            >
                <div className="center">
                    <div className={"iconBox"} style={{backgroundColor:props.color?props.color:"#636363"}}>
                        <FontAwesomeIcon icon={props.icon}/>
                    </div>
                    {props.title}
                </div>
                <div className="right">
                    <FontAwesomeIcon icon={faEdit}/>
                </div>
                SubFolders
            </ListItem>
        )
    }

    const [alert,setAlert] = useState({
        open:false,
        label:"",
        objKey:""
    })

    let alertInput = useRef()

    if(settings.loggedin){
        return (
        <div className={"settingsCol"}>
            <List modifier={"inset"}>
                <ListHeader>
                    Downloads
                </ListHeader>
                <SwitchRow
                    title={"Create SubFolders"}
                    icon={faFolders}
                    objKey={"create_subfolder_enabled"}
                    color={"#006ce2"}
                />
                <SwitchRow
                    title={"Start Torrent Paused"}
                    icon={faMinusHexagon}
                    objKey={"start_paused_enabled"}
                    color={"#bf0000"}
                />
            </List>
            <List modifier={"inset"}>
                <ListHeader>
                    Paths
                </ListHeader>
                <InputRow
                    title={"Default Save Path"}
                    icon={faFolderDownload}
                    objKey={"save_path"}
                    color={"#2ca700"}
                />
                <SwitchRow
                    title={"Temp Folder"}
                    icon={faFolderMinus}
                    objKey={"temp_path_enabled"}
                    color={"#5b00b6"}
                />
                <InputRow
                    title={"Default Save Path"}
                    icon={faFolderDownload}
                    objKey={"save_path"}
                    color={"#ea9d00"}
                />
            </List>
            <List modifier={"inset"}>
                <ListHeader>
                    Proxy
                </ListHeader>
                <InputRow
                    title={"Host"}
                    icon={faNetworkWired}
                    objKey={"proxy_ip"}
                    color={"#00a799"}
                />
                <InputRow
                    title={"Port"}
                    icon={faEthernet}
                    objKey={"proxy_port"}
                    color={"#b600a4"}
                />
                <SwitchRow
                    title={"Proxy Peer Connections"}
                    icon={faUsersClass}
                    objKey={"proxy_peer_connections"}
                    color={"#ea9d00"}
                />
                <SwitchRow
                    title={"Proxy Auth Enabled"}
                    icon={faUserLock}
                    objKey={"proxy_auth_enabled"}
                    color={"#b7ea00"}
                />
                <InputRow
                    title={"Proxy Username"}
                    icon={faUserRobot}
                    objKey={"proxy_username"}
                    color={"#ea5200"}
                />
                <InputRow
                    title={"Proxy Password"}
                    icon={faKey}
                    objKey={"proxy_password"}
                    color={"#ea5200"}
                />
            </List>

            <List modifier={"inset"}>
                <ListHeader>
                    WebUI
                </ListHeader>
                <SwitchRow
                    title={"Custom WebUI Enabled"}
                    icon={faPaintBrushAlt}
                    objKey={"alternative_webui_enabled"}
                    color={"#19a700"}
                />
                <InputRow
                    title={"WebUI Path"}
                    icon={faAngleRight}
                    objKey={"alternative_webui_path"}
                    color={"#0086a7"}
                />
                <InputRow
                    title={"WebUI IP Address"}
                    icon={faWifi}
                    objKey={"web_ui_address"}
                    color={"#7a00a7"}
                />
                <InputRow
                    title={"WebUI Port"}
                    icon={faEthernet}
                    objKey={"web_ui_port"}
                    color={"#b60049"}
                />
                <SwitchRow
                    title={"WebUI UPnP Enabled"}
                    icon={faOutlet}
                    objKey={"web_ui_upnp"}
                    color={"#ea9d00"}
                />
                <InputRow
                    title={"WebUI Username"}
                    icon={faUser}
                    objKey={"web_ui_username"}
                    color={"#0069ea"}
                />
                <InputRow
                    title={"WebUI Password"}
                    icon={faKey}
                    objKey={"web_ui_password"}
                    color={"#0069ea"}
                />
            </List>
            <Button className={"danger"} modifier={"large--quiet"}
                onClick={()=> {
                    window.location.reload();
                    saveStorage("user", {})
                }}
            >
                Log Out
            </Button>


            <AlertDialog className={"settingsAlert"} isOpen={alert.open} onCancel={()=>setAlert({open: false})} modifier={"rowfooter"} cancelable>
                <div className="alert-dialog-title">{alert.label}</div>
                <div className="alert-dialog-content">
                    <input ref={alertInput} defaultValue={preferences[alert.objKey]} placeholder={"Enter "+alert.label}/>
                </div>
                <div className="alert-dialog-footer">
                    <Button onClick={()=>setAlert({open: false})} className="alert-dialog-button">
                        Cancel
                    </Button>
                    <Button onClick={()=>{
                        updatePref(`{"${props.objKey}":"${alertInput.current.value}"}`).then(()=>{
                            setTimeout(()=>{
                                setPrefsRefresh(true)
                            },300)
                        })
                    }} className="alert-dialog-button">
                        Save
                    </Button>
                </div>
            </AlertDialog>
        </div>
        )
    }else{
        return (
            <div className={"settingsCol"}>
                <h2 style={{textAlign:"center"}}>
                    Settings require login.
                </h2>
            </div>
        )
    }
}

export default Settings
