import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({open, handleClose}) {

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Dou you want to stop the call"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Start a new meeting or go back to homepage. Current meeting will be ended and your call history will be saved! 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            handleClose()
            window.location.pathname = "/"
          }}>Back to home</Button>
          <Button onClick={() => {
            handleClose()
            window.location.reload()
          }} autoFocus>
            New call
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
