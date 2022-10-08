import React, { useEffect, useState, useRef } from 'react';
import QuoteDataService from '../services/Quote.services';
import ProjectCategoryService from '../services/ProjectCategory.services';
import ProjectTypeService from '../services/ProjectType.services';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ManagerPicker from './ManagerPicker';
import CategoryTypePickers from './CategoryTypePickers';
import AddressPicker from './AddressPicker';
import CustomerPicker from './CustomerPicker';
import OpportunityPicker from './OpportunityPicker';
import { Stack, Box } from '@mui/material';
import  Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';

export default function OpportunityFormEdit(props) {

    const { token, user, handleOpenSnackbar } = props;
    const [ quote , setQuote ] = useState('');
    const [ isValid, setIsValid ] = useState(true);
    const [ clear, setClear ] = useState(false);
    const [ isDisabled, setIsDisabled ] = useState(true);
    const [ categoryCode, setCategoryCode ] = useState('');
    const [ typeCode , setTypeCode ] = useState('');
    const [ quoteContacts, setQuoteContacts ] = useState([]);
    let navigate = useNavigate();
    const didMount = useRef(false);

    useEffect(() => {
        if(quote){
            setIsDisabled(false);
        }else{
            setIsDisabled(true);
        }
    },[quote])


    const initialValues = {
        is_active: true,
        revision: '',
        price: '',
        number: '',
        name:'',
        due: new Date(),
        project_category:'',
        project_type:'',
        manager: user.id,
        address:'',
        customers:[],
        contacts:[],
        prevailing_rate: false,
        travel_job: false,
        notes:''
    };

    const [ values, setValues ] = React.useState(initialValues);

    useEffect(() =>{
        if (didMount.current && values.project_category && values.project_type) {
            retrieveCategory();
            retrieveType();
        } else {
            didMount.current = true;
        }
    }, [values.project_category, values.project_type])

    const initialErrors = {
        name:'',
        due: '',
        project_category:'',
        project_type:'',
        manager: '',
        address:'',
        customers:'',
        contacts:'',
    };

    const [ errors, setErrors ] = useState(initialErrors);

    const handleChangeQuote = (quote) => {
        setQuote(quote)
        if(quote){
            handleClearInputs();
            setValues(quote);
            setValues((prevState) => ({
                ...prevState,
                project_category: quote.project_category.id,
                project_type: quote.project_type.id,
            }));
        }else{
            handleClearInputs();
        }
    };

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        if(name === 'revision'){
            if (value > -1) {
                setValues({
                    ...values,
                    [name]: value
                    });
            }
        } else {
        setValues({
        ...values,
        [name]: value
        });
    }
    };

    const retrieveCategory = () => {
        ProjectCategoryService.getCategory(values.project_category, token)
        .then(response => {
            setCategoryCode(response.data.code)
        })
        .catch( e => {
            console.log(e);
        })
    };

    const retrieveType = () => {
        ProjectTypeService.getType(values.project_type, token)
        .then(response => {
            setTypeCode(response.data.code)
        })
        .catch( e => {
            console.log(e);
        })
    };

    const handleClearInputs = () => {
        setClear(true);
        setValues(initialValues);
    };

    const updateQuote = () => {
        QuoteDataService.updateQuote(quote.id, values, token)
        .then(response => {
            handleOpenSnackbar('info', 'Your time has been submitted for approval');
            setQuote('');
            handleClearInputs();
            navigate('/');

        })
        .catch( e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const renameFolder = (existingDir, newDir) => {
        // send data to electron for renaming folder
        const inputs = [existingDir, newDir]
        window.api.renameOppFolder(inputs)
        .then(data => {

        });

    };

    const handleSubmit = () => {
        const existingDir = `${quote.number} ${quote.name} ${quote.project_category.code}-${quote.project_type.code}`
        const newDir = `${quote.number} ${values.name} ${categoryCode}-${typeCode}`
        updateQuote();
        if (existingDir !== newDir){
            renameFolder(existingDir, newDir)
        }
        
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

        else if(values.due === null){
            setErrors({...errors, due: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, due: null});
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

    return ( 
        <Box sx={{mr:3, ml:3}}>
            
                <OpportunityPicker
                    token={token}
                    handleOpenSnackbar={handleOpenSnackbar}
                    handleChangeQuote={handleChangeQuote}
                />
                <Stack 
                    sx={{mt:4}}
                    spacing={2}
                >
                <Stack
                    direction="row"
                    spacing={2}
                >
                    <Box>
                    <TextField
                    autoFocus={false}
                    disabled={isDisabled}
                    margin="dense"
                    id="revision"
                    name='revision'
                    label="Revision"
                    onChange={handleInputValue}
                    // inputProps={{ maxLength: 3 }}
                    value={values.revision}
                    type="number"
                    fullWidth
                    variant="outlined"
                    />
                    </Box>
                    <Box sx={{width:'100%'}}>
                    <TextField
                    autoFocus={false}
                    disabled={isDisabled}
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
                
                    />
                    </Box>
                </Stack>
                <TextField
                    autoFocus={false}
                    disabled={isDisabled}
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            disabled={isDisabled}
                            label="Due Date"
                            id="due"
                            name="due"
                            value={values.due}
                            onChange={(date) => {setValues({...values, due: date})}}
                            renderInput={(params) => <TextField {...params} helperText={errors.due === null ? '' : errors.due}
                            error={errors.due? true : false} />}
                            fullWidth
                        />
                    </LocalizationProvider>
                    <FormControlLabel
                        sx={{width: '33%'}}
                        disabled={isDisabled}
                        onChange={() => {setValues({...values, travel_job: !values.travel_job})}}
                        control={<Switch checked={values.travel_job} color="primary" />}
                        id="travel_job"
                        name="travel_job"
                        label="Travel Job"
                        value={values.travel_job}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
                        disabled={isDisabled}
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
                    quote={quote}
                    isDisabled={isDisabled}
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
                    quote={quote}
                    isDisabled={isDisabled}
                />
                <AddressPicker
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                    values={values}
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                    quote={quote}
                    isDisabled={isDisabled}
                />
                <CustomerPicker
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                    values={values}
                    errors={errors}
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                    quote={quote}
                    isDisabled={isDisabled}
                    quoteContacts={quoteContacts}
                    setQuoteContacts={setQuoteContacts}
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
                        disabled={isDisabled}
                        variant='outlined' 
                        size='large'
                    >Clear</Button>
                    <Button 
                        onClick={handleValidation}
                        disabled={isDisabled}
                        variant='contained' 
                        size='large' 
                        color={`${isValid? 'primary' : 'error'}`}
                    >Update</Button>
                </Stack>
            </Stack>
        </Box>

    );
}

