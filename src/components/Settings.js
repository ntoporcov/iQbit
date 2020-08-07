import React, {useContext, useEffect, useRef, useState} from 'react';
import {List, ListItem, ListHeader, Switch, AlertDialog, Button} from "react-onsenui"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faAngleRight, faDoorOpen,
    faDownload,
    faEdit, faEthernet,
    faFolderDownload, faFolderMinus,
    faFolders, faFolderTree, faKey,
    faMinusHexagon, faNetworkWired, faOutlet, faPaintBrushAlt,
    faStop, faUser, faUserLock, faUserNinja, faUserRobot, faUsersClass, faWifi
} from "@fortawesome/pro-solid-svg-icons";
import {getPrefs, updatePref} from "../utils/TorrClient";
import {Context} from "../App";
import {saveStorage} from "../utils/Storage";

const Settings = (props) =>{

    const [preferences,setPreferences] = useState({
        add_trackers: "",
        add_trackers_enabled: null,
        alt_dl_limit: null,
        alt_up_limit: null,
        alternative_webui_enabled: null,
        alternative_webui_path: "",
        announce_ip: "",
        announce_to_all_tiers: null,
        announce_to_all_trackers: null,
        anonymous_mode: null,
        async_io_threads: null,
        auto_delete_mode: null,
        auto_tmm_enabled: null,
        autorun_enabled: null,
        autorun_program: "",
        banned_IPs: "",
        bittorrent_protocol: null,
        bypass_auth_subnet_whitelist: "",
        bypass_auth_subnet_whitelist_enabled: null,
        bypass_local_auth: null,
        category_changed_tmm_enabled: null,
        checking_memory_use: null,
        create_subfolder_enabled: null,
        current_interface_address: "",
        current_network_interface: "",
        dht: null,
        disk_cache: null,
        disk_cache_ttl: null,
        dl_limit: null,
        dont_count_slow_torrents: null,
        dyndns_domain: "",
        dyndns_enabled: false,
        dyndns_password: "",
        dyndns_service: null,
        dyndns_username: "",
        embedded_tracker_port: null,
        enable_coalesce_read_write: null,
        enable_embedded_tracker: null,
        enable_multi_connections_from_same_ip: null,
        enable_os_cache: null,
        enable_piece_extent_affinity: null,
        enable_upload_suggestions: null,
        encryption: null,
        export_dir: "",
        export_dir_fin: "",
        file_pool_size: null,
        incomplete_files_ext: null,
        ip_filter_enabled: null,
        ip_filter_path: "",
        ip_filter_trackers: null,
        limit_lan_peers: null,
        limit_tcp_overhead: null,
        limit_utp_rate: null,
        listen_port: null,
        locale: "",
        lsd: null,
        mail_notification_auth_enabled: null,
        mail_notification_email: "",
        mail_notification_enabled: null,
        mail_notification_password: "",
        mail_notification_sender: "",
        mail_notification_smtp: "",
        mail_notification_ssl_enabled: false,
        mail_notification_username: "",
        max_active_downloads: null,
        max_active_torrents: null,
        max_active_uploads: null,
        max_connec: null,
        max_connec_per_torrent: null,
        max_ratio: null,
        max_ratio_act: null,
        max_ratio_enabled: null,
        max_seeding_time: null,
        max_seeding_time_enabled: null,
        max_uploads: null,
        max_uploads_per_torrent: null,
        outgoing_ports_max: null,
        outgoing_ports_min: null,
        pex: null,
        preallocate_all: null,
        proxy_auth_enabled: null,
        proxy_ip: "",
        proxy_password: "",
        proxy_peer_connections: null,
        proxy_port: null,
        proxy_torrents_only: null,
        proxy_type: null,
        proxy_username: "",
        queueing_enabled: null,
        random_port: null,
        recheck_completed_torrents: null,
        resolve_peer_countries: null,
        rss_auto_downloading_enabled:null,
        rss_download_repack_proper_episodes:null,
        rss_max_articles_per_feed:null,
        rss_processing_enabled:null,
        rss_refresh_interval:null,
        rss_smart_episode_filters:"",
        save_path: "",
        save_path_changed_tmm_enabled: false,
        save_resume_data_interval: null,
        scan_dirs:{},
        schedule_from_hour: null,
        schedule_from_min: null,
        schedule_to_hour: null,
        schedule_to_min: null,
        scheduler_days: null,
        scheduler_enabled: false,
        send_buffer_low_watermark: null,
        send_buffer_watermark: null,
        send_buffer_watermark_factor: null,
        slow_torrent_dl_rate_threshold: null,
        slow_torrent_inactive_timer: null,
        slow_torrent_ul_rate_threshold: null,
        socket_backlog_size: null,
        start_paused_enabled: false,
        stop_tracker_timeout: null,
        temp_path: "",
        temp_path_enabled: null,
        torrent_changed_tmm_enabled: null,
        up_limit: null,
        upload_choking_algorithm: null,
        upload_slots_behavior: null,
        upnp: null,
        use_https: null,
        utp_tcp_mixed_mode: null,
        web_ui_address: "",
        web_ui_ban_duration: null,
        web_ui_clickjacking_protection_enabled: null,
        web_ui_csrf_protection_enabled: null,
        web_ui_custom_http_headers: "",
        web_ui_domain_list: "",
        web_ui_host_header_validation_enabled: null,
        web_ui_https_cert_path: "",
        web_ui_https_key_path: "",
        web_ui_max_auth_fail_count: null,
        web_ui_port: null,
        web_ui_secure_cookie_enabled: null,
        web_ui_session_timeout: null,
        web_ui_upnp: null,
        web_ui_use_custom_http_headers_enabled: null,
        web_ui_username: ""
    })

    const [prefsRefresh,setPrefsRefresh] = useState(true)

    const {settings,initialLogin,updateAlert} = useContext(Context)

    useEffect(()=>{
        if(prefsRefresh){
            getPrefs().then(response=>{
                setPreferences(response.data)
                setPrefsRefresh(false);
            })
        }
    },[initialLogin,prefsRefresh])

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
                    {console.log(preferences[props.objKey])}
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
                    <input ref={alertInput} value={preferences[alert.objKey]} onChange={()=>console.log(alertInput)} placeholder={"Enter "+alert.label}/>
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
