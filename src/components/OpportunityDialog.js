import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Transition from './DialogTransistion'
import CloseIcon from '@mui/icons-material/Close';
import { Stack, IconButton } from '@mui/material';
import OpportunityFormEdit from './OpportunityFormEdit';
import Typography from '@mui/material/Typography';

export default function OpportunityDialog(props) {
    const { open, setOpen, quote, user, token, handleOpenSnackbar} = props;
    
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
                                {'Edit Opportunity'}
                            </Typography>
                            <Typography variant="subtitle1">
                                {`${quote.number} ${quote.name}`}
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
                <OpportunityFormEdit
                    token={token}
                    user={user}
                    handleOpenSnackbar={handleOpenSnackbar}
                    editQuote={quote}
                    setOpenDialog={setOpen}
                />
            </Dialog>
        </Box>
    );
}
