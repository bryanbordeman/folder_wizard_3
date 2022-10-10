import React, { useEffect, useState } from 'react';
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
    }
    const [ extension, setExtension ] = useState('');
    const [ phoneValues, setPhoneValues ] = useState(initialPhoneValues);
    const [ phoneNumbers, setPhoneNumbers ] = useState([]);
    const { open, setOpen, token, handleOpenSnackbar, company, quote} = props;

    const initialValues = {
        name: '',
        job_title: '',
        company: company.id,
        phone: '',
        fax: '',
        email: '',
        quotes: [quote.id],
        projects: [],
    }
    const [ values, setValues ] = useState(initialValues);

    const handleClose = () => {
        setValues(initialValues)
        setPhoneValues(initialPhoneValues)
        setOpen(false);
    };

    const createContact = () => {
        ContactServices.createContact(values, token)
        .then(response => {
            // console.log(response.data)
            handleOpenSnackbar('info', 'Contact was updated')
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const createPhone = () => {
        PhoneServices.createPhone(phoneValues, token)
        .then(response => {
            setPhoneNumbers(oldArray => [...oldArray, response.data])
            handleOpenSnackbar('success', 'Phone Number was created')
        })
        .then(() => {
            setPhoneValues(initialPhoneValues)
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const deletePhone = (id) => {
        PhoneServices.deletePhone(id, token)
        .then(response => {
            
            handleOpenSnackbar('error', 'Phone was deleted')
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
        setValues({
        ...values,
        fax: value
        });
    };


    const handleChangeExtension = (e) => {
        const { value } = e.target;
        setExtension(value)
    };

    const handleCreatePhone = () => {
        if (phoneValues.phone_number)
            createPhone()
    };

    const handleDeletePhone = (id) => {
        deletePhone(id)
        setPhoneNumbers(phoneNumbers.filter((phone) => phone.id !== id))
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
                        variant="standard"
                        fullWidth
                        onChange={handleInputValue}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="job_title"
                        name="job_title"
                        label="Job Title"
                        value={values.job_title}
                        type="text"
                        variant="standard"
                        fullWidth
                        onChange={handleInputValue}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    <Stack direction="row" spacing={2}>
                    <MuiPhoneNumber
                        sx={{width: '100%'}}
                        id="phone"
                        name="phone"
                        label="Phone(s)"
                        value={phoneValues.phone_number}
                        defaultCountry={'us'} 
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
                        variant="standard"
                        onChange={handleChangeExtension}
                    />
                    <FormControl sx={{ minWidth: 80 }}>
                        <InputLabel id="phone-type-label">Type</InputLabel>
                        <Select
                            variant="standard"
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
                    <MuiPhoneNumber
                        margin="dense"
                        id="fax"
                        name="fax"
                        label="Fax"
                        value={values.fax}
                        defaultCountry={'us'} 
                        onChange={handleFaxValue}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        type="text"
                        variant="standard"
                        value={values.email}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">www.</InputAdornment>,
                        }}
                        onChange={handleInputValue}
                        // onInput = {(e) =>{
                        //     e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        // }}
                    />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Cancel</Button>
                    <Button variant='contained' color='secondary' onClick={createContact}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
