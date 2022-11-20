import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import UserService from '../services/User.services'

export default function AssigneePicker(props) {
    const { handleChangeAssignee, errors, token, open, user, isCreateTask} = props;
    const [ value, setValue ] = React.useState('');

    const [ assignees, setAssignees ] = React.useState([{}]);
    const [ inputValue, setInputValue ] = React.useState('');

    React.useEffect(() => {
        retrieveEmployees();
    },[open])

 
    const retrieveEmployees = () => {
        UserService.getUsers(token)
        .then(response => {
            const obj = response.data;
            const assigneesList = [];
            obj.map(assignee => (
                assignee.groups.filter(group => (group.name === 'SALES')).length > 0 ? 
                assigneesList.push(assignee) : ''
            ))
            setAssignees(assigneesList);
            setValue(user);
            handleChangeAssignee(user.id)
        })
        .catch( e => {
            console.log(e);
        })
    };

    const handleInputValue = (newValue) => {
        setValue(newValue);
        if(newValue){
            handleChangeAssignee(newValue.id);
        }
    };

    return (
        <Autocomplete
            disabled={isCreateTask? false: true}
            clearOnEscape
            // disablePortal
            fullWidth
            autoSelect = {false}
            blurOnSelect = 'touch'
            value={value}
            onChange={(event, newValue) => {
                handleInputValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={assignees}
            getOptionLabel={(option) => (`${option.first_name} ${option.last_name}`)}
            isOptionEqualToValue={(option, newValue) => {
                return option.id === newValue.id;
            }}
            renderInput={(params) => 
                <TextField 
                    helperText={errors && errors.assignee? errors.assignee : ''}
                    error={errors && errors.assignee? true : false}
                    {...params} 
                    id="assignee"
                    name='assignee'
                    label="Search Assignees" 
                />
                }
        />
    );
};