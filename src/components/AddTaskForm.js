import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField, Divider,IconButton} from '@mui/material';
import AssigneePicker from './AssigneePicker';
// import ProjectPicker from './ProjectPicker';
import TaskListPicker from './TaskListPicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment-timezone';
import Transition from './DialogTransistion'
// import QuoteProjectToggle from './QuoteProjectToggle';
// import QuotePicker from './QuotePicker'
// import { projectType } from './ToggleObjects';

export default function AddTaskForm(props) {
    const { user, token, handleUpdateTaskList } = props;
    const { handleOpenSnackbar } = props;
    const { open, setOpen } = props;
    const { editing, task, setEditing } = props;
    const { createTask } = props;
    const { updateTask } = props;
    const [ isValid, setIsValid ] = React.useState(true);
    const [ errors, setErrors ] = React.useState({});
    // const [ choosePicker, setChoosePicker ] = React.useState('projects')

    const initialFormValues = {
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

    const editFormValues = {
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

    const [ values, setValues ] = React.useState(initialFormValues);

    React.useLayoutEffect(() => {
        setValues(editing ? editFormValues : initialFormValues);
        // if(editing && task.project){
        //     setChoosePicker('projects')
        // }
        // else if (editing && task.quote)
        // {
        //     setChoosePicker('quotes')
        // }
    },[open])
    
    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
        });
    };

    // const handleChangeProject = (newValue) => {

    //     if(newValue && choosePicker === projectType[0].name){
    //         setValues({
    //         ...values,
    //         project: newValue.id
    //         });
    //     }
    //     if(newValue && choosePicker === projectType[1].name){
    //         setValues({
    //         ...values,
    //         quote: newValue.id
    //         });
    //     }
    // };

    const handleChangeAssignee = (newValue) => {
        if(newValue){
            setValues({
            ...values,
            assignee: newValue
            });
        }
    };

    const handleChangeList = (newValue) => {
        if(newValue){
            setValues({
            ...values,
            tasklist: newValue.id
            });
        }
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
    return formIsValid ? handleSubmit() : null
    };

    const handleClose = () => {
        setOpen(!open);
        setEditing(false);
    };

    const handleSubmit = () => {
        if(editing){
            const data = values
            data.created_by = values.created_by.id
            data.due = moment.tz(data.due, "America/New_York")._d
            data.assignee = values.assignee.id === undefined? values.assignee : values.assignee.id
            data.tasklist = values.tasklist.id === undefined? values.tasklist : values.tasklist.id
            data.subtasks = values.subtasks.map(subT => (subT.id))
            updateTask(task.id, data);
        }else{
            createTask(values);
        }
        handleClose();
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
                        <div>
                            {`${editing ? 'Edit' : 'Add'} Task`}
                        </div>
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
                            //! need to fix this because it is setup only to work with users in SALES group.
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
                    onClick={() => handleUpdateTaskList(values)}
                    // onClick={handleValidation}
                    color={`${isValid? 'primary' : 'error'}`}
                >
                    {editing ? 'Update' : 'Submit'}
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};