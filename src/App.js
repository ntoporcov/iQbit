import React, {useState, createContext, useEffect} from 'react';
import Tabs from './components/Tabs';
import TabletView from './components/TabletView';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './App.scss';
import { getStorage, saveStorage } from './utils/Storage';
import BottomSheet from "./components/BottomSheet";
import {getPrefs, login} from "./utils/TorrClient";
import {AlertDialog,Button} from "react-onsenui"


export const Context = createContext(null);

const App = () => {

    const [settings,setSettings] = useState({
        loggedin:null,
        username:null,
        password:null
    });

    useEffect(()=>{
        const settings = getStorage("user")
        let templateObject = settings;

        if(settings === null){
            templateObject = {
                loggedin:false,
                username:null,
                password:null
            }
            saveStorage("user",templateObject)
        }else{
            setSettings(settings)
        }
    },[])

    const screenWidth = window.innerWidth;
    const breakpoint = 768;

    const [bigScreen] = useState(screenWidth > breakpoint)
    const installed =  window.matchMedia('(display-mode: standalone)').matches
    const [prefs,setPrefs] = useState({
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
    });


    const updateSettings = (settings) => {
        setSettings(settings);
    }

    const [modal,setModal] = useState({
        open:false,
        content:null
    })

    const updateModal = (update = {open:true,content:<span/>}) => {
        setModal(update)
    }

    useEffect(()=>{

        if(settings.loggedin){
            login({
                username:settings.username,
                password:settings.password
            }).then(()=>{
                getPrefs().then((response)=>{
                    setPrefs(response)
                })
            })
        }

    },[settings,settings.loggedin, settings.password, settings.username])

    const [alert,setAlert] = useState({
        open:false,
        title:null,
        message:null
    })

    const updateAlert = (title,message) => {
        setAlert({open:true,title,message})
    }

    const Alert = (props) =>{
        return(
            <AlertDialog isOpen={props.open} onCancel={()=>setAlert({open: false,title:alert.title,message:alert.message})} cancelable>
                <div className="alert-dialog-title">{props.title}</div>
                <div className="alert-dialog-content">
                    {props.message}
                </div>
                <div className="alert-dialog-footer">
                    <Button onClick={()=>setAlert({open: false,title:alert.title,message:alert.message})} className="alert-dialog-button">
                        Ok
                    </Button>
                </div>
            </AlertDialog>
        )
    }

    return (
        <Context.Provider value={{
            settings,
            updateSettings,
            bigScreen,
            modal,
            updateModal,
            installed,
            updateAlert,
            prefs,
        }}
        >
            <div className={(settings.loggedin ? "loggedin ":" login ") + (installed ? " installed" : "")}>
                {bigScreen ? <TabletView/> : <Tabs/>}
                <BottomSheet  open={modal.open} onDismiss={()=>setModal({open: false})} top={modal.top?modal.top:bigScreen?25:85} children={modal.content}/>
                <Alert open={alert.open} title={alert.title} message={alert.message} />
            </div>
        </Context.Provider>
        );
}

export default App;
