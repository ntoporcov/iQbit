import React, {useState,useContext} from 'react';
import {Button, ActionSheet, ActionSheetButton, AlertDialog, AlertDialogButton} from 'react-onsenui'; // Only import the necessary components
import {sync, login, remove } from '../utils/TorrClient';
import TorrentBox from './TorrentBox';
import { Context } from "../App"
import { saveStorage } from '../utils/Storage';
import LogoHeader from "./LogoHeader";
import TorrentInfo from "./TorrentInfo"
import useInterval from "../utils/useInterval";

const Torrents = (props) =>{
  const {settings,updateSettings,installed, updateModal} = useContext(Context);

  const [feedback, setFeedback] = useState(null)
  const [username,setUsername] = useState(undefined)
  const [password,setPassword] = useState(undefined)
  const [torrentAction, setTorrentAction] = useState({
    open: false,
    options: [{
        label: "More Info",
        modifier: null,
        onclick: () => false,
      },
      {
        label: "Remove Torrent",
        modifier: "destructive",
        onclick: () => false,
      },
    ]
  })
  const [deleteAlert, setDeleteAlert] = useState({
    open:false,
    hash:undefined,
  })
  const [torrentList,setTorrentList] = useState([])
  const [torrentData,setTorrentData] = useState({})


  const [RID,setRID] = useState(0)

  useInterval(()=>{
      if(settings.loggedin){
          sync(RID).then(resp => {
              const {data} = resp

              if(data.full_update){
                setTorrentData(data.torrents);
                setTorrentList(Object.keys(data.torrents));
              }
              else{

                if(data.torrents){
                  let updatedObj = torrentData;

                  const keysArray = Object.keys(data.torrents);

                  keysArray.forEach((hash) => {

                      if(updatedObj[hash]===undefined){
                          updatedObj[hash]={};
                      }

                      const properties = Object.keys(data.torrents[hash]);

                      properties.forEach((property)=>{
                        updatedObj[hash][property] = data.torrents[hash][property]
                      })
                   })

                  setTorrentData(updatedObj);
                }

              }

              setRID(RID+1)
          });
      }
  },1000)

  const handleSignin = () => {

    login({username,password}).then(response => {

      if(response.data==="Ok."){

        const userObject = {
          username,
          password,
          loggedin:true,
        };

        saveStorage("user", userObject).then(() => {
          updateSettings(userObject)
        })

      }else{
        setFeedback("Login Unauthorized.")
      }

    }).catch(() => {
      setFeedback("Too many login attempts. This IP is temporarily blocked. You can restart qBitTorrent to reset this.")
    })
  }

  const LoginForm = () => {
    return (
      <div className={"torrentBox login"}>
        <LogoHeader/>
        <h2 className="centered">Welcome To Your WebUI</h2>
        <div className="inputGroup">
          <label htmlFor="username-input">
            <span>Username</span>
            <input
                id="username-input"
                type="text"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
            />
          </label>
          <label htmlFor="password-input">
            <span>Password</span>
            <input
                id="password-input"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"/>
          </label>
        </div>
        {feedback?<p className="feedback">{feedback}</p>:null}
        <Button modifier="large--quiet" onClick={()=>handleSignin()}>
          Sign In
        </Button>
      </div>
    )
  }

  const handleMoreButton = (hash,item) =>{
    setTorrentAction({
      open: true,
      options: [
        {
          label: "Remove Torrent",
          modifier: "destructive",
          onclick: () => setDeleteAlert({open:true,hash}),
        },
        {
          label: "More Info",
          modifier: null,
          onclick: () => updateModal({open: true,content:<TorrentInfo item={item} hash={hash} /> }),
        },
      ]
    })
  }

  return (
      <>

        {
          settings.loggedin?
              torrentList.map((hash) =>
            <TorrentBox
                item={torrentData[hash]}
                fullData={torrentData}
                key={hash}
                hash = {hash}
                filter={props.segment}
                openAction={(hash,item) => handleMoreButton(hash,item)}
            />)
            :null
        }

        {settings.loggedin? null : LoginForm()}

        {/*More info Action Sheet*/}
        <ActionSheet
            className={installed?"installed":null}
            isOpen={torrentAction.open}
            isCancelable={true}
            onCancel={()=>setTorrentAction({open:false,options: torrentAction.options})}
        >
          {
            torrentAction.options.map((option,key) =>
              <ActionSheetButton
                  key={key}
                  modifier={option.modifier}
                  onClick={()=> {
                    setTorrentAction({open: false,options: torrentAction.options})
                    option.onclick()
                  }}
              >{option.label}</ActionSheetButton>)
          }

          <ActionSheetButton
              onClick={()=>
                  setTorrentAction({
                    open:false,
                    options: torrentAction.options
                  })
              }>Cancel
          </ActionSheetButton>
        </ActionSheet>

        {/*Alert Dialog Before Deleting Files*/}
        <AlertDialog
            isOpen={deleteAlert.open}
            onCancel={()=>setDeleteAlert({open: false})}
            cancelable
        >
          <div className="alert-dialog-title">Delete Files</div>
          <div className="alert-dialog-content">
            Would you also like to delete the files downloaded?
          </div>
          <div className="alert-dialog-footer">

            <AlertDialogButton
                onClick={()=> {
                  setDeleteAlert({open: false});
                  remove(deleteAlert.hash, true);
                }}
                className={"danger"}
            >
              Yes, Delete Files
            </AlertDialogButton>

            <AlertDialogButton
                onClick={()=> {
                  setDeleteAlert({open: false});
                  remove(deleteAlert.hash, false);
                }}
            >
              No, Keep Files
            </AlertDialogButton>

            <AlertDialogButton onClick={()=>setDeleteAlert({open: false})}>Cancel</AlertDialogButton>
          </div>
        </AlertDialog>
      </>
  )
}

export default Torrents
