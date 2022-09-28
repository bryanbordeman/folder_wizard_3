import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Transition from './DialogTransistion'
import { Stack, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import  Divider from '@mui/material/Divider';
import AddTaskSharpIcon from '@mui/icons-material/AddTaskSharp';
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp';

export default function ConfirmationDialogQuote(props) {

    const { open, setOpen, isCreateTask, setIsSubmitted, setBackdrop, setIsCreateTask } = props
    const { confirmation, setConfirmation, handleClearInputs, openFolder } = props;

    const handleClose = () => {
        const initialConfirmation = {
            database: null, 
            task: null,
            folder: null,
        }
        setOpen(false);
        setConfirmation(initialConfirmation);
        setIsSubmitted(false);
        setBackdrop(false);
        setIsCreateTask(true);
        handleClearInputs();
        
    };

    const handleOpenFolder = (path) => {
        openFolder();
        handleClose();
        
    };

    return (
        <div>
        <Dialog
            fullScreen
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle variant='h3'>Confirmation</DialogTitle>
            <Divider
                sx={{mr:3, ml:3, mb:1}}/>
            <DialogContent>
                <Stack>
                    <Stack direction="row" spacing={2} sx={{mb:3}}>
                        {confirmation.database ?
                            <AddTaskSharpIcon fontSize='large' color= 'success'/>
                            :
                            <ErrorOutlineSharpIcon fontSize='large' color= 'error'/>
                        }
                            <Typography variant="h5" gutterBottom>
                                {confirmation.database ? 'Database record created' : 'Database record was not created'}
                            </Typography>
                    </Stack>
                    {isCreateTask ?
                    <Stack direction="row" spacing={2} sx={{mb:3}}>
                        {confirmation.task ?
                            <AddTaskSharpIcon fontSize='large' color= 'success'/>
                            :
                            <ErrorOutlineSharpIcon fontSize='large' color= 'error'/>
                        }
                            <Typography variant="h5" gutterBottom>
                                {confirmation.task ? 'Task created' : 'Task was not created'}
                            </Typography>
                    </Stack>
                    :
                    ''
                    }
                    <Stack direction="row" spacing={2} sx={{mb:3}}>
                        {confirmation.folder ?
                            <AddTaskSharpIcon fontSize='large' color= 'success'/>
                            :
                            <ErrorOutlineSharpIcon fontSize='large' color= 'error'/>
                        }                            <Typography variant="h5" gutterBottom>
                                {confirmation.folder ? 'Folder created' : 'Folder was not created'}
                            </Typography>
                    </Stack>
                    
                </Stack>
            </DialogContent>
            <Divider
                sx={{mr:3, ml:3, mb:1}}/>
            <DialogActions>
                <Button variant="outlined" color='error' onClick={() => {window.close()}}>Close Program</Button>
                <Button variant="contained"onClick={handleClose}>Create Another Quote</Button>
                <Button disabled={!confirmation.folder} variant="contained" color='secondary' onClick={handleOpenFolder}>Open Quote Folder</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
