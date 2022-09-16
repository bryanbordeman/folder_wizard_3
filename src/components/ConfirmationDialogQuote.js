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
    const { confirmation, setConfirmation } = props;

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
                    {confirmation.database ?
                    <Stack direction="row" spacing={2} sx={{mb:3}}>
                        <AddTaskSharpIcon fontSize='large' color='success'/>
                            <Typography variant="h5" gutterBottom>
                                Database record created
                            </Typography>
                    </Stack>
                    :
                    <Stack direction="row" spacing={2} sx={{mb:3}}>
                        <ErrorOutlineSharpIcon fontSize='large' color='error'/> 
                            <Typography variant="h5" gutterBottom>
                                Database record was not created
                            </Typography>
                    </Stack>
                    }
                    {confirmation.task ?
                    isCreateTask && <Stack direction="row" spacing={2} sx={{mb:3}}>
                        <AddTaskSharpIcon fontSize='large' color='success'/>
                            <Typography variant="h5" gutterBottom>
                                Task created
                            </Typography>
                    </Stack>
                    :
                    isCreateTask && <Stack direction="row" spacing={2} sx={{mb:3}}>
                        <ErrorOutlineSharpIcon fontSize='large' color='error'/> 
                            <Typography variant="h5" gutterBottom>
                                Task was not created
                            </Typography>
                    </Stack>
                    }
                    {confirmation.folder ?
                    <Stack direction="row" spacing={2} sx={{mb:3}}>
                        <AddTaskSharpIcon fontSize='large' color='success'/>
                            <Typography variant="h5" gutterBottom>
                                Folder created
                            </Typography>
                    </Stack>
                    :
                    <Stack direction="row" spacing={2} sx={{mb:3}}>
                        <ErrorOutlineSharpIcon fontSize='large' color='error'/> 
                            <Typography variant="h5" gutterBottom>
                                Folder was not created
                            </Typography>
                    </Stack>
                    }
                </Stack>
            </DialogContent>
            <Divider
                sx={{mr:3, ml:3, mb:1}}/>
            <DialogActions>
                <Button variant="outlined" color='error' onClick={() => {window.close()}}>Close Program</Button>
                <Button variant="contained"onClick={handleClose}>Create Another Quote</Button>
                <Button variant="contained" color='secondary' onClick={handleClose}>Open Quote</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
