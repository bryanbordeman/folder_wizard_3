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
import AddressPicker from './AddressPicker';
import CloseIcon from '@mui/icons-material/Close';
import { Stack, IconButton } from '@mui/material';

export default function CustomerDialog(props) {
    const { customerData , open, setOpen, token, handleOpenSnackbar, setCustomers, customers } = props;
    const [ customer, setCustomer ] = useState({});
    const [ values, setValues ] = useState('');

    useEffect(() => {
        setCustomer(customerData);
    }, [open])
    

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdate= () => {
        if(customer !== customerData){
            updateCompany(customerData.id, customer);
            const updatedCustomers = customers.map(el => (
                el.id === customer.id? {...el, name: customer.name}: el
            ))
            setCustomers(updatedCustomers)
            setOpen(false);
        }
    };

    const handleUpdateCustomer = (e) => {
        const result = e.target.value
        setCustomer({'id': customerData.id, 'name' : result});
    };

    const updateCompany = (id, data) => {
        CompanyServices.updateCompanyShort(id, data, token)
        .then(response => {
            handleOpenSnackbar('info', 'Company was updated')
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const deleteCompany = (id) => {
        CompanyServices.deleteCompany(id, token)
        .then(response => {
            handleOpenSnackbar('error', 'Company was deleted')
            const updatedCustomers = customers.filter(el => (
                el.id !== customer.id
            ))
            setCustomers(updatedCustomers)
            setOpen(false);
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
                <DialogTitle>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            Edit Customer
                        </div>
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
                <DialogContent>
                    <Stack spacing={2}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Company Name"
                        defaultValue={customerData.name}
                        type="text"
                        fullWidth
                        onChange={handleUpdateCustomer}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    <AddressPicker
                        token={token} 
                        handleOpenSnackbar={handleOpenSnackbar}
                        values={values}
                        setValues={setValues}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        // onChange={handleUpdateCustomer}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="fax"
                        label="Fax"
                        type="text"
                        fullWidth
                        // onChange={handleUpdateCustomer}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="website"
                        label="Website"
                        type="text"
                        fullWidth
                        // onChange={handleUpdateCustomer}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    <Button variant='contained' color='secondary'>Add Contact</Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' color='error' onClick={() => {deleteCompany(customerData.id)}}>Delete</Button>
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
    }
