import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import ContactServices from '../services/Contact.services';
import ProjectDataService from '../services/Project.services';
import ProjectCategoryService from '../services/ProjectCategory.services';
import ProjectTypeService from '../services/ProjectType.services';
import TaskDataService from '../services/Task.services'
import { Stack, Box, Divider, Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import OpportunityPicker from './OpportunityPicker';
import ProjectPicker from './ProjectPicker';
import ProjectButtons from './ProjectButtons';
import CategoryTypePickers from './CategoryTypePickers';
import BillingOrderTypePickers from './BillingOrderTypePickers';
import AddressPicker from './AddressPicker';
import AddressPickerRef from './AddressPickerRef';
import CustomerPicker from './CustomerPicker';
import ConfirmationDialogProject from './ConfirmationDialogProject';
import VerificationDialogProject from './VerificationDialogProject';
import LoadingBackdrop from './LoadingBackdrop';
import { useNavigate } from 'react-router-dom';


//! to do notes
/*

- Need to make clear work on QuotePicker
- make contacts update on ProjectEdit
- Add create service and hse in data base
*/ 
export default function ProjectForm(props) {
    const { user, token, handleOpenSnackbar, darkState} = props;
    const { editing } = props;
    const { log, projectTypeLog, projectLog, setOpenLog } = props;
    const [ projectType, setProjectType ] = useState(1); // project type
    const [ clear, setClear ] = useState(false);
    const [ contacts, setContacts ] = useState('');
    const [ editContacts, setEditContacts ] = useState([]);
    const [ difference, setDifference ] = useState([]);
    const [ checkedTask, setCheckedTask ] = React.useState([]);
    const [ checked, setChecked ] = React.useState([]);
    const [ isCreateTask, setIsCreateTask ] = useState(true);
    const [ backdrop, setBackdrop ] = useState(false);
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ quote , setQuote ] = useState('');
    const [ project , setProject ] = useState('');
    const [ categoryCode, setCategoryCode ] = useState('');
    const [ typeCode , setTypeCode ] = useState('');
    const [ openVerification, setOpenVerification ] = useState(false);
    const [ openConfirmation, setOpenConfirmation ] = React.useState(false);
    const [ isUpdateContact, setIsUpdateContact ] = useState(false);
    const [ isDisabled, setIsDisabled ] = useState(false);
    const didMount = useRef(false);
    let navigate = useNavigate();

    useLayoutEffect(() => {
        if(projectLog){
            setTimeout(() => {
                handleChangeProject(projectLog)
                setProjectType(projectTypeLog)
            }, 500);
        }
    },[projectLog, projectTypeLog])

    useEffect(() => {
        if(project && editing || projectLog && editing){
            setIsDisabled(false);
        }
        else if (!editing){
            setIsDisabled(false);
        }else{
            setIsDisabled(true);
        }
        
    },[project])

    const initialValues = {
        is_active: true,
        number: '',
        name:'',
        project_category:'',
        project_type:'',
        address:'',
        customer: '',
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
        po_number: '',
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
        customer:'',
        price:'',
    };

    const [ errors, setErrors ] = useState(initialErrors);
    const [ isValid, setIsValid ] = useState(true);

    const initialConfirmation = {
        database: null, //! working
        task: null, //! needs to be updated
        folder: null, //! working
    };

    const [ confirmation, setConfirmation ] = useState(initialConfirmation);

    useEffect(() => {
        if(!editing){
            retrieveNextProjectNumber();
        }
    },[projectType, clear]);

    useEffect(() =>{
        if (didMount.current && values.project_category && values.project_type) {
            retrieveCategory();
            retrieveType();
        } else {
            didMount.current = true;
        }
    }, [values.project_category, values.project_type]);

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
            setProject('')
            handleClearInputs();
        } else {
            didMount.current = true;
        }
    },[projectType]);

    useEffect(() => {
        if (didMount.current) {
            if(isSubmitted){
                setBackdrop(isNull(confirmation))
            }
        } else {
            didMount.current = true;
        }
    },[confirmation, isSubmitted]);

    useEffect(() => {
        if (didMount.current) {
            // if project pk is updated and isUpdateContact is true
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
        // add and remove contacts here for edit
        if (didMount.current) {
            if(project){
                setDifference(checked
                    .filter(x => !editContacts.includes(x))
                    .concat(editContacts.filter(x => !checked.includes(x)))
                )
            }
        } else {
            didMount.current = true;
        }
    },[checked]);
    
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

    const getLastProject = () => {
        ProjectDataService.getLastProject(token)
        .then(response => {
            checked.map((t) =>{
                var fullTask = t;
                fullTask = {...t, project : response.data.last_project_id};
                createTask(fullTask);
            })
        })
        .catch( e => {
            console.log(e);
        })
    };

    const handleChangeQuote = (quote) => {
        setQuote(quote);
        if(quote){
            handleClearInputs();
            setValues((prevState) => ({
                ...prevState,
                name: quote.name,
                project_category: quote.project_category.id,
                project_type: quote.project_type.id,
                prevailing_rate: quote.prevailing_rate,
                travel_job: quote.travel_job,
                notes: quote.notes,
                price: quote.price
            }));
        }else{
            handleClearInputs();
        }
    };

    const handleChangeProject= (project) => {
        setProject(project);
        if(project){
            handleClearInputs();
            setValues((prevState) => ({
                ...prevState,
                number: project.number,
                name: project.name,
                project_category: project.project_category.id,
                project_type: project.project_type.id,
                address: project.address? project.address.id : '',
                customer: project.customer.id,
                prevailing_rate: project.prevailing_rate,
                union: project.union,
                certified_payroll: project.certified_payroll,
                material_only: project.material_only,
                travel_job: project.travel_job,
                tax_exempt: project.tax_exempt,
                billing_type: project.billing_type.id,
                order_type: project.order_type.id,
                terms: project.terms,
                notes: project.notes,
                price: project.price,
                po_number: project.po_number
            }));
        }else{
            handleClearInputs();
        }
    };
    
    const getProjects = () => {
        ProjectDataService.getAll(token)
        .then(response => {
            let updatedTaskList = []
            if(isCreateTask && checkedTask.length > 0){
                checkedTask.map((t) => {
                    var fullTask = {};
                    fullTask = {...t, project : response.data[0].id};
                    updatedTaskList.push(fullTask)
                });

                updatedTaskList.map((t) => {
                    createTask(t);
                })
            } else {
                setConfirmation((prevState) => ({
                    ...prevState,
                    task: true,
                }));
                setTimeout(() => {
                    createFolder();
                }, 1000);
            }
            if(checked.length > 0){
                let updatedList = []
                checked.map((c) => {
                    updatedList.push({...c, projects: [...c.projects, response.data[0].id]})
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

    const createProject = () => {
        switch(projectType) {
            case 2:
                ProjectDataService.createService(values, token)
                .then(response => {
                    setConfirmation((prevState) => ({
                        ...prevState,
                        database: true,
                    }));
                    getProjects();
                })
                .catch( e => {
                    console.log(e);
                    setConfirmation((prevState) => ({
                        ...prevState,
                        database: false,
                    }));
                    setOpenConfirmation(true);
                })
                break;
            case 3:
                ProjectDataService.createHSE(values, token)
                .then(response => {
                    setConfirmation((prevState) => ({
                        ...prevState,
                        database: true,
                    }));
                    getProjects();
                })
                .catch( e => {
                    console.log(e);
                    setConfirmation((prevState) => ({
                        ...prevState,
                        database: false,
                    }));
                    setOpenConfirmation(true);
                })
                break;
            default:
                ProjectDataService.createService(values, token)
                .then(response => {
                    setConfirmation((prevState) => ({
                        ...prevState,
                        database: true,
                    }));
                    getProjects();
                })
                .catch( e => {
                    console.log(e);
                    setConfirmation((prevState) => ({
                        ...prevState,
                        database: false,
                    }));
                    setOpenConfirmation(true);
                })
        }
    };

    const updateProject = () => {
        switch(projectType) {
            case 2:
                ProjectDataService.updateService(project.id, values, token)
                    .then(response => {
                        handleOpenSnackbar('info', 'Service was updated');
                        setProject('');
                        handleClearInputs();
                        if(projectLog){setOpenLog(false)}else{navigate('/');}

                    })
                    .catch( e => {
                        console.log(e);
                        handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
                    });
                break;
            case 3:
                ProjectDataService.updateHSE(project.id, values, token)
                    .then(response => {
                        handleOpenSnackbar('info', 'HSE was updated');
                        setProject('');
                        handleClearInputs();
                        if(projectLog){setOpenLog(false)}else{navigate('/');}
                    })
                    .catch( e => {
                        console.log(e);
                        handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
                    });
                break;
            default:
                ProjectDataService.updateProject(project.id, values, token)
                    .then(response => {
                        handleOpenSnackbar('info', 'Project Database was updated');
                        setProject('');
                        handleClearInputs();
                        if(projectLog){setOpenLog(false)}else{navigate('/');}
                    })
                    .catch( e => {
                        console.log(e);
                        handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
                    });
            };
            const existingDir = `${project.number} ${project.name} ${project.project_category.code}-${project.project_type.code}`
            const newDir = `${project.number} ${values.name} ${categoryCode}-${typeCode}`
            // if name, category, or type changed update folder name.
            if (existingDir !== newDir){
                renameFolder(existingDir, newDir)
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

    const createFolder = () => {
        // send object with folderName and projectType to electron. 
        const folderName = `${values.number} ${values.name} ${categoryCode}-${typeCode}`;
        const inputs = JSON.stringify({folderName: folderName, projectType: projectType});
        window.api.createProjectFolder(inputs)
        .then(data => {
            setConfirmation((prevState) => ({
                ...prevState,
                folder: data,
            }));
            setOpenConfirmation(true); 
        });
    };

    const renameFolder = (existingDir, newDir) => {
        // send data to electron for renaming folder
        const inputs = [existingDir, newDir, projectType]
        window.api.renameProjectFolder(inputs)
        .then(data => {
            if (data){
                setTimeout(() => {
                    handleOpenSnackbar('info', 'Project folder was renamed');
                }, 500);
                
            }else{
                setTimeout(() => {
                    handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
                }, 500);
            }

        });

    };

    const createTask = (task) => {
        TaskDataService.createTask(task, token)
            .then(response => {
                setConfirmation((prevState) => ({
                    ...prevState,
                    task: true,
                }));
                setTimeout(() => {
                    createFolder();
                }, 1000);
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

    // ---------------------------contact API's  ---------------------------------

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

    const openFolder = () => {
        // send path to electron to open folder
        window.api.openFolder();
        
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
        setCheckedTask([]);
        setConfirmation(initialConfirmation);
        setIsSubmitted(false);
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
        else if(values.customer === undefined){
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

        if(editing){
            return formIsValid? updateProject() : null
        }else{
            return formIsValid ? setOpenVerification(!openVerification) : null
        }
        
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        createProject();
        
    };

    return ( 
        <Box sx={{mr:3, ml:3}}>
            <Stack spacing={2}>
            {log? '': 
            <div>
            {editing? 
                <ProjectPicker
                token={token}
                handleOpenSnackbar={handleOpenSnackbar}
                handleChangeProject={handleChangeProject}
                projectType={projectType}
                clear={clear}
                setClear={setClear}
                /> 
                :
                <OpportunityPicker
                    token={token}
                    handleOpenSnackbar={handleOpenSnackbar}
                    handleChangeQuote={handleChangeQuote}
                    clear={clear}
                    setClear={setClear}
                />
            }
            </div>
            }
            {log? '' :
            <ProjectButtons
                darkState={darkState}
                projectType={projectType}
                handleChangeProjectType={handleChangeProjectType}
            />
            }
            <Divider/>
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
                <CategoryTypePickers
                    token={token}
                    user={user}
                    values={values}
                    quote={quote}
                    project={project}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                    clear={clear}
                    setClear={setClear}
                    isDisabled={isDisabled}
                />
                <Divider/>
                <Stack 
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
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
                    <FormControlLabel
                        sx={{width: '33%'}}
                        disabled={isDisabled}
                        onChange={() => {setValues({...values, certified_payroll: !values.certified_payroll})}}
                        control={<Switch checked={values.certified_payroll} color="primary" />}
                        id="certified_payroll"
                        name="certified_payroll"
                        label="Certified Payroll"
                        value={values.certified_payroll}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
                        disabled={isDisabled}
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
                        onChange={() => {setValues({...values, material_only: !values.material_only})}}
                        control={<Switch checked={values.material_only} color="primary" />}
                        id="material_only"
                        name="material_only"
                        label="Material Only"
                        value={values.material_only}
                    />
                    <FormControlLabel
                        sx={{width: '33%'}}
                        disabled={isDisabled}
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
                    quote={quote}
                    project={project}
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                    isDisabled={isDisabled}
                />
                {/* <AddressPickerRef
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                /> */}
                <CustomerPicker
                    checked={checked}
                    setChecked={setChecked}
                    contacts={contacts}
                    setContacts={setContacts}
                    token={token} 
                    handleOpenSnackbar={handleOpenSnackbar}
                    values={values}
                    errors={errors}
                    quote={project} //! needs to only be one customer.
                    setValues={setValues}
                    clear={clear}
                    setClear={setClear}
                    updateContact={updateContact}
                    project={true}
                    isDisabled={isDisabled}
                    difference={difference}
                    setEditContacts={setEditContacts}
                    projectType={projectType}
                />
                <Stack 
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    <TextField
                        autoFocus={false}
                        disabled={isDisabled}
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
                        disabled={isDisabled}
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
                    project={project}
                    errors={errors}
                    handleInputValue={handleInputValue}
                    clear={clear}
                    setClear={setClear}
                    isDisabled={isDisabled}
                />
                <Stack 
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
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
                        helperText={errors.price === null ? '' : errors.price}
                        error={errors.price? true : false}
                    />
                    <TextField
                        autoFocus={false}
                        disabled={isDisabled}
                        margin="dense"
                        id="po_number"
                        name='po_number'
                        label="PO or Contract Number"
                        onChange={handleInputValue}
                        value={values.po_number}
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                </Stack>
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
                        // onClick={handleSubmit}
                        // onClick={() => setOpenVerification(!openVerification)}
                        // onClick={() => setOpenConfirmation(!openConfirmation)}
                        disabled={isDisabled}
                        variant='contained' 
                        size='large' 
                        color={editing? `${isValid? 'primary' : 'error'}` : `${isValid? 'secondary' : 'error'}`}
                    >{editing? 'Update' : 'Submit'}</Button>
                </Stack>
            </Stack>
            <ConfirmationDialogProject
                open={openConfirmation}
                setOpen={setOpenConfirmation}
                confirmation={confirmation}
                setConfirmation={setConfirmation}
                openFolder={openFolder}
                handleClearInputs={handleClearInputs}
                isCreateTask={isCreateTask}
            />
            <VerificationDialogProject
                user={user}
                token={token}
                handleOpenSnackbar={handleOpenSnackbar}
                open={openVerification}
                setOpen={setOpenVerification}
                projectType={projectType}
                isCreateTask={isCreateTask}
                setIsCreateTask={setIsCreateTask}
                values={values}
                checked={checkedTask}
                setChecked={setCheckedTask}
                submit={handleSubmit}
                getLastProject={getLastProject}
            />
            <LoadingBackdrop
                open={typeof backdrop == "boolean"? backdrop : true}
            />
        </Box>
    );
};

