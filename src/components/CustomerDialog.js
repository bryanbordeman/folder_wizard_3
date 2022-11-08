import React, { useEffect, useState, useRef } from 'react';
import CompanyServices from '../services/Company.services';
import ContactServices from '../services/Contact.services';
import PhoneServices from '../services/Phone.services';
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
    const { customerData , setCustomerData, open, setOpen, token, handleOpenSnackbar, setCustomers, customers, quote } = props;
    const { updateContact, checked, setChecked, setEditContacts, difference } = props;
    const { contacts, setContacts } = props;
    const [ customer, setCustomer ] = useState({});
    const [ values, setValues ] = useState('');
    const [ openDelete, setOpenDelete ] = useState(false);
    const [ deleteMessage, setDeleteMessage] = useState({title: '', content:''});
    
    useEffect(() => {
        setCustomer({
            id: customerData.id,
            name: customerData.name,
            address: customerData.address? customerData.address.map((obj) => (obj.id? obj.id : obj)) : [],
            phone: customerData.phone ? customerData.phone.map((obj) => (obj.id? obj.id : obj)) : [],
            fax: customerData.fax? customerData.fax.id : '',
            website: customerData.website
        });
        if(open === true && customerData.phone !== undefined && customerData.phone.length > 0){
            // if open is true and data not equal to undefined and data list not empty
            if(customerData.phone && customerData.phone[0].id && phoneNumbers.length < 1){
                // if data exist and data is object and phone list is empty
                setPhoneNumbers(customerData.phone)
            }
            if(customerData.phone && !customerData.phone[0].id && phoneNumbers.length < 1){
                // if data exist and data is pk and phone list is empty
                customerData.phone.map((obj) => (getPhone('phone',obj)))
            }
        }else{
            // if no phone assigned to customer
            setPhoneNumbers([])
        }


        if(open === true && customerData.fax !== null){
            if(customerData.fax.id){
                setFaxNumber(customerData.fax);
            }
            if(!customerData.fax.id && customerData.fax){
                setFaxNumber(getPhone('fax', customerData.fax))
            }
        }
        
        if(customerData && open)
            // fill ContactList
            recieveContacts(customerData.id)
    }, [open])

    const handleClose = () => {
        setOpen(false);
        setCustomerData(customer)
        // setChecked([]);
        setContacts([]);
        setCustomer('');
        setPhoneNumbers([]);
        setFaxNumber('');
        setDeletePhoneList([]);
        setDeleteFaxId('');
        
        if(quote){
            setEditContacts([]);
        };
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
        // if contact is checked update contact
        if(difference){
            difference.map((c) => {
                if(c.quotes.includes(quote.id)){
                    let index = c.quotes.indexOf(quote.id)
                    if (index > -1) { // only splice array when item is found
                        c.quotes.splice(index, 1); // remove quote id from array
                    };
                    updateContact(c.id, c);
                }else{
                    let updatedContact = c 
                    updatedContact.quotes.push(quote.id);
                    updateContact(c.id, updatedContact);
                };
            });
            handleClose();
        }
        // if customer was edited update
        if(customer !== customerData){
            updateCompany(customerData.id, customer);
            handleClose();
        }else{
            handleClose();
        }
        // if phone key is in delete list delete phone from db
        if (deletePhoneList.length > 0){
            deletePhoneList.map((id) => {
                //* set delay so db doesn,t lockout. 
                //* this can be updated once db is updated to postgreSQL.
                setTimeout(() => {
                    deletePhone(id);
                }, 3000);
            })
        }
        if(deleteFaxId.length > 0){
            deleteFax(deleteFaxId);
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
        CompanyServices.updateCompany(id, data, token)
        .then(response => {
            const updatedCustomer = response.data  // this works

            //! below not working
            const updatedCustomers = customers.map(el => (
                el.id === customer.id ? 
                updatedCustomer
                : el
            ));
            setCustomers(updatedCustomers)
            // console.log(customers)
            // const updatedPhone = updatedCustomer.phone.map((p) => {
            //     return getPhone('phone', p )
            // })
            // setPhoneNumbers(updatedPhone)
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
            // setOpen(false);
            handleClose();
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

    //! --------------------------- phone and fax states ------------------------//

    const initialPhoneValues = {
        phone_number: '',
        phone_type: 'Main'
    };

    const initialFaxValues = {
        phone_number: '',
        phone_type: 'Fax'
    };

    const [ phoneValues, setPhoneValues ] = useState(initialPhoneValues);
    const [ faxValues, setFaxValues ] = useState(initialFaxValues);
    const [ phoneNumbers, setPhoneNumbers ] = useState([]);
    const [ faxNumber , setFaxNumber ] = useState('');
    const [ deletePhoneList, setDeletePhoneList ] = useState([]);
    const [ deleteFaxId, setDeleteFaxId ] = useState([]);

    const createPhone = (type, data) => {
        PhoneServices.createPhone(data, token)
        .then(response => {
            if(type === 'phone'){
                setPhoneNumbers(oldArray => [...oldArray, response.data]); // add phone to list
                setPhoneValues(initialPhoneValues) // clear input
                setCustomer({...customer, phone: [...customer.phone, response.data.id]}) // add phone to customer
                handleOpenSnackbar('success', 'Phone Number was created')
            }else{
                setFaxNumber(response.data)
                setFaxValues(initialFaxValues)
                setCustomer({...customer, fax: response.data.id})
                handleOpenSnackbar('success', 'Fax Number was created')
            }
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const deletePhone = (id) => {
        PhoneServices.deletePhone(id, token)
        .then(response => {
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const deleteFax = (id) => {
        PhoneServices.deletePhone(id, token)
        .then(response => {
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const getPhone = (type, id) => {
        PhoneServices.getPhone(id, token)
        .then(response => {
            if(type === 'phone'){
                setPhoneNumbers(oldArray => [...oldArray, response.data]);
            }else{
                setFaxNumber(response.data)
            }
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const handlePhoneValue = (value) => {
        setPhoneValues({
            ...phoneValues,
        phone_number: value
        });
    };

    const handleFaxValue = (value) => {
        setFaxValues({
        ...faxValues,
        phone_number: value
        });
    };

    const handleCreatePhone = () => {
        if (phoneValues.phone_number){
            createPhone('phone', phoneValues)
        };
    };

    const handleCreateFax = () => {
        if (faxValues.phone_number && !faxNumber){
            createPhone('fax', faxValues)
        };
    };

    const handleDeletePhone = (id) => {
        setDeletePhoneList(oldArray => [...oldArray, id]); // add to delete list
        setPhoneNumbers(phoneNumbers.filter((phone) => phone.id !== id)); // subtract from phone list
        setCustomer({
            ...customer,
            phone: customer.phone.filter((phone) => phone !== id)
            }); // update customer
    };

    const handleDeleteFax = (id) => {
        setDeleteFaxId(id); // add to delete var
        setFaxNumber(''); // clear var
        setCustomer({
            ...customer,
            fax: ''
            }); // update customer
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
                            value={phoneValues.phone_number}
                            defaultCountry={'us'} 
                            variant='outlined'
                            onChange={handlePhoneValue}
                        />
                        <IconButton 
                            sx={{top: '7px', maxHeight: '2.75rem', border: 1 }}
                            color="primary" 
                            onClick={handleCreatePhone}
                        >
                            <AddIcon />
                        </IconButton>
                    </Stack>
                    {phoneNumbers.map((phone) => (
                        <div key={phone.id}>
                            <Chip label={`${phone.phone_number} | ${phone.phone_type}`} variant="outlined" onDelete={() => handleDeletePhone(phone.id)} />
                        </div>
                    ))}
                    <Stack direction="row" spacing={2}>
                        <MuiPhoneNumber
                            variant='outlined'
                            sx={{width: '100%'}}
                            id="fax"
                            name="fax"
                            label="Fax"
                            value={faxValues.phone_number}
                            defaultCountry={'us'} 
                            onChange={handleFaxValue}
                        />
                        <IconButton 
                            sx={{top: '14px', maxHeight: '2.75rem', border: 1 }}
                            color="primary" 
                            onClick={handleCreateFax}
                        >
                            <AddIcon />
                        </IconButton>
                        </Stack>
                        {faxNumber ? 
                            <div>
                                <Chip 
                                    label={`${faxNumber.phone_number} | ${faxNumber.phone_type}`} 
                                    variant="outlined" 
                                    onDelete={() => handleDeleteFax(faxNumber.id)}
                                />
                            </div>
                            : ''}
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
