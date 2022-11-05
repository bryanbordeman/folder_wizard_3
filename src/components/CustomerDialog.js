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
import InputLabel from '@mui/material/InputLabel';
import MuiPhoneNumber from 'material-ui-phone-number';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';


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
        setChecked([]);
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
        const { name, value } = e.target;
        setCustomer({
        ...customer,
        'id': customerData.id,
        [name]: name === 'website'? `http://${value}` : value
        });
        // const result = e.target.value
        // setCustomer({'id': customerData.id, 'name' : result});
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
                        name="name"
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
                    <Stack direction="row" spacing={2}>
                        <MuiPhoneNumber
                            sx={{width: '100%'}}
                            id="phone"
                            name="phone"
                            label="Phone(s)"
                            // value={phoneValues.phone_number}
                            defaultCountry={'us'} 
                            variant='outlined'
                            // onChange={handlePhoneValue}
                        />
                        <IconButton 
                            sx={{top: '7px', maxHeight: '2.75rem', border: 1 }}
                            color="primary" 
                            // onClick={handleCreatePhone}
                        >
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    {/* {phoneNumbers.map((phone) => (
                        <div key={phone.id}>
                            <Chip label={`${phone.phone_number} | ${phone.phone_type}`} variant="outlined" onDelete={() => handleDeletePhone(phone.id)} />
                        </div>
                    ))} */}
                    <Stack direction="row" spacing={2}>
                        <MuiPhoneNumber
                            variant='outlined'
                            sx={{width: '100%'}}
                            id="fax"
                            name="fax"
                            label="Fax"
                            // value={faxValues.phone_number}
                            defaultCountry={'us'} 
                            // onChange={handleFaxValue}
                        />
                        <IconButton 
                            sx={{top: '14px', maxHeight: '2.75rem', border: 1 }}
                            color="primary" 
                            // onClick={handleCreateFax}
                        >
                            <AddIcon />
                        </IconButton>
                        </Stack>
                        {/* {faxNumber ? 
                            <div>
                                <Chip 
                                    label={`${faxNumber.phone_number} | ${faxNumber.phone_type}`} 
                                    variant="outlined" 
                                    onDelete={() => handleDeleteFax(faxNumber.id)}
                                />
                            </div>
                            : ''} */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="website"
                        label="Website"
                        type="text"
                        fullWidth
                        name="website"
                        defaultValue={`${customerData.website}`.split('/').slice(2).join('/')} // slice off http:// from start of string
                        onChange={handleUpdateCustomer}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">http://</InputAdornment>,
                            // endAdornment: <InputAdornment position="end"><.com></InputAdornment>,
                        }}
                        
                        // onInput = {(e) =>{
                        //     e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        // }}
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
