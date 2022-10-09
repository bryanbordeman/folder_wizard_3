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
import MuiPhoneNumber from 'material-ui-phone-number';
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function AddContactDialog(props) {

    const initialPhoneValues = {
        phone_number: '',
        phone_type: ''
    }

    const [phoneValues, setPhoneValues] = React.useState(initialPhoneValues);
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
        setPhoneValues('')
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

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
        });
    };

    const handlePhoneValue = (value) => {
        setValues({
        ...values,
        phone: [value]
        });
    };

    const handleFaxValue = (value) => {
        setValues({
        ...values,
        fax: value
        });
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
                        label="Phone"
                        value={values.phone}
                        defaultCountry={'us'} 
                        onChange={handlePhoneValue}
                    />
                    <FormControl sx={{ minWidth: 80 }}>
                        <InputLabel id="phone-type-label">Type</InputLabel>
                        <Select
                            variant="standard"
                            labelId="phone-type-label"
                            id="phone-type"
                            value={phoneValues.phone_type}
                            label="Type"
                            onChange={(e) => {setPhoneValues({phone_type: e.target.value})}}
                        >
                            <MenuItem value={'Mobile'}>Mobile</MenuItem>
                            <MenuItem value={'Direct'}>Direct</MenuItem>
                            <MenuItem value={'Work'}>Work</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="extension"
                        name="extension"
                        label="Ext."
                        // value={values.job_title}
                        type="number"
                        variant="standard"
                        
                        // onChange={handleInputValue}
                        onInput = {(e) =>{
                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                        }}
                    />
                    
                    </Stack>
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
