import React, { useEffect, useState } from 'react';
import CompanyServices from '../services/Company.services';
import ContactServices from '../services/Contact.services';
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
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ContactsList from './ContactsList';
import InputAdornment from '@mui/material/InputAdornment';

export default function CustomerDialog(props) {
    const { customerData , open, setOpen, token, handleOpenSnackbar, setCustomers, customers, quote } = props;
    const { updateContact, checked, setChecked, setEditContacts, difference } = props;
    const { contacts, setContacts } = props;
    const [ customer, setCustomer ] = useState({});
    const [ values, setValues ] = useState('');
    const [ openDelete, setOpenDelete ] = useState(false);
    const [ deleteMessage, setDeleteMessage] = useState({title: '', content:''});

    useEffect(() => {
        setCustomer(customerData);
        if(customerData && open)
            recieveContacts(customerData.id)
    }, [open])

    const handleClose = () => {
        setOpen(false);
        setChecked([]); //! need to fix this. should not need to be cleared
        setContacts([]);
        if(quote){
            setEditContacts([]);
        }
    };

    const recieveContacts = (id) => {
        ContactServices.getContactCompany(id, token)
        .then(response => {
            setContacts(response.data)
            // add contacts to checked list in edit opportunity form
            if(quote){
                const editContacts = response.data
                editContacts.map((c) => {
                    if(c.quotes.includes(quote.id)){
                        setChecked(oldArray => [...oldArray, c]);
                        setEditContacts(oldArray => [...oldArray, c]);
                        // setChecked([c]);
                    }
                })
            }
            
            // handleOpenSnackbar('info', 'Company was updated')
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    }

    const handleUpdate= () => {
        if(difference){
            difference.map((c) => {
                if(c.quotes.includes(quote.id)){
                    let index = c.quotes.indexOf(quote.id)
                    if (index > -1) { // only splice array when item is found
                        c.quotes.splice(index, 1); // remove quote id from array
                    }
                    updateContact(c.id, c)
                }else{
                    let updatedContact = c 
                    updatedContact.quotes.push(quote.id)
                    updateContact(c.id, updatedContact)
                }
            })
            handleClose();
        }
        if(customer !== customerData){
            updateCompany(customerData.id, customer);
            const updatedCustomers = customers.map(el => (
                el.id === customer.id? {...el, name: customer.name}: el
            ))
            setCustomers(updatedCustomers)
            setOpen(false);
        }else{
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

    const deleteCompany = () => {
        CompanyServices.deleteCompany(customer.id, token)
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

    const handleDeleteCompany = (customer) => {
        setDeleteMessage({title: 'Permanently delete company?', content: `${customer.name}`})
        setOpenDelete(true)
    }

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
                    <ContactsList
                        checked={checked}
                        setChecked={setChecked}
                        contacts={contacts}
                        setContacts={setContacts}
                        company={customer}
                        updateContact={updateContact}
                        difference={difference}
                        quote={quote}
                        token={token}
                        handleOpenSnackbar={handleOpenSnackbar}
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
                        InputProps={{
                            startAdornment: <InputAdornment position="start">http://</InputAdornment>,
                            // endAdornment: <InputAdornment position="end"><.com></InputAdornment>,
                        }}
                        // onChange={handleUpdateCustomer}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' color='error' onClick={() => {handleDeleteCompany(customerData)}}>Delete</Button>
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>
            <DeleteConfirmationModal
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
                message={deleteMessage}
                deleteAction={deleteCompany}
            />
        </Box>
    );
}
