import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function CustomerDialog(props) {
    const { customerId , open, setOpen } = props

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
            Open form dialog
        </Button> */}
        <Dialog 
            fullScreen
            open={open} 
            onClose={handleClose}
        >
            <DialogTitle>Edit Customer {customerId}</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                // variant="standard"
            />
            </DialogContent>
            <DialogActions>
            <Button variant='outlined' onClick={handleClose}>Cancel</Button>
            <Button variant='contained' onClick={handleClose}>Update</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
    }
