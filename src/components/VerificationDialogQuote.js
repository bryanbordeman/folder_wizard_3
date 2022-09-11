import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Transition from './DialogTransistion'
import  Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ManagerPicker from './ManagerPicker';

export default function VerificationDialogQuote(props) {
    const { open, setOpen, values, createQuote } = props
    const [ task, setTask ] = React.useState('');
    const [ isCreateTask, setIsCreateTask ] = React.useState(true);

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
            <DialogTitle>Create Opportunity {values.number}?</DialogTitle>
            <DialogContent>
                <FormControlLabel
                    onChange={() => {setIsCreateTask(!isCreateTask)}}
                    control={<Switch checked={isCreateTask} color="primary" />}
                    id="create_task"
                    name="create_task"
                    label="Create Task?"
                    value={isCreateTask}
                />
                
                <DialogContentText id="alert-dialog-slide-description">
                    Add Create Quote Task?
                </DialogContentText>
                {/* <img src={successIndicator} alt="Indicator" /> */}
            </DialogContent>
            
            <Divider
                sx={{mr:3, ml:3, mb:1}}/>
            <DialogActions>
                <Button variant="outlined" color='error' onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color='success' onClick={handleCreateQuote}>Create</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
