import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Transition from './DialogTransistion'
import CloseIcon from '@mui/icons-material/Close';
import { Stack, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import ProjectForm from './ProjectForm';

export default function ProjectDialog(props) {
    const { open, setOpen, project, user, token, handleOpenSnackbar, projectType, darkState} = props;
    
    const handleClose = () => {
        setOpen(!open)
    };

    return (
        <Box>
            <Dialog 
                TransitionComponent={Transition}
                fullScreen
                open={open} 
                onClose={handleClose}
            >
                <DialogTitle>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Stack>
                            <Typography variant="h4">
                                {'Edit Project'}
                            </Typography>
                            <Typography variant="subtitle1">
                                {`${project.number} ${project.name}`}
                            </Typography>
                        </Stack>
                        <div>
                        <IconButton 
                            edge="end" 
                            aria-label="close"
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        </div> 
                    </div>
                </DialogTitle>
                <ProjectForm
                    token={token}
                    user={user}
                    handleOpenSnackbar={handleOpenSnackbar}
                    projectTypeLog={projectType}
                    darkState={darkState}
                    log={true}
                    projectLog={project}
                    editing={true}
                    setOpenLog={setOpen}
                />
            </Dialog>
        </Box>
    );
}
