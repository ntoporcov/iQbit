import {Button, Icon, List, ListItem, Popover, Radio, ToolbarButton} from "react-onsenui";
import React, {useContext, useState} from "react";
import {addTorrent} from "../utils/TorrClient";
import {Context} from "../App";


const TorrentTopControls = (props) => {
    const [addTorrentPopover, setAddTorrentPopover] = useState({
        open: false,
        target: null
    })

    const {settings, bigScreen, updateModal, updateAlert} = useContext(Context)

    let AddButton = React.createRef()
    let SortButton = React.createRef()

    const [torrentURL, setTorrentURL] = useState(null)

    const handleAddTorrent = () => {
        addTorrent(torrentURL)
            .then(response => {
                console.log(response.data)
                if (response.data === "Ok.") {
                    updateAlert("Torrent Was Added", "This torrent was added successfully.")
                } else {
                    updateAlert("Could Not Add Torrent", "This address could not be added.")
                }
            }).catch(() => {
            updateAlert("Could Not Add Torrent", "This address could not be added.")
        }).finally(() => {
            setAddTorrentPopover({open: false, target: addTorrentPopover.target})
        })
    }


    const AddTorrentModal = () => {
        return (
            <div className={"modalAddTorrent"}>
                <h2>Enter Torrent URL</h2>
                <textarea onChange={(event => setTorrentURL(event.target.value))} placeholder={"URLs or Magnet links"}
                          rows={10}/>
                <Button
                    modifier={"large--quiet"}
                    onClick={() => handleAddTorrent()}
                >Add Torrent</Button>
            </div>
        )
    }


    const showAddPopover = () => {
        if (bigScreen) {
            setAddTorrentPopover({open: true, target: AddButton.current})
        } else {
            updateModal({
                open: true,
                content: <AddTorrentModal/>,
                top: window.innerHeight / 2,
            })
        }
    }

    const [sortPopover, setSortPopover] = useState({open: false, selected: 0})

    const showSortPopover = () => {
        setSortPopover({open: true, selected: sortPopover.selected})
    }

    const SortingOptions = [
        {
            object: {
                key: "added_on",
                reverse: true
            },
            label: "Added Latest Up Top",
        },
        {
            object: {
                key: "added_on",
                reverse: false
            },
            label: "Added Oldest Up Top",
        },
        {
            object: {
                key: "name",
                reverse: false
            },
            label: "Abc... Up Top",
        },
        {
            object: {
                key: "name",
                reverse: true
            },
            label: "Zxy... Up Top",
        },
    ]

    const updateSorting = (object, key) => {
        setSortPopover({open: false, selected: key})
        props.updateSorting(object)
    }

    return (
        <div>
            <ToolbarButton
                ref={SortButton}
                onClick={() => showSortPopover()}
            >
                <Icon size={30} icon="ion-ios-list"/>
            </ToolbarButton>
            <ToolbarButton
                ref={AddButton}
                onClick={() => showAddPopover()}
            >
                <Icon size={35} icon="ion-ios-add"/>
            </ToolbarButton>

            <Popover
                isOpen={addTorrentPopover.open}
                onCancel={() => setAddTorrentPopover({open: false, target: addTorrentPopover.target})}
                getTarget={() => addTorrentPopover.target}
                className={"AddTorrentPopover"}
            >
                <p>Enter Torrent URL</p>
                <textarea onChange={(event => setTorrentURL(event.target.value))} placeholder={"URLs or Magnet links"}
                          rows={10}/>
                <Button
                    modifier={"large--quiet"}
                    onClick={() => handleAddTorrent()}
                >Add Torrent</Button>
            </Popover>

            <Popover
                isOpen={sortPopover.open}
                onCancel={() => setSortPopover({open: false, selected: sortPopover.selected})}
                getTarget={() => SortButton.current}
                className={"SortTorrentPopover"}
            >
                <List>
                    {
                        SortingOptions.map((option, key) =>
                            <ListItem
                                modifier={"longdivider"}
                                key={key}
                                onClick={() => updateSorting(option.object, key)}
                            >
                                <div>
                                    <Radio name="color" checked={key === sortPopover.selected}/>
                                    {option.label}
                                </div>
                            </ListItem>
                        )
                    }
                </List>
            </Popover>
        </div>
    )
}

export default TorrentTopControls;
