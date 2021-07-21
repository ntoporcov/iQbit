import {
  Button,
  Icon,
  List,
  ListItem,
  Popover,
  Radio,
  ToolbarButton,
} from "react-onsenui";
import React, { useContext, useState } from "react";

const CategoriesTopControls = (props) => {
  const [addCategory, setAddCategory] = useState({
    open: false,
    target: null,
  });

  let AddButton = React.createRef();

  return (
    <div>
      <ToolbarButton ref={AddButton}>
        <Icon size={35} icon="ion-ios-add" />
      </ToolbarButton>

      {/*<Popover*/}
      {/*    isOpen={addTorrentPopover.open}*/}
      {/*    onCancel={() => setAddTorrentPopover({open: false, target: addTorrentPopover.target})}*/}
      {/*    getTarget={() => addTorrentPopover.target}*/}
      {/*    className={"AddTorrentPopover"}*/}
      {/*>*/}
      {/*    <p>Enter Torrent URL</p>*/}
      {/*    <textarea onChange={(event => setTorrentURL(event.target.value))} placeholder={"URLs or Magnet links"}*/}
      {/*              rows={10}/>*/}
      {/*    <Button*/}
      {/*        modifier={"large--quiet"}*/}
      {/*        onClick={() => handleAddTorrent()}*/}
      {/*    >Add Torrent</Button>*/}
      {/*</Popover>*/}
    </div>
  );
};

export default CategoriesTopControls;
