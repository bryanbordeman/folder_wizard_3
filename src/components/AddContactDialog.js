import React, { useState, useLayoutEffect } from 'react';
import PhoneServices from '../services/Phone.services';
import ContactServices from '../services/Contact.services';
import AddressServices from '../services/Address.services';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AddressPicker from './AddressPicker';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Transition from './DialogTransistion'
import CloseIcon from '@mui/icons-material/Close';
import { Stack, IconButton } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import MuiPhoneNumber from 'material-ui-phone-number';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';

export default function AddContactDialog(props) {
    const [ extension, setExtension ] = useState('');
    const [ address, setAddress ] = useState({});
    const [ openDelete, setOpenDelete ] = useState(false);
    const [ deleteMessage, setDeleteMessage] = useState({title: '', content:''});
    const [ isValid, setIsValid ] = useState(true);
    const { open, 
            setOpen, 
            token, 
            handleOpenSnackbar, 
            company,
            setContacts, 
            contacts, 
            contact, 
            setContact,
            updateContact,
        } = props;

    const initialValues = {
        name: '',
        job_title: '',
        company: '',
        address: '',
        phone: [],
        fax: '',
        email: '',
        quotes: [],
        projects: [],
    };

    const [ values, setValues ] = useState(initialValues);

    const initialErrors = {
        name:'',
        email: '',
    };

    const [ errors, setErrors ] = useState(initialErrors);

    useLayoutEffect(() => {
        if (!contact){
        setValues({
            ...values,
            company: company.id,
            quotes: []
            });
        } else {
            //! address is not updating
            setValues(contact);
            
            contact.phone.forEach(element => getPhone('phone',element));
            if(contact.fax){
                getPhone('fax', contact.fax)
            }
            if(contact.address){
                getAddress(contact.address)
            }
            
        }
    },[open]);

    const handleClose = () => {
        setValues(initialValues);
        setPhoneValues(initialPhoneValues);
        setFaxValues(initialFaxValues);
        setExtension('');
        setPhoneNumbers([]);
        setFaxNumber('');
        setDeletePhoneList([]);
        setDeleteFaxId('');
        setAddress({});
        setOpen(false);
        if(contact){
            setContact('')
        };
    };

    const createContact = () => {
        ContactServices.createContact(values, token)
        .then((response) => {
            setContacts(oldArray => [...oldArray, response.data])
            handleOpenSnackbar('success', 'Contact was created')
            handleClose();
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const deleteContact = () => {
        ContactServices.deleteContact(contact.id, token)
        .then((response) => {
            handleOpenSnackbar('warning', 'Contact was deleted');
            // update contacts list here
            const contactId = response.request.responseURL.toString().split("/").at(-1);
            const tempList = contacts.filter((c) => (c.id != contactId))
            setContacts(tempList)
            handleClose();
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const handleUpdateContact = () =>{
        updateContact(contact.id, values);
        handleClose();
         // if phone key is in delete list delete phone from db
        if (deletePhoneList.length > 0){
            deletePhoneList.map((id) => {
                deletePhone(id);
            });
        };
        if(deleteFaxId.length > 0){
            deleteFax(deleteFaxId);
        };
    };

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
        });
    };

    const handleValidation = () => {
        let formIsValid = true;
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

        if(values.name === ''){
            setErrors({...errors, name: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, name: null});
            }, 3000);
        }
        else if(values.email !== null && values.email.length > 0 && !regex.test(values.email)){
            setErrors({...errors, email: 'Invalid Email'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, email: null});
            }, 3000);
        }
        setIsValid(formIsValid)
        setTimeout(() => {
            setIsValid(true);
        }, 3000);

        if(contact){
            return formIsValid && contact? handleUpdateContact() : null
        }else{
            return formIsValid? createContact() : null
        }
    };

    const handleDeleteContact = (contact) => {
        setDeleteMessage({title: 'Permanently delete contact?', content: `${contact.name}`})
        setOpenDelete(true)
    };

    const getAddress = (id) => {
        AddressServices.getAddress(id, token)
        .then(response => {
            setAddress({address: response.data})
            // handleOpenSnackbar('success', 'New Address was created')
        })
        .catch(e => {
            console.log(e);
            // setAddress('')
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };


    //! --------------------------- phone and fax states ------------------------//

    const initialPhoneValues = {
        phone_number: '',
        phone_type: ''
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
                setPhoneNumbers(oldArray => [...oldArray, response.data]);
                setPhoneValues(initialPhoneValues)
                setExtension('');
                setValues({...values, phone: [...values.phone, response.data.id]})
                handleOpenSnackbar('success', 'Phone Number was created')
            }else{
                setFaxNumber(response.data)
                setFaxValues(initialFaxValues)
                setValues({...values, fax: response.data.id})
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

    const handleChangeExtension = (e) => {
        const { value } = e.target;
            if (value > -1) {
                setExtension(value)
            };
    };

    const handleCreatePhone = () => {
        if (phoneValues.phone_number){
            if(extension){
                let updateExtension = phoneValues
                updateExtension.phone_number = `${phoneValues.phone_number}, press ${extension}`
                createPhone('phone', updateExtension);
            }
            else{
                createPhone('phone', phoneValues)
            }
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
        setValues({...values, phone: [values.phone.filter((phone) => phone !== id)][0]});
        // deletePhone(id);
    };

    const handleDeleteFax = (id) => {
        setDeleteFaxId(id); // add to delete var
        setFaxNumber(''); // clear var
        setValues({...values, fax: ''});
        // deleteFax(id);
    };

    return (
        <Box >
            <Dialog
                TransitionComponent={Transition}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "700px", 
                        },
                    },
                    }}
                open={open} 
                onClose={handleClose}
            >
                <DialogTitle>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Stack>
                            <Typography variant="h4">
                                {contact? 'Edit Contact' : 'Create Contact' }
                            </Typography>
                            <Typography variant="subtitle1">
                                {`${company.name}`}
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
                <DialogContent>
                    <Stack spacing={2}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Full Name"
                        value={values.name}
                        type="text"
                        // variant="standard"
                        fullWidth
                        onChange={handleInputValue}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                        helperText={errors.name === null ? '' : errors.name}
                        error={errors.name? true : false}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="job_title"
                        name="job_title"
                        label="Job Title"
                        value={values.job_title}
                        type="text"
                        // variant="standard"
                        fullWidth
                        onChange={handleInputValue}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        type="text"
                        // variant="standard"
                        value={values.email === null? '' : values.email}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">www.</InputAdornment>,
                        }}
                        onChange={handleInputValue}
                        helperText={errors.email === null ? '' : errors.email}
                        error={errors.email? true : false}
                        // onInput = {(e) =>{
                        //     e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        // }}
                    />
                    <AddressPicker
                        token={token} 
                        handleOpenSnackbar={handleOpenSnackbar}
                        values={values}
                        setValues={setValues}
                        quote={address}
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
                    <TextField
                        autoFocus
                        margin="dense"
                        id="extension"
                        name="extension"
                        label="Ext."
                        value={extension}
                        type="number"
                        
                        onChange={handleChangeExtension}
                    />
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="phone-type-label">Type</InputLabel>
                        <Select
                            labelId="phone-type-label"
                            id="phone-type"
                            defaultValue={phoneValues.phone_type}
                            value={phoneValues.phone_type}
                            label="Type"
                            onChange={(e) => {setPhoneValues({...phoneValues, phone_type: e.target.value})}}
                        >
                            <MenuItem value={'Mobile'}>Mobile</MenuItem>
                            <MenuItem value={'Direct'}>Direct</MenuItem>
                            <MenuItem value={'Work'}>Work</MenuItem>
                            <MenuItem value={'Home'}>Home</MenuItem>
                        </Select>
                    </FormControl>
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
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {contact? 
                        <Button 
                            variant='outlined' 
                            color='error'
                            onClick={() => handleDeleteContact(contact)}>Delete
                        </Button>
                    :''}
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                    <Button 
                        variant='contained' 
                        color={`${isValid? 'primary' : 'error'}`}
                        onClick={handleValidation}>{contact? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
            <DeleteConfirmationModal
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
                message={deleteMessage}
                deleteAction={deleteContact}
            />
        </Box>
    );
}
