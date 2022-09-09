import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
    });

    export default function VerificationDialogQuote(props) {
    const { open, setOpen, values, createQuote } = props

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateQuote = () => {
        createQuote();
    };

    return (
        <div>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Are you sure you want to create Opportunity {values.number}?</DialogTitle>
            <DialogActions>
            <Button variant="outlined" color='error' onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateQuote}>Create</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
