import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Transition from './DialogTransistion'
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Stack,IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TasksList from './TaskList';

export default function VerificationDialogProject(props) {
    const { user, values, projectType, token, handleOpenSnackbar } = props;
    const { open, setOpen } = props;
    const { checked, setChecked } = props;
    const [ checkedIndex, setCheckedIndex ] = React.useState([]);
    const { submit } = props;
    const { isCreateTask, setIsCreateTask } = props;
    const [ dialogTitle, setDialogTitle ] = React.useState('');

    React.useEffect(() => {
        switch(projectType) {
            case 2:
                setDialogTitle(`Create Service ${values.number}?`)
                break;
            case 3:
                setDialogTitle(`Create HSE Order ${values.number}?`)
                break;
            default:
                setDialogTitle(`Create Project ${values.number}?`)
        }
    }, [open])

    const handleClose = () => {
        //! might need to move this
        setChecked([]);
        setCheckedIndex([]);

        setOpen(false);
    };

    const handleSubmit = () => {
        if(isCreateTask && checked.length === 0){
            setIsCreateTask(!isCreateTask);
            submit();
            setOpen(false);
        }else{
            submit();
            setOpen(false);
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
                        <div>
                            {dialogTitle}
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
                        label="Create Task(s)?"
                        value={isCreateTask}
                    />
                    <TasksList
                        user={user}
                        token={token}
                        handleOpenSnackbar={handleOpenSnackbar}
                        values={values}
                        open={open}
                        isCreateTask={isCreateTask}
                        checked={checked}
                        setChecked={setChecked}
                        checkedIndex={checkedIndex}
                        setCheckedIndex={setCheckedIndex}
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
                onClick={handleSubmit}
                color='secondary'
            >
                Create
            </Button>
            </DialogActions>
        </Dialog>
        
    </div>
    );
};
