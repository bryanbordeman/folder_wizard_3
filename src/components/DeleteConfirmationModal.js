import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteConfirmationModal(props) {

    const { deleteAction, message , openDelete, setOpenDelete  } = props

    const handleClose = () => {
        setOpenDelete(false);
    };

    const handleDelete = () => {
        deleteAction();
        setOpenDelete(false);
    };

    return (
        <div>
        <Dialog
            open={openDelete}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            <Alert severity="error">{message.title}</Alert>
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {message.content}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button variant='outlined' onClick={handleClose}>Close</Button>
            <Button color='error' variant="contained" onClick={handleDelete} startIcon={<DeleteIcon />}>
                Delete
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
    }
