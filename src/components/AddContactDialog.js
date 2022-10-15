import React, { useEffect, useState, useLayoutEffect } from 'react';
import PhoneServices from '../services/Phone.services';
import ContactServices from '../services/Contact.services';
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
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';

export default function AddContactDialog(props) {

    const initialPhoneValues = {
        phone_number: '',
        phone_type: ''
    };

    const initialFaxValues = {
        phone_number: '',
        phone_type: 'Fax'
    };

    const [ extension, setExtension ] = useState('');
    const [ isValid, setIsValid ] = useState(true);
    const [ phoneValues, setPhoneValues ] = useState(initialPhoneValues);
    const [ faxValues, setFaxValues ] = useState(initialFaxValues);
    const [ phoneNumbers, setPhoneNumbers ] = useState([]);
    const [ faxNumber , setFaxNumber ] = useState('');
    const { open, setOpen, token, handleOpenSnackbar, company, quote, setContacts, contacts, contact, setContact} = props;

    const initialValues = {
        name: '',
        job_title: '',
        company: '',
        phone: [],
        fax: '',
        email: '',
        quotes: [],
        projects: [],
    }

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
            quotes: [quote.id]
            });
        } else {
            setValues(contact)
            contact.phone.forEach(element => getPhone('phone',element));
            if(contact.fax){
                getPhone('fax', contact.fax)
            }
        }
    },[open])

    const handleClose = () => {
        setValues(initialValues)
        setPhoneValues(initialPhoneValues)
        setPhoneNumbers([])
        setFaxNumber('')
        setFaxValues(initialFaxValues)
        setExtension('')
        setOpen(false);
        if(contact){
            setContact('')
        }
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

    const updateContact = () => {
        ContactServices.updateContact( contact.id, values, token)
        .then((response) => {
            let updatedContacts = contacts.filter(element => element.id !== response.data.id)
            updatedContacts.push(response.data)
            setContacts(updatedContacts)
            handleOpenSnackbar('info', 'Contact was updated')
            handleClose();
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

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
                handleOpenSnackbar('success', 'Fax Number was created')
            }
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const deletePhone = (type, id) => {
        PhoneServices.deletePhone(id, token)
        .then(response => {
            if(type === 'phone'){
                setPhoneNumbers(phoneNumbers.filter((phone) => phone.id !== id))
                setValues({...values, phone: [values.phone.filter((phone) => phone.id !== id)]})
                handleOpenSnackbar('error', 'Phone was deleted')
            }else{
                setFaxNumber('')
                handleOpenSnackbar('error', 'Fax was deleted')
            }
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

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
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
        deletePhone('phone', id)
    };

    const handleDeleteFax = (id) => {
        deletePhone('fax', id)
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
        else if(values.email.length > 0 && !regex.test(values.email)){
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
            return formIsValid && contact? updateContact() : null
        }else{
            return formIsValid? createContact() : null
        }
    };

    return (
        <Box >
            <Dialog
                TransitionComponent={Transition}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "700px",  // Set your width here
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
                                {'Create Contact'}
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
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                    <Button 
                        variant='contained' 
                        color={`${isValid? 'primary' : 'error'}`}
                        onClick={handleValidation}>{contact? 'Update' : 'Add'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
