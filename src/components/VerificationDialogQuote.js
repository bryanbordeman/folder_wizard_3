import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Transition from './DialogTransistion'
import  Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import AssigneePicker from './AssigneePicker';
import { Stack, TextField,IconButton} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationDialogQuote from './ConfirmationDialogQuote';

export default function VerificationDialogQuote(props) {
    const { user, token } = props;
    const { confirmation, setConfirmation, setIsSubmitted, setBackdrop, handleClearInputs } = props;
    const { open, setOpen, values, createQuote, getQuotes, openFolder } = props;
    const { isCreateTask, setIsCreateTask } = props;
    const { openConfirmation, setOpenConfirmation } = props;
    const [ isValid, setIsValid ] = React.useState(true);

    const initialFormValues = {
        created_by: user.id,
        assignee: user.id,
        tasklist: 1,
        title:'Proposal / Estimate',
        notes:'Task generated from Folder Wizard',
        due: values.due,
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

    const { task, setTask } = props;

    const initialErrors = {
        title:'',
        notes: '',
    };
    const [ errors, setErrors ] = React.useState(initialErrors);

    React.useLayoutEffect(() => {
        setTask(initialFormValues)
    },[open]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateQuote = () => {
        createQuote();
    };

    const handleValidation = () => {
        let formIsValid = true;

        if(isCreateTask){
            if(task.title === ''){
                setErrors({...errors, title: 'Required field'});
                formIsValid = false;
                setTimeout(() => {
                    formIsValid = true;
                    setErrors({...errors, title: null});
                }, 3000);
            }
            else if(task.notes === ''){
                setErrors({...errors, notes: 'Required field'});
                formIsValid = false;
                setTimeout(() => {
                    formIsValid = true;
                    setErrors({...errors, notes: null});
                }, 3000);
            }

            setIsValid(formIsValid)
            setTimeout(() => {
                setIsValid(true);
            }, 3000);
        };
        return formIsValid ? handleSubmit() : null
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        handleCreateQuote();
        setOpen(false);
    }

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setTask({
        ...task,
        [name]: value
        });
    };

    const handleChangeAssignee = (newValue) => {
        if(newValue){
            setTask({
            ...task,
            assignee: newValue
            });
        };
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
                            Create Opportunity {values.number}?
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
                    <FormControlLabel
                        onChange={() => {setIsCreateTask(!isCreateTask)}}
                        control={<Switch checked={isCreateTask} color="primary" />}
                        id="create_task"
                        name="create_task"
                        label="Create Task?"
                        value={isCreateTask}
                    />
                    <AssigneePicker
                        isCreateTask={isCreateTask}
                        errors={errors}
                        user={user}
                        token={token}
                        open={open}
                        handleChangeAssignee={handleChangeAssignee}
                    />
                    
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            disabled={isCreateTask? false: true}
                            label="Due Date"
                            id="due"
                            name="due"
                            value={task.due}
                            onChange={(date) => {setTask({...task, due: date})}}
                            renderInput={(params) => <TextField {...params} helperText={errors.due === null ? '' : errors.due}
                            error={errors.due? true : false} />}
                            fullWidth
                        />
                    </LocalizationProvider>
                    <TextField
                        disabled={isCreateTask? false: true}
                        autoFocus={false}
                        margin="dense"
                        id="title"
                        name='title'
                        label="Title"
                        onChange={handleInputValue}
                        value={task.title}
                        type="text"
                        fullWidth
                        variant="outlined"
                        helperText={errors.title === null ? '' : errors.title}
                        error={errors.title? true : false}
                    />
                    <TextField
                        disabled={isCreateTask? false: true}
                        autoFocus={false}
                        id="notes"
                        name="notes"
                        label="Task"
                        onChange={handleInputValue}
                        value={task.notes}
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
                // onClick={handleValidation}
                color={`${isValid? 'secondary' : 'error'}`}
            >
                Create
            </Button>
            </DialogActions>
        </Dialog>
        <ConfirmationDialogQuote
            open={openConfirmation}
            isCreateTask={isCreateTask}
            createQuote={createQuote}
            openFolder={openFolder}
            task={task}
            setOpen={setOpenConfirmation}
            values={values}
            getQuotes={getQuotes}
            confirmation={confirmation}
            setConfirmation={setConfirmation}
            setIsSubmitted={setIsSubmitted}
            setBackdrop={setBackdrop}
            setIsCreateTask={setIsCreateTask}
            handleClearInputs={handleClearInputs}
        />
    </div>
    );
};
