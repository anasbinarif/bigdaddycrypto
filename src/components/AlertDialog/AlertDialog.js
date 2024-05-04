import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';

const DeleteConfirmationDialog = ({ open, handleClose, handleDeleteConfirm, asset }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
        >
            <DialogTitle id="delete-dialog-title">Delete Asset</DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    Are you sure you want to delete the asset <strong>{asset?.Ticker}</strong> from your Portfolio?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeleteConfirm} autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
