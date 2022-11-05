import React, { useEffect, useState, useRef } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Stack, Box } from '@mui/material';
import  Divider from '@mui/material/Divider';
import ManagerPicker from './ManagerPicker';
import CategoryTypePickers from './CategoryTypePickers';
import AddressPicker from './AddressPicker';
import CustomerPicker from './CustomerPicker';
import QuoteDataService from '../services/Quote.services';
import TaskDataService from '../services/Task.services'
import ProjectCategoryService from '../services/ProjectCategory.services';
import ProjectTypeService from '../services/ProjectType.services';
import ContactServices from '../services/Contact.services';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import VerificationDialogQuote from './VerificationDialogQuote'
import LoadingBackdrop from './LoadingBackdrop';

export default function OpportunityForm(props) {
    const { token, user, handleOpenSnackbar } = props;
    const [ contacts, setContacts ] = useState('');
    const [ checked, setChecked ] = React.useState([]);
    const [ clear, setClear ] = useState(false);
    const [ isValid, setIsValid ] = useState(true);
    const [ openVerification, setOpenVerification ] = useState(false);
    const [ openConfirmation, setOpenConfirmation ] = useState(false);
    const [ isCreateTask, setIsCreateTask ] = useState(true);
    const [ task, setTask ] = useState('');
    const [ backdrop, setBackdrop ] = useState(false);
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ categoryCode, setCategoryCode ] = useState('');
    const [ typeCode , setTypeCode ] = useState('');
    const [ isUpdateContact, setIsUpdateContact ] = useState(false);


    const didMount = useRef(false);

    const initialConfirmation = {
        database: null, 
        task: null,
        folder: null,
    };

    const [ confirmation, setConfirmation ] = useState(initialConfirmation);
    
    const initialValues = {
        is_active: true,
        number: '',
        name:'',
        due: new Date(),
        project_category:'',
        project_type:'',
        manager: user.id,
        address:'',
        customers:[],
        prevailing_rate: false,
        travel_job: false,
        notes:''
    };

    const [ values, setValues ] = React.useState(initialValues);

    const initialErrors = {
        name:'',
        due: '',
        project_category:'',
        project_type:'',
        manager: '',
        address:'',
        customers:'',
    };

    const [ errors, setErrors ] = useState(initialErrors);

    useEffect(() => {
        retrieveNextQuoteNumber();
    },[]);

    const isNull = (object) =>{
        let isNullish = false
        Object.values(object).some(value => {
            if (value === null) {
                isNullish = true;
            }
            });
        return isNullish
    };

    useEffect(() => {
        if (didMount.current) {
            if(isSubmitted)
                { setBackdrop(isNull(confirmation))}
        } else {
            didMount.current = true;
        }
    },[confirmation, isSubmitted]);

    useEffect(() => {
        if (didMount.current) {
            // if quote pk is updated and create task is true
            if (task.quote > 0 && isCreateTask) {
                createTask();
            }
        } else {
            didMount.current = true;
        }
    }, [task.quote]);

    useEffect(() => {
        if (didMount.current) {
            // if quote pk is updated and isUpdateContact is true
            if (isUpdateContact) {
                checked.map((c) => {
                    updateContact(c.id, c)
                });
            }
        } else {
            didMount.current = true;
        }
    }, [isUpdateContact]);

    useEffect(() => {
        if (didMount.current) {
            // if quote pk is updated and create task is true
            if (confirmation.folder === false) {
                retrieveLastQuote();
            }
        } else {
            didMount.current = true;
        }
    }, [confirmation.folder]);

    useEffect(() =>{
        if (didMount.current && values.project_category && values.project_type) {
            retrieveCategory();
            retrieveType();
        } else {
            didMount.current = true;
        }
    }, [values.project_category, values.project_type])

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
    };

    const retrieveLastQuote= () => {
        QuoteDataService.getLastQuote(token)
        .then(response => {
            if (confirmation.folder === false) {
                deleteQuote(response.data.last_quote_id)
            }
        })
        .catch( e => {
            console.log(e);
        })
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

    const createQuote = () => {
        QuoteDataService.createQuote(values, token)
        .then(response => {
            setConfirmation((prevState) => ({
                ...prevState,
                database: true,
            }));
                if(isCreateTask || checked.length > 0){
                    getQuotes();
                }
                else {
                    createFolder();
                    // setOpenConfirmation(true);
                };
        })
        .catch( e => {
            console.log(e);
            setConfirmation((prevState) => ({
                ...prevState,
                database: false,
            }));
            setOpenConfirmation(true);
            // handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        })
    };

    const deleteQuote= (quoteId) => {
        QuoteDataService.deleteQuote(quoteId, token)
        .then(response => {

        })
        .catch( e => {
            console.log(e);
        });

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

    // ---------------------------------

    const getQuotes = () => {
        QuoteDataService.getAll(token)
        .then(response => {
            if(isCreateTask){
                setTask({...task, quote : response.data[0].id});
            }
            if(checked.length > 0){
                let updatedList = []
                checked.map((c) => {
                    updatedList.push({...c, quotes: [...c.quotes, response.data[0].id]})
                });
                setChecked(updatedList);
                setIsUpdateContact(true);
            }
        })
        .catch( e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        })
    };

    const createTask = () => {
        TaskDataService.createTask(task, token)
            .then(response => {
                setConfirmation((prevState) => ({
                    ...prevState,
                    task: true,
                }));
                // console.log(confirmation.task)
                setTimeout(() => {
                    createFolder();
                }, 500);
            })
            .catch(e => {
                console.log(e);
                setConfirmation((prevState) => ({
                    ...prevState,
                    task: false,
                }));
                setOpenConfirmation(true);
            });
    };

    const createFolder = () => {
        const folderName = `${values.number} ${values.name} ${categoryCode}-${typeCode}`
        // send data to electron for folder creation
        window.api.createOppFolder(folderName)
        .then(data => {
            setConfirmation((prevState) => ({
                ...prevState,
                folder: data,
            }));
        });
        setOpenConfirmation(true);
    };

    const openFolder = () => {
        // send path to electron to open folder
        window.api.openFolder();
        
    };

    const handleSubmit = () => {
        setOpenVerification(true);
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
        retrieveNextQuoteNumber();
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
                        onChange={() => {setValues({...values, travel_job: !values.travel_job})}}
                        control={<Switch checked={values.travel_job} color="primary" />}
                        id="travel_job"
                        name="travel_job"
                        label="Travel Job"
                        value={values.travel_job}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
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
                        color={`${isValid? 'secondary' : 'error'}`}
                    >Submit</Button>
                </Stack>
            </Stack>
            
            <VerificationDialogQuote
                user={user}
                token={token}
                open={openVerification}
                setOpen={setOpenVerification}
                createQuote={createQuote}
                openFolder={openFolder}
                values={values}
                getQuotes={getQuotes}
                task={task}
                setTask={setTask}
                isCreateTask={isCreateTask}
                setIsCreateTask={setIsCreateTask}
                confirmation={confirmation}
                setConfirmation={setConfirmation}
                setBackdrop={setBackdrop}
                openConfirmation={openConfirmation}
                setOpenConfirmation={setOpenConfirmation}
                setIsSubmitted={setIsSubmitted}
                handleClearInputs={handleClearInputs}
                
            />
            <LoadingBackdrop
                open={typeof backdrop == "boolean"? backdrop : true}
            />
            {/* <button onClick={createFolder}
            >
            Async
            </button> */}
        </Box>
    );
};