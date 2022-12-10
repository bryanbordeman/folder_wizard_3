import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField, Divider,IconButton} from '@mui/material';
import AssigneePicker from './AssigneePicker';
import TaskListPicker from './TaskListPicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import Transition from './DialogTransistion';
import Typography from '@mui/material/Typography'
import TaskDataService from '../services/Task.services'

export default function AddTaskForm(props) {
    const { user, token, handleUpdateTaskList } = props;
    const { handleOpenSnackbar } = props;
    const { quote, project } = props
    const { open, setOpen } = props;
    const { editing, task, setEditing } = props;
    const [ isValid, setIsValid ] = React.useState(true);
    const [ errors, setErrors ] = React.useState({});

    const initialFormValues = {
        id: uuidv4(),
        created_by: user.id,
        assignee:'',
        tasklist: '',
        title:'',
        notes:'',
        due: new Date(),
        subtasks:[],
        project:'',
        quote:'',
        created: new Date(),
        is_complete: false,
        is_deleted: false,
        is_read: false,
        completed: new Date(),
        updated: new Date()
    };

    const [ values, setValues ] = React.useState(initialFormValues);

    // const editFormValues = {
    //     id: task.id,
    //     created_by: task.created_by,
    //     assignee: task.assignee,
    //     tasklist: task.tasklist,
    //     title: task.title,
    //     notes: task.notes,
    //     due: editing && task.due !== undefined? task.due : new Date(),
    //     subtasks:task.subtasks,
    //     project:task.project? task.project : '',
    //     quote:task.quote? task.quote : '',
    //     created: new Date(),
    //     is_complete: task.is_complete,
    //     is_deleted: false,
    //     is_read: false,
    //     completed: new Date(),
    //     updated: new Date()
    // };

    // React.useLayoutEffect(() => {
    //     setValues(editing && !quote ? editFormValues : initialFormValues);
    // },[open]);

    React.useLayoutEffect(() => {
        if(quote){
            setValues((prevState) => ({
                ...prevState,
                quote: quote.id,
            }));
        }else if(project){
            setValues((prevState) => ({
                ...prevState,
                project: project.id,
            }));
        }else{
            if(task){
            const editFormValues = {
                id: task.id,
                created_by: task.created_by,
                assignee: task.assignee,
                tasklist: task.tasklist,
                title: task.title,
                notes: task.notes,
                due: editing && task.due !== undefined? task.due : new Date(),
                subtasks:task.subtasks,
                project:task.project? task.project : '',
                quote:task.quote? task.quote : '',
                created: new Date(),
                is_complete: task.is_complete,
                is_deleted: false,
                is_read: false,
                completed: new Date(),
                updated: new Date()
            };
            setValues(editing && !quote && !project? editFormValues : initialFormValues);
        }
        }
    },[open]);

    const createTask = (task) => {
        TaskDataService.createTask(task, token)
            .then(response => {
                handleOpenSnackbar('success', 'Task was created');
            })
            .catch(e => {
                console.log(e);
                handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
            });
        handleClose();
    };
    
    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
        });
    };

    const handleChangeAssignee = (newValue) => {
        if(newValue){
            setValues({
            ...values,
            assignee: newValue
            });
        };
    };

    const handleChangeList = (newValue) => {
        if(newValue){
            setValues({
            ...values,
            tasklist: newValue.id
            });
        };
    };

    const handleValidation = () => {
        let formIsValid = true;
        
        if(values.tasklist === ''){
            setErrors({...errors, tasklist: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, tasklist: null});
            }, 3000);
        }
        else if(values.assignee === ''){
            setErrors({...errors, assignee: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, assignee: null});
            }, 3000);
        }

        else if(values.title.length > 100){
            setErrors({...errors, title: '100 character max.'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, title: null});
            }, 3000);
        }
        else if(values.title.length < 1){
            setErrors({...errors, title: 'Required field'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, title: null});
            }, 3000);
        }
        else if(values.notes.length > 1000){
            setErrors({...errors, notes: '1000 character max.'});
            formIsValid = false;
            setTimeout(() => {
                formIsValid = true;
                setErrors({...errors, notes: null});
            }, 3000);
        }
        
        else{
            setErrors({
                project: null,
                assignee: null,
                quote: null,
                title: null,
                notes: null,
            });
            formIsValid = true;
        }
        setIsValid(formIsValid)
        setTimeout(() => {
            setIsValid(true);
        }, 3000);
    if(quote || project){
        return formIsValid ? createTask(values) : null
    }else{
        return formIsValid ? handleUpdateTaskList(values) : null
    }
    };

    const handleClose = () => {
        setOpen(!open);
        if(!quote && !project){
            setEditing(false);
        }
    };

    return (
        <div>
            <Dialog
                TransitionComponent={Transition}
                fullWidth
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Stack>
                            <Typography variant="h4">
                                {`${editing ? 'Edit' : 'Add'} Task`}
                            </Typography>
                            {quote?
                            <Typography variant="subtitle1">
                                {`${quote.number} ${quote.name}`}
                            </Typography>
                            :''}
                            {project?
                            <Typography variant="subtitle1">
                                {`${project.number} ${project.name}`}
                            </Typography>
                            :''}
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

                <Divider/>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <TaskListPicker
                            editing={editing}
                            task={task}
                            errors={errors}
                            token={token}
                            handleOpenSnackbar={handleOpenSnackbar}
                            handleChangeList={handleChangeList}
                        />
                        <AssigneePicker
                            project={true}
                            editing={editing}
                            task={task}
                            errors={errors}
                            isCreateTask={true}
                            user={user}
                            token={token}
                            handleChangeAssignee={handleChangeAssignee}
                        />
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
                        <TextField
                            autoFocus={false}
                            margin="dense"
                            id="title"
                            name='title'
                            label="Title"
                            onChange={handleInputValue}
                            value={values.title}
                            type="text"
                            fullWidth
                            variant="outlined"
                            helperText={errors.title === null ? '' : errors.title}
                            error={errors.title? true : false}
                        />
                        <TextField
                            autoFocus={false}
                            id="notes"
                            name="notes"
                            label="Task"
                            onChange={handleInputValue}
                            value={values.notes}
                            multiline
                            rows={4}
                            helperText={errors.notes === null ? '' : errors.notes}
                            error={errors.notes? true : false}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                <Button 
                    variant='outlined' 
                    onClick={handleClose}
                >Cancel</Button>
                <Button 
                    variant='contained' 
                    onClick={handleValidation}
                    color={`${isValid? 'primary' : 'error'}`}
                >
                    {editing ? 'Update' : 'Submit'}
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};