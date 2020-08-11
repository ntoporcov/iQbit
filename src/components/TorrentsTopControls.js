import {Icon, ToolbarButton, Popover,Button} from "react-onsenui";
import React, {useContext, useState} from "react";
import {addTorrent} from "../utils/TorrClient";
import {Context} from "../App";


const TorrentTopControls = () =>{
    const [addTorrentPopover,setAddTorrentPopover] = useState({
        open:false,
        target:null
    })

    const {bigScreen,updateModal,updateAlert} = useContext(Context)

    let AddButton = React.createRef()

    const [torrentURL,setTorrentURL] = useState(null)

    const handleAddTorrent = () =>{
        addTorrent(torrentURL)
        .then(response=>{
            console.log(response.data)
            if(response.data==="Ok."){
                updateAlert("Torrent Was Added","This torrent was added successfully.")
            }else{
                updateAlert("Could Not Add Torrent","This address could not be added.")
            }
        }).catch(()=>{
            updateAlert("Could Not Add Torrent","This address could not be added.")
        }).finally(()=>{
            setAddTorrentPopover({open: false,target: addTorrentPopover.target})
        })
    }


    const AddTorrentModal = () =>{
        return (
            <div className={"modalAddTorrent"}>
                <h2>Enter Torrent URL</h2>
                <textarea onChange={(event => setTorrentURL(event.target.value))} placeholder={"URLs or Magnet links"} rows={10}/>
                <Button
                    modifier={"large--quiet"}
                    onClick={()=>handleAddTorrent()}
                >Add Torrent</Button>
            </div>
        )
    }


    const handleButtonClick= () =>{
        if(bigScreen){
            setAddTorrentPopover({open: true,target:AddButton.current})
        }else{
            updateModal({
                open:true,
                content:<AddTorrentModal/>,
                top:window.innerHeight/2,
            })
        }
    }

    return(
        <div>
            <ToolbarButton>
                <Icon size={30} icon="ion-ios-list" />
            </ToolbarButton>
            <ToolbarButton
                ref={AddButton}
                onClick={()=>handleButtonClick()}
            >
                <Icon size={35} icon="ion-ios-add" />
            </ToolbarButton>
            <Popover
                isOpen={addTorrentPopover.open}
                onCancel={() => setAddTorrentPopover({open:false,target:addTorrentPopover.target})}
                getTarget={() => addTorrentPopover.target}

            >
                <p>Enter Torrent URL</p>
                <textarea onChange={(event => setTorrentURL(event.target.value))} placeholder={"URLs or Magnet links"} rows={10}/>
                <Button
                    modifier={"large--quiet"}
                    onClick={()=>handleAddTorrent()}
                >Add Torrent</Button>
            </Popover>
        </div>
    )
}

export default TorrentTopControls;
