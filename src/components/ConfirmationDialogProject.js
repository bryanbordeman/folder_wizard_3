import React, { useCallback, useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Transition from './DialogTransistion'
import { Stack, Chip } from '@mui/material';
import  Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AddTaskSharpIcon from '@mui/icons-material/AddTaskSharp';
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReactCanvasConfetti from "react-canvas-confetti";

const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
};


export default function ConfirmationDialogProject(props) {
    const { open, setOpen, confirmation, setConfirmation, openFolder } = props

    useEffect(() => {
        // fire Confetti
        if(open && complete)
        setTimeout(() => {
            fire();
        }, 500);
    },[open])
    
    
    const handleClose = () => {
        setOpen(false);
    };

    //----------------------------Confetti-------------------------//
    const refAnimationInstance = useRef(null);
    // const { complete } = props
    const complete = true;

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
        refAnimationInstance.current({
            ...opts,
            origin: { y: 0.7 },
            particleCount: Math.floor(200 * particleRatio)
        });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.25, {
        spread: 26,
        startVelocity: 55
        });

        makeShot(0.2, {
        spread: 60
        });

        makeShot(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
        });

        makeShot(0.1, {
        spread: 120,
        startVelocity: 45
        });
    }, [makeShot]);

    //----------------------------Confetti-------------------------//

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
                    {/* {isCreateTask ? */}
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
                    {/* :
                    ''
                    } */}
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
                {complete? 
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Stack>
                    <Typography sx={{fontWeight: 500}} color='secondary' align='center' variant="h5" gutterBottom>
                    Another sale. Keep up the great work!
                    </Typography>
                    <Chip 
                        sx={{
                            fontWeight: '500',
                            marginTop: '20px',
                            fontSize: '4rem',
                            paddingTop:'50px',
                            paddingBottom:'50px',
                            display: 'flex',
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }}  
                        icon={<MonetizationOnIcon sx={{fontSize: '100%'}}/>}
                        label='YUDHA!!!'
                        color="primary" 
                        variant="outlined" 
                    />
                </Stack>
                {/* <Typography sx={{fontWeight: 500}} color='primary' align='center' variant="h1" gutterBottom>
                YUDHA!!!
                </Typography> */}
                </div>
                : 
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Chip 
                    sx={{
                        fontWeight: '500',
                        marginTop: '20px',
                        fontSize: '2rem',
                        paddingTop:'30px',
                        paddingBottom:'30px',
                        display: 'flex',
                        alignSelf: 'center',
                        justifyContent: 'center'
                    }}  
                    icon={<ErrorOutlineSharpIcon sx={{fontSize: '100%'}}/>}
                    label='Something Went Wrong!! Please try again.'
                    color="error" 
                    // variant="outlined" 
                />
                </div>
                }
            </DialogContent>
            <Divider
                sx={{mr:3, ml:3, mb:1}}/>
            <DialogActions>
                <Button variant="outlined" color='error' onClick={() => {window.close()}}>Close Program</Button>
                <Button variant="contained" onClick={handleClose} >Create Another Quote</Button>
                <Button variant="contained" color='secondary' onClick={openFolder}>Open Project Folder</Button>
            </DialogActions>
            <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        </Dialog>
        
        </div>
    );
};



