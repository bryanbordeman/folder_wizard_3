import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Stack, Box } from '@mui/material';
import  Divider from '@mui/material/Divider';
import ManagerPicker from './ManagerPicker';
import CategoryTypePickers from './CategoryTypePickers';
import AddressPicker from './AddressPicker';
import CustomerPicker from './CustomerPicker';
import QuoteDataService from '../services/Quote.services';

export default function OpportunityForm(props) {
    const { token, user, handleOpenSnackbar } = props
    const [ values, setValues ] = useState('');
    const [ errors, setErrors ] = useState('');

    const initialValues = {
        is_active: true,
        number: '',
        name:'',
        project_category:'',
        project_type:'',
        manager: user.id,
        address:'',
        customers:[],
        contacts:[],
        prevailing_rate:'',
        travel_job:'',
        notes:''
    }

    const initialErrors = {
        name:'',
        project_category:'',
        project_type:'',
        manager: '',
        address:'',
        customers:'',
        contacts:'',
    }

    useEffect(() => {
        setValues(initialValues);
        setErrors(initialErrors);
        retrieveNextQuoteNumber();
    },[])


    const retrieveNextQuoteNumber = () => {
        QuoteDataService.getNextQuoteNumber(token)
        .then(response => {
            const nextNumberObject = response.data;
            setValues((prevState) => ({
                ...prevState,
                number: nextNumberObject.next_quote_number,
            }));
        })
        .catch( e => {
            console.log(e);
        })
    }

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
        });
    };

    return ( 
        <Box sx={{mr:3, ml:3}}>
            <Stack spacing={2}>
                <TextField
                    autoFocus={false}
                    margin="dense"
                    id="name"
                    name='name'
                    label="Project Name"
                    onChange={handleInputValue}
                    // value={values.name}
                    type="text"
                    fullWidth
                    variant="outlined"
                    helperText={errors.name === null ? '' : errors.name}
                    error={errors.name? true : false}
                />
                <CategoryTypePickers
                    token={token}
                    user={user}
                    values={values}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                />
                <ManagerPicker
                    token={token}
                    user={user}
                    values={values}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                />
                <AddressPicker
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                />
                <CustomerPicker
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                />
                <Divider/>
                <Stack 
                    sx={{pb:4}}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                >
                    <Button variant='outlined' size='large'>Clear</Button>
                    <Button variant='contained' size='large' color='secondary' >Submit</Button>
                </Stack>
            </Stack>
        </Box>
    );
};