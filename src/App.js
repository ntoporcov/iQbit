import React,{useState ,createContext} from 'react';
import Tabs from './components/Tabs';
import TabletView from './components/TabletView';

import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './App.scss';
import { getStorage, saveStorage } from './utils/Storage';
import BottomSheet from "./components/BottomSheet";

const StoredUser = getStorage("user")
let templateObject = StoredUser;

if(StoredUser === null){
    templateObject = {
        loggedin:false,
        username:null,
        password:null
    }
    saveStorage("user",templateObject)
}

const screenWidth = window.innerWidth;
const breakpoint = 768;

export const Context = createContext(null);

const App = () => {
    const [settings,setSettings] = useState(templateObject);
    const [bigScreen] = useState(screenWidth > breakpoint)

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

    return (
        <Context.Provider value={{
            settings,
            updateSettings,
            bigScreen,
            modal,
            updateModal
        }}>
            {bigScreen ? <TabletView/> : <Tabs/>}
            <BottomSheet open={modal.open} onDismiss={()=>setModal({open: false})} top={bigScreen?25:85} children={modal.content}/>
        </Context.Provider>
        );
}

export default App;
