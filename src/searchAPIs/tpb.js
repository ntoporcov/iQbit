import {Fab, Icon, Button, SearchInput} from "react-onsenui";
import React, {useContext, useState} from "react";
import {IonSpinner} from "@ionic/react";
import axios from "axios";
import imageMissing from "../images/imagemissing.png"
import {Context} from "../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {addTorrent} from "../utils/TorrClient";
import {
  faBox,
  faFilmCanister,
  faMedal,
  faTv,
  faUserAstronaut,
  faUsersClass,
  faComments, faStopwatch, faFilm
  ,faFolderDownload,
  faUserCowboy
} from "@fortawesome/pro-regular-svg-icons";


const TPBSearch = (props) => {
  const {updateModal} = useContext(Context)
  const [searchTerm,setSearchTerm] = useState(undefined)
  const [searchLoading,setSearchLoading] = useState(false)
  const [searchResults,setSearchResults] = useState([])
  const [searchReady,setSearchReady] = useState(false);
  const [downloadsStarted,setDownloadsStarted] = useState([])
  const {updateAlert} = useContext(Context)

  const submitQuery = () => {
    setSearchLoading(true);
    axios.get("https://cors-container.herokuapp.com/https://apibay.org/q.php",{
      params:{
        q:searchTerm,
        cat:props.category
      }
    }).then(response => {
      const results = response.data
      console.log(results);
      setSearchResults(results);
      setSearchLoading(false);
      setSearchReady(true);
    })
  }

  const TorrentAttr = (props) => {
    return (
      <span className={"infoTorrentAttr"}>
                <FontAwesomeIcon className={"infoStatIcon"} icon={props.icon} style={{marginRight:props.letter?2:null}}/>
        {props.letter?<span className={"infoStatIcon"}>{props.letter}</span>:null}
        <span>{props.value}</span>
            </span>
    )
  }

  const handleDownload = ({torrent, title, key}) =>{

    addTorrent(encodeURI(`magnet:?xt=urn:btih:${torrent.info_hash}&dn=${title}&udp://open.demonii.com:1337/announce&udp://tracker.openbittorrent.com:80&udp://tracker.coppersurfer.tk:6969&udp://glotorrents.pw:6969/announce&udp://tracker.opentrackr.org:1337/announce&udp://torrent.gresille.org:80/announce&udp://p4p.arenabg.com:1337&udp://tracker.leechers-paradise.org:6969`))
    .then(response=>{
      if(response.data === "Ok."){
        setDownloadsStarted([...downloadsStarted, key])
      }else{
        updateAlert("Could Not Add Torrent","This address could not be added.")
      }
    })
  };

  return (
    <div>
      <div className={"searchInputRow"}>
        <SearchInput
          className={"searchInput"}
          style={{height:"100%"}}
          placeholder={`Search ${props.category}`}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key==="Enter"? submitQuery(searchTerm) : null}
        />
        {
          searchLoading ? <IonSpinner name={"lines"}/> :
            <Fab modifier={"mini"} onClick={()=>submitQuery(searchTerm)}>
              <Icon icon={"ion-ios-search"} size={25} />
            </Fab>
        }
      </div>
      <div className={"searchResults tpb"}>
        {
          searchReady?
            searchResults ?
              searchResults.map((item,key) =>
                <div className={"infoStatsRow"} key={key}>
                  <div className={"infoStatBox flex-row w100"}>
                    <div className={"attrBox"}>
                      <h3>{item.name}</h3>
                      <TorrentAttr icon={faUserAstronaut} value={item.seeders} letter={"S"}/>
                      <TorrentAttr icon={faUserCowboy} value={item.leechers} letter={"L"}/>
                    </div>
                    {
                      downloadsStarted.includes(key) ?
                        <FontAwesomeIcon className={"downloadStarted"} icon={faFolderDownload}/>
                        :
                        <Button class={"downloadBtn"}
                                onClick={() => handleDownload({torrent:item,title:item.name, key})}
                        >
                          Download
                        </Button>

                    }
                  </div>
                </div>

              )
              :<div>No results were found for that search</div>
            :null
        }
      </div>
    </div>
  )
}

export default TPBSearch;
