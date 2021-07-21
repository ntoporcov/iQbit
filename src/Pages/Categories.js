import React, { useContext, useEffect, useState } from "react";
import { getCategories, removeCategories } from "../utils/TorrClient";
import { Context } from "../App";
import { AlertDialog, AlertDialogButton } from "react-onsenui";

const Categories = (props) => {
  const { contextCategories } = useContext(Context);

  const [categories, setCategories] = useState(contextCategories);
  const [categoryRefresh, setCategoryRefresh] = useState(contextCategories);

  useEffect(() => {
    if (categoryRefresh) {
      getCategories().then((response) => {
        setCategories(response.data);
        setCategoryRefresh(false);
      });
    }

    if (contextCategories !== categories) {
      setCategories(categories);
    }
  }, [contextCategories, categories, categoryRefresh]);

  const [confirmAlert, setConfirmAlert] = useState({ open: false, name: "" });

  return (
    <div className={"categoryCol"}>
      {Object.keys(categories).map((item, key) => (
        <div className={"categoryBox"} key={key}>
          <h3 className={"title"}>{categories[item].name}</h3>
          <div className={"actionRow"}>
            <button>Edit</button>
            <button
              className={"danger"}
              onClick={() =>
                setConfirmAlert({ open: true, name: categories[item].name })
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {confirmAlert && (
        <AlertDialog
          isOpen={confirmAlert.open}
          onCancel={() => confirmAlert({ open: false, name: "" })}
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
                setCategoryRefresh(true);
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
    </div>
  );
};

export default Categories;
