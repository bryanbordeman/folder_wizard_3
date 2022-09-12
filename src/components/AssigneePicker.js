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
        setValue(user);
    },[open])

 
    const retrieveEmployees = () => {
        UserService.getUsers(token)
        .then(response => {
            const obj = response.data;
            const managersList = [];
            obj.map(manager => (
                manager.groups.filter(group => (group.name === 'SALES')).length > 0 ? 
                managersList.push(manager) : ''
            ))
            setAssignees(managersList);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const handleInputValue = (newValue) => {
        setValue(newValue);
        handleChangeAssignee(newValue);
    };

    return (
        <Autocomplete
            disabled={isCreateTask? false: true}
            clearOnEscape
            disablePortal
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
            renderInput={(params) => <TextField 
                                    helperText={errors && errors.assignee? errors.assignee : ''}
                                    error={errors && errors.assignee? true : false}
                                    {...params} 
                                    // value={employee}
                                    id="assignee"
                                    name='assignee'
                                    label="Search Assignees" 
                                    />}
        />
    );
};