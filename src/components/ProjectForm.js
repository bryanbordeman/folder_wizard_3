import React, { useEffect, useState } from 'react';
import ContactServices from '../services/Contact.services';
import ProjectDataService from '../services/Project.services';
import { Stack, Box, Divider, Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import OpportunityPicker from './OpportunityPicker';
import ProjectButtons from './ProjectButtons';
import CategoryTypePickers from './CategoryTypePickers';
import BillingOrderTypePickers from './BillingOrderTypePickers';
import AddressPicker from './AddressPicker';
import CustomerPicker from './CustomerPicker';
import ConfirmationDialogProject from './ConfirmationDialogProject';

//! to do notes
/*
- Get next project number
- make customers single customer not multiple

*/ 
export default function ProjectForm(props) {
    const { user, token, handleChangeQuote, handleOpenSnackbar, darkState} = props;
    const [ projectType, setProjectType ] = useState(''); // project type
    const [ clear, setClear ] = useState(false);
    const [ contacts, setContacts ] = useState('');
    const [ checked, setChecked ] = React.useState([]);
    const [ openConfirmation, setOpenConfirmation ] = React.useState(false)

    const initialValues = {
        is_active: true,
        number: '',
        name:'',
        project_category:'',
        project_type:'',
        address:'',
        customers: '',
        prevailing_rate: false,
        union: false,
        certified_payroll: false,
        material_only: false,
        travel_job: false,
        tax_exempt: false,
        billing_type: '',
        order_type: '',
        terms: '',
        price:'',
        notes:''
    };

    const [ values, setValues ] = React.useState(initialValues);

    const initialErrors = {
        name:'',
        project_category:'',
        project_type:'',
        billing_type: '',
        order_type: '',
        terms: '',
        customers:'',
        price:'',
    };

    const [ errors, setErrors ] = useState(initialErrors);
    const [ isValid, setIsValid ] = useState(true);

    const initialConfirmation = {
        database: null, 
        task: null,
        folder: null,
    };

    const [ confirmation, setConfirmation ] = useState(initialConfirmation);

    useEffect(() => {
        retrieveNextProjectNumber();
    },[projectType, clear])

    const retrieveNextProjectNumber = () => {
        ProjectDataService.getNextProjectNumber(token)
        .then(response => {
            const nextNumberObject = response.data;
            let nextNumber = ''
            switch(projectType) {
                case 2:
                    nextNumber = nextNumberObject.next_service_number
                    break;
                case 3:
                    nextNumber = nextNumberObject.next_hse_number
                    break;
                default:
                    nextNumber = nextNumberObject.next_project_number
            }

            setValues((prevState) => ({
                ...prevState,
                number: nextNumber,
            }));
        })
        .catch( e => {
            console.log(e);
        })
    };

    const createProject = () => {
        ProjectDataService.createProject(values, token)
        .then(response => {
            handleOpenSnackbar('success', 'Project was created')
        })
        .catch( e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        })
    };


    // contact API's  ---------------------------------

    const updateContact = (id, data) => {
        ContactServices.updateContact( id, data, token)
        .then((response) => {
            let updatedContacts = contacts.filter(element => element.id !== response.data.id)
            updatedContacts.push(response.data)
            setContacts(updatedContacts)
            handleOpenSnackbar('info', 'Contact was updated')
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };


    const handleChangeProjectType = (id) => {
        /*
        set project type 
        {id: 1, name: 'project'},
        {id: 2, name: 'service'},
        {id: 3, name: 'HSE project'}
        */
        setProjectType(id);
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
        setChecked([]);
        
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
        else if(values.billing_type === ''){
            setErrors({...errors, billing_type: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, billing_type: null});
            }, 3000);
        }
        else if(values.order_type === ''){
            setErrors({...errors, order_type: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, order_type: null});
            }, 3000);
        }
        else if(values.customers === undefined){
            setErrors({...errors, customers: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, customers: null});
            }, 3000);
        }
        else if(values.terms === ''){
            setErrors({...errors, terms: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, terms: null});
            }, 3000);
        }
        else if(values.price === ''){
            setErrors({...errors, price: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, price: null});
            }, 3000);
        }
        
        setIsValid(formIsValid)
        setTimeout(() => {
            setIsValid(true);
        }, 3000);
        return formIsValid ? handleSubmit() : null
    };

    const handleSubmit = () => {
        setOpenConfirmation(!openConfirmation)
    };


    
    return ( 
        <Box sx={{mr:3, ml:3}}>
            <Stack spacing={2}>
            <OpportunityPicker
                    token={token}
                    handleOpenSnackbar={handleOpenSnackbar}
                    handleChangeQuote={handleChangeQuote}
            />
            <ProjectButtons
                darkState={darkState}
                projectType={projectType}
                handleChangeProjectType={handleChangeProjectType}
            />
            <Divider/>
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
                <Divider/>
                <Stack 
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    <FormControlLabel
                        sx={{width: '33%'}}
                        onChange={() => {setValues({...values, prevailing_rate: !values.prevailing_rate})}}
                        control={<Switch checked={values.prevailing_rate} color="primary" />}
                        id="prevailing_rate"
                        name="prevailing_rate"
                        label="Prevailing Rate"
                        value={values.prevailing_rate}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
                        onChange={() => {setValues({...values, certified_payroll: !values.certified_payroll})}}
                        control={<Switch checked={values.certified_payroll} color="primary" />}
                        id="certified_payroll"
                        name="certified_payroll"
                        label="Certified Payroll"
                        value={values.certified_payroll}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
                        onChange={() => {setValues({...values, union: !values.union})}}
                        control={<Switch checked={values.union} color="primary" />}
                        id="union"
                        name="union"
                        label="Union"
                        value={values.union}
                    />
                </Stack>
                <Stack 
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    <FormControlLabel
                        sx={{width: '33%'}}
                        onChange={() => {setValues({...values, travel_job: !values.travel_job})}}
                        control={<Switch checked={values.travel_job} color="primary" />}
                        id="travel_job"
                        name="travel_job"
                        label="Travel Job"
                        value={values.travel_job}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
                        onChange={() => {setValues({...values, material_only: !values.material_only})}}
                        control={<Switch checked={values.material_only} color="primary" />}
                        id="material_only"
                        name="material_only"
                        label="Material Only"
                        value={values.material_only}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
                        onChange={() => {setValues({...values, tax_exempt: !values.tax_exempt})}}
                        control={<Switch checked={values.tax_exempt} color="primary" />}
                        id="tax_exempt"
                        name="tax_exempt"
                        label="Tax Exempt"
                        value={values.tax_exempt}
                    />

                </Stack>
                <Divider/>
                <AddressPicker
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                    values={values}
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                />
                <CustomerPicker
                    checked={checked}
                    setChecked={setChecked}
                    contacts={contacts}
                    setContacts={setContacts}
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                    values={values}
                    errors={errors}
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                    updateContact={updateContact}
                    project={true}
                />
                <Stack 
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    <TextField
                        autoFocus={false}
                        id="terms"
                        name='terms'
                        label="Terms"
                        onChange={handleInputValue}
                        multiline
                        rows={3}
                        value={values.terms}
                        fullWidth
                        variant="outlined"
                        helperText={errors.terms === null ? '' : errors.terms}
                        error={errors.terms? true : false}
                    />
                    <TextField
                        autoFocus={false}
                        id="notes"
                        name='notes'
                        label="Notes"
                        onChange={handleInputValue}
                        multiline
                        rows={3}
                        value={values.notes}
                        fullWidth
                        variant="outlined"
                    />
                </Stack>
                <BillingOrderTypePickers
                    token={token}
                    user={user}
                    values={values}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                    clear={clear}
                    setClear={setClear}
                />
                <TextField
                        autoFocus={false}
                        margin="dense"
                        id="price"
                        name='price'
                        label="Price"
                        onChange={handleInputValue}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        value={values.price}
                        type="number"
                        fullWidth
                        variant="outlined"
                        helperText={errors.price === null ? '' : errors.price}
                        error={errors.price? true : false}
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
                        // onClick={createProject}
                        variant='contained' 
                        size='large' 
                        color={`${isValid? 'secondary' : 'error'}`}
                    >Submit</Button>
                </Stack>

            

            </Stack>
            <ConfirmationDialogProject
                open={openConfirmation}
                setOpen={setOpenConfirmation}
                confirmation={confirmation}
                setConfirmation={setConfirmation}
            />
        </Box>
    );
};
