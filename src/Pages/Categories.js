import React, { useContext, useEffect, useRef, useState } from "react";
import {
  editCategory,
  getCategories,
  removeCategories,
  updatePref,
} from "../utils/TorrClient";
import { Context } from "../App";
import { AlertDialog, AlertDialogButton, Button } from "react-onsenui";

const Categories = (props) => {
  const { contextCategories, refreshCategories } = useContext(Context);

  const [confirmAlert, setConfirmAlert] = useState({ open: false, name: "" });
  const [editAlert, setEditAlert] = useState({ open: false, name: "" });
  let alertInput = useRef();

  return (
    <div className={"categoryCol"}>
      {Object.keys(contextCategories).map((item, key) => (
        <div className={"categoryBox"} key={key}>
          <div className={"infoRow"}>
            <h3 className={"title"}>{contextCategories[item].name}</h3>
            <span className={"path"}>{contextCategories[item].savePath}</span>
          </div>
          <div className={"actionRow"}>
            <button
              onClick={() =>
                setEditAlert({
                  open: true,
                  name: contextCategories[item].name,
                  path: contextCategories[item].savePath,
                })
              }
            >
              Edit
            </button>
            <button
              className={"danger"}
              onClick={() =>
                setConfirmAlert({
                  open: true,
                  name: contextCategories[item].name,
                })
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {confirmAlert.open && (
        <AlertDialog
          isOpen={confirmAlert.open}
          onCancel={() => setConfirmAlert({ open: false, name: "", path: "" })}
          cancelable
        >
          <div className="alert-dialog-title">Delete {confirmAlert.name}</div>
          <div className="alert-dialog-content">
            Are you sure you want to delete this category?
          </div>
          <div className="alert-dialog-footer">
            <AlertDialogButton
              onClick={async () => {
                await removeCategories(confirmAlert.name);
                refreshCategories();
                setConfirmAlert({ open: false, name: "" });
              }}
              class={"danger"}
            >
              Yes, Delete Category
            </AlertDialogButton>

            <AlertDialogButton
              onClick={() => setConfirmAlert({ open: false, name: "" })}
            >
              Cancel
            </AlertDialogButton>
          </div>
        </AlertDialog>
      )}
      {editAlert.open && (
        <AlertDialog
          className={"settingsAlert"}
          isOpen={editAlert.open}
          onCancel={() => setEditAlert({ ...editAlert, open: false })}
          modifier={"rowfooter"}
          cancelable
        >
          <div className="alert-dialog-title">Edit {editAlert.name}</div>
          <div className="alert-dialog-content">
            <input
              ref={alertInput}
              type={"text"}
              defaultValue={editAlert.path}
              placeholder={"Enter " + alert.label}
            />
          </div>
          <div className="alert-dialog-footer">
            <Button
              onClick={() => setEditAlert({ ...editAlert, open: false })}
              className="alert-dialog-button"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const newPath = alertInput.current.value;
                await editCategory(editAlert.name, newPath);
                refreshCategories();
                setEditAlert({ ...editAlert, open: false });
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

export default Categories;
