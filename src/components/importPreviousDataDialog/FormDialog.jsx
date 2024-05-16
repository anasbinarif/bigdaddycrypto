import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useAtom} from "jotai/index";
import {sessionAtom} from "@/app/stores/sessionStore";

const FormDialog = () => {
    const [open, setOpen] = useState(false);
    const [sessionJotai] = useAtom(sessionAtom);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const { Name, EditPIN } = formJson;
        const userID = sessionJotai?.user.id

        try {
            const response = await fetch('/api/importPastUserData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Name, EditPIN, userID })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Data imported successfully', data.userPortfolios);
                handleClose(); // Close dialog only on successful operation
            } else {
                throw new Error('Failed to import data');
            }
        } catch (error) {
            console.error('Error importing data:', error);
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Import Your Previous Data
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleFormSubmit,
                }}
            >
                <DialogTitle>Import User Data</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To import your data from our previous application, please enter your username and password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="Name"
                        name="Name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="EditPIN"
                        name="EditPIN"
                        label="Pin"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Import</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FormDialog;
