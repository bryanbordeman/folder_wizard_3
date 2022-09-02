import React, { useEffect, useState } from 'react';
import CompanyServices from '../services/Company.services';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Transition from './DialogTransistion'

export default function CustomerDialog(props) {
    const { customerData , open, setOpen, token, handleOpenSnackbar } = props;
    const [ customer, setCustomer ] = useState({});

    useEffect(() => {
        setCustomer(customerData)
    }, [open])

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate= () => {
        console.log(customerData.id, customer)
        // setOpen(false);
    };

    const handleUpdateCustomer = (e) => {
        setCustomer(e.target.value);
    };

    const updateCompany = (id, data) => {
        CompanyServices.updateCompany(id, data, token)
        .then(response => {
            handleOpenSnackbar('info', 'Company was updated')
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    return (
        <Box>
            <Dialog 
                TransitionComponent={Transition}
                fullScreen
                open={open} 
                onClose={handleClose}
            >
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    value={customer.name}
                    type="text"
                    fullWidth
                    onChange={(e) => {handleUpdateCustomer(e)}}
                    // variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                <Button variant='contained' onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
    }
