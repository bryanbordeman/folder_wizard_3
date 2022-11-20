import * as React from 'react';
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
import AddContactDialog from './AddContactDialog';
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
    const { user, open, isCreateTask, values, token, handleOpenSnackbar } = props
    const [ users, setUsers ] = React.useState('');
    const [ checked, setChecked ] = React.useState([]);
    const [ task, setTask ] = React.useState('')
    const [ tasks, setTasks ] = React.useState([])
    const [ editTask, setEditTask ] = React.useState('');
    const [ editing, setEditing ] = React.useState(false);
    const [ openTaskForm, setOpenTaskForm ] = React.useState(false);
    const didMount = React.useRef(false);
    
    const [ openCreate, setOpenCreate ] = React.useState(false);
    const [ taskIndex, setTaskIndex ] = React.useState('');

    const typicalTask = [
        {title:'Submittal Drawings', tasklist: 2 },
        {title:'Contract Review', tasklist: 6 },
        {title:'B.O.M', tasklist: 2 },
        {title:'Schedule', tasklist: 2 },
    ]
    const taskTemplate = {
        created_by: user.id,
        assignee: user.id,
        tasklist: '',
        title:'',
        notes:'Task generated from Folder Wizard',
        due: new Date(new Date().getTime()+(7*24*60*60*1000)),
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
                var fullTask = taskTemplate
                fullTask = {...taskTemplate, title : t.title, tasklist: t.tasklist}
                setTasks(oldArray => [...oldArray, fullTask])
            })
        } else {
            didMount.current = true;
        }
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


    const handleChecked = (contact) => {
        // make list of checked contacts
        const isChecked = checked.find(({id}) => id === contact.id) // prevents duplicates
        if(!isChecked){
            // if not already in list add to list
            setChecked(oldArray => [...oldArray, contact]);
        }else{
            // remove from list
            const newList = checked.filter(c => c.id !== contact.id);
            setChecked(newList);
        };
    };

    const handleEdit = (t) => {
        setTaskIndex(tasks.indexOf(t, 0));
        setTask(t);
        setEditing(true);
        setOpenTaskForm(!openTaskForm);
    };

    const handleUpdateTaskList = (t) => {
        const newList = tasks
        newList[taskIndex] = t
        setTasks(newList)
        setOpenTaskForm(false);
        setTask('');
    };

    return (
        
        <div>
            {isCreateTask? 
            <List 
                sx={{ width: '100%', bgcolor: 'background.paper', pb:0 }}
                subheader={<ListSubheader>Select Task(s)</ListSubheader>}
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
                            // checked={checked.find(({id}) => id === t.id)? true : false} 
                        />
                        }
                        disablePadding
                    >
                        <ListItemButton
                            onClick={() => {handleEdit(t)}}
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
                        onClick={() => {setOpenCreate(true)}}
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
                editTask={editTask}
                setOpen={setOpenTaskForm}
                editing={editing}
                setEditing={setEditing}
                user={user}
                token={token}
                handleUpdateTaskList={handleUpdateTaskList}
                // createTask={createTask}
                // updateTask={updateTask}
                handleOpenSnackbar={handleOpenSnackbar}
            />
        </div>
    );
}
