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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ConfirmationDialogQuote from './ConfirmationDialogQuote';

export default function OpportunityForm(props) {
    const { token, user, handleOpenSnackbar } = props
    const [ clear, setClear ] = useState(false);
    const [ isValid, setIsValid ] = React.useState(true);
    const [ openConfirmation, setOpenConfirmation ] = React.useState(false)
    
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
        prevailing_rate: false,
        travel_job: false,
        notes:''
    }

    const [ values, setValues ] = useState(initialValues);

    const initialErrors = {
        name:'',
        project_category:'',
        project_type:'',
        manager: '',
        address:'',
        customers:'',
        contacts:'',
    }

    const [ errors, setErrors ] = useState(initialErrors);

    useEffect(() => {
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

    const createQuote = () => {
        QuoteDataService.createQuote(values, token)
        .then(response => {
            setOpenConfirmation(true);
        })
        .then(() => {
            handleClearInputs()
        })
        .catch( e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        })
    };

    const handleSubmit = () => {
        // setOpenConfirmation(true);
        createQuote();
    };

    const handleValidation = () => {
        let formIsValid = true;

        if(values.name === ''){
            setErrors({...errors, name: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, name: null});
            }, 3000);
        }

        else if(values.project_category === ''){
            setErrors({...errors, project_category: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, project_category: null});
            }, 3000);
        }
        else if(values.project_type === ''){
            setErrors({...errors, project_type: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, project_type: null});
            }, 3000);
        }
        else if(values.customers.length < 1){
            setErrors({...errors, customers: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, customers: null});
            }, 3000);
        }

        setIsValid(formIsValid)
        setTimeout(() => {
            setIsValid(true);
        }, 3000);
    return formIsValid ? handleSubmit() : null

    };

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
        });
    };

    const handleClearInputs = () => {
        setClear(true);
        setValues(initialValues);
        retrieveNextQuoteNumber();
    }

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
                    onInput = {(e) =>{
                        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                    }}
                    inputProps={{ maxLength: 27 }}
                    value={values.name}
                    type="text"
                    fullWidth
                    variant="outlined"
                    helperText={errors.name === null ? '' : errors.name}
                    error={errors.name? true : false}
                />
                <Stack direction="row" spacing={2}>
                    <FormControlLabel
                        onChange={() => {setValues({...values, travel_job: !values.travel_job})}}
                        control={<Switch checked={values.travel_job} color="primary" />}
                        id="travel_job"
                        name="travel_job"
                        label="Travel Job"
                        value={values.travel_job}
                    />
                    <FormControlLabel
                        onChange={() => {setValues({...values, prevailing_rate: !values.prevailing_rate})}}
                        control={<Switch checked={values.prevailing_rate} color="primary" />}
                        id="prevailing_rate"
                        name="prevailing_rate"
                        label="Prevailing Rate"
                        value={values.prevailing_rate}
                    />
                </Stack>
                <CategoryTypePickers
                    token={token}
                    user={user}
                    values={values}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                    clear={clear}
                    setClear={setClear}
                />
                <ManagerPicker
                    token={token}
                    user={user}
                    values={values}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                    clear={clear}
                    setClear={setClear}
                />
                <AddressPicker
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                    values={values}
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                />
                <CustomerPicker
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                    values={values}
                    errors={errors}
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                />
                <Divider/>
                <Stack 
                    sx={{pb:4}}
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                >
                    <Button 
                        onClick={handleClearInputs}
                        variant='outlined' 
                        size='large'
                    >Clear</Button>
                    <Button 
                        onClick={handleValidation}
                        variant='contained' 
                        size='large' 
                        color='secondary' 
                    >Submit</Button>
                </Stack>
            </Stack>
            <ConfirmationDialogQuote
                open={openConfirmation}
                setOpen={setOpenConfirmation}
                values={values}
            />
        </Box>
    );
};