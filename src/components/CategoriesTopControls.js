import {
  AlertDialog,
  Button,
  Icon,
  List,
  ListItem,
  Popover,
  Radio,
  ToolbarButton,
} from "react-onsenui";
import React, { useContext, useRef, useState } from "react";
import { addCategory, editCategory } from "../utils/TorrClient";
import { Context } from "../App";

const CategoriesTopControls = (props) => {
  const { refreshCategories } = useContext(Context);
  const [addAlertOpen, setAddAlertOpen] = useState(false);

  const categoryName = useRef();
  const path = useRef();

  return (
    <div>
      <ToolbarButton onClick={() => setAddAlertOpen(true)}>
        <Icon size={35} icon="ion-ios-add" />
      </ToolbarButton>

      {addAlertOpen && (
        <AlertDialog
          className={"settingsAlert"}
          isOpen={addAlertOpen}
          onCancel={() => setAddAlertOpen(false)}
          modifier={"rowfooter"}
          cancelable
        >
          <div className="alert-dialog-title">Add Category</div>
          <div className="alert-dialog-content">
            <label>
              <span>Category Name</span>
              <input
                ref={categoryName}
                type={"text"}
                placeholder={"Very Cool Category Name"}
              />
            </label>
            <label>
              <span>Category Path</span>
              <input
                ref={path}
                type={"text"}
                placeholder={"/some/valid/path"}
              />
            </label>
          </div>
          <div className="alert-dialog-footer">
            <Button
              onClick={() => setAddAlertOpen(false)}
              className="alert-dialog-button"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const newPath = path.current.value;
                const newName = categoryName.current.value;
                await addCategory(newName, newPath);
                setAddAlertOpen(false);
                refreshCategories();
              }}
              className="alert-dialog-button"
            >
              Save
            </Button>
          </div>
        </AlertDialog>
      )}
    </div>
  );
};

export default CategoriesTopControls;
