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
    const { customerData , open, setOpen, token, handleOpenSnackbar, retrieveCompanies } = props;
    const [ customer, setCustomer ] = useState({});

    useEffect(() => {
        setCustomer(customerData)
    }, [open])

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate= () => {
        const data = {
            "name": customer,
        }
        if(customer.name !== customerData.name)
        {updateCompany(customerData.id, data)
        setOpen(false);
        }
    };

    const handleUpdateCustomer = (e) => {
        const result = e.target.value
        setCustomer(result);
    };

    const updateCompany = (id, data) => {
        CompanyServices.updateCompanyShort(id, data, token)
        .then(response => {
            retrieveCompanies();
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
                        defaultValue={customerData.name}
                        type="text"
                        fullWidth
                        onChange={handleUpdateCustomer}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
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
