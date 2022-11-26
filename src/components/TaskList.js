import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import UserServices from '../services/User.services';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import AddTaskForm from './AddTaskForm';

function stringToColor(string) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
};

function stringAvatar(name) {
    return {
        sx: {
        bgcolor: stringToColor(name),
        color: 'white',
        },
        children: `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0].toUpperCase()}`,
    };
};

export default function TasksList(props) {
    const { user, open, isCreateTask, token, handleOpenSnackbar } = props
    const [ users, setUsers ] = React.useState('');
    const { checked, setChecked } = props
    const [ task, setTask ] = React.useState('')
    const [ tasks, setTasks ] = React.useState([]);
    const [ editing, setEditing ] = React.useState(false);
    const [ openTaskForm, setOpenTaskForm ] = React.useState(false);
    const didMount = React.useRef(false);
    
    const [ openCreate, setOpenCreate ] = React.useState(false);
    const [ taskIndex, setTaskIndex ] = React.useState('');
    const { checkedIndex, setCheckedIndex } = props;

    const typicalTask = [
        {title:'Submittal Drawings', tasklist: 2 },
        {title:'Contract Review', tasklist: 6 },
        {title:'B.O.M', tasklist: 2 },
        {title:'Schedule', tasklist: 2 },
    ]
    const taskTemplate = {
        id: '', // temp id to make changes on the frontend as needed
        created_by: user.id,
        assignee: user.id,
        tasklist: '',
        title:'',
        notes:'Task generated from Folder Wizard',
        due: new Date(new Date().getTime()+(7*24*60*60*1000)), // add 7 days to current day,
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

    React.useEffect(() => {
        //on open load task into list
        if (didMount.current) {
            getUsers();
            typicalTask.map((t) => {
                var fullTask = taskTemplate;
                fullTask = {...taskTemplate, id: uuidv4(), title : t.title, tasklist: t.tasklist};
                setTasks(oldArray => [...oldArray, fullTask]);
            });
        } else {
            didMount.current = true;
        };
    },[open]);

    const getUsers = () => {
        UserServices.getUsers(token)
        .then((response) => {
            setUsers(response.data)
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };
    
    const handleChecked = (t) => {
        //make list of checked task
        const index = tasks.indexOf(t, 0);
        const isChecked = checkedIndex.find((i) => i === index); // prevents duplicates
        
        if(isChecked === undefined){
            // if not already in list add to list
            setCheckedIndex(oldArray => [...oldArray, index]);
            setChecked(oldArray => [...oldArray, t]);
        }else{
            // remove from index list 
            const newIndexList = checkedIndex.filter(i => i !== index);
            setCheckedIndex(newIndexList);
            // remove from checked list 
            const newCheckedList = checked.filter((i) => i.title !== t.title);
            setChecked(newCheckedList);
        };
    };

    const handleEdit = (t) => {
        setTaskIndex(tasks.indexOf(t, 0));
        setTask(t);
        setEditing(true);
        setOpenTaskForm(!openTaskForm);
    };

    const handleUpdateTaskList = (t) => {
        const newList = tasks;
        if(editing){
            newList[taskIndex] = t;
        }else{
            newList.push(t);
        };
        // see if this task is checked
        const isTaskChecked = checked.filter((tk) => tk.id === t.id).length > 0? true : false;
        if(isTaskChecked){
            // if checked update task
            let newCheckedList = checked.filter((tk) => tk.id !== t.id);
            newCheckedList.push(t);
            setChecked(newCheckedList);
        };
            setTasks(newList);
            setOpenTaskForm(false);
    };

    const handleAddTaskToList = () =>{
        setEditing(false);
        setOpenTaskForm(true);
    };

    return (
        <div>
            {isCreateTask? 
            <List 
                sx={{ width: '100%', bgcolor: 'background.paper', pb:0 }}
                subheader={<ListSubheader disableSticky={true}>Select Task(s)</ListSubheader>}
                
            >
                {tasks ? tasks.map((t, key) => {
                var taskUser = users? users.find((u) => (u.id === t.assignee)):''
                return (
                    <Box key={key}>
                        {key > 0? <Divider/> : ''}
                    <ListItem
                        secondaryAction={
                        <Checkbox
                            edge="end"
                            onChange={() => handleChecked(t)}
                            checked={checked.find((tk) => tk.id === t.id)? true : false}
                            // checked={checkedIndex.find((i) => i === tasks.indexOf(t, 0))? true : false} 
                        />
                        }
                        disablePadding
                    >
                        <ListItemButton
                            onClick={(e) => {handleEdit(t)}}
                        >
                        <ListItemAvatar>
                            <Avatar {...stringAvatar(`${taskUser.first_name} ${taskUser.last_name}`)}/>
                        </ListItemAvatar>
                            <ListItemText 
                                primary={`${t.title}`}
                                secondary={`Assigned to: ${taskUser.first_name} ${taskUser.last_name}`} />
                        </ListItemButton>
                    </ListItem>
                    </Box>
                );
                }): ''}
                <ListItem sx={{mt:1, mb:1}}>
                    <Button 
                        sx={{width:'100%'}}
                        onClick={handleAddTaskToList}
                        variant='contained' 
                        color='secondary'
                        startIcon={<AddIcon />}
                    >
                        Add Custom Task to List
                    </Button>
                </ListItem>
            </List>
            : ''}
            <AddTaskForm
                task={task}
                open={openTaskForm}
                setOpen={setOpenTaskForm}
                editing={editing}
                setEditing={setEditing}
                user={user}
                token={token}
                handleUpdateTaskList={handleUpdateTaskList}
                handleOpenSnackbar={handleOpenSnackbar}
            />
        </div>
    );
}
