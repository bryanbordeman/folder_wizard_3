import { previousDay } from 'date-fns';
import React, { useEffect, useState } from 'react';
import UserService from '../services/User.services'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';


export default function ManagerPicker(props) {
    const { token, user } = props
    const { values, setValues, errors } = props
    const [ managers, setManagers ] = useState([]);
    const [ managerId, setManagerId ] = useState('');

    useEffect(() => {
        setManagerId(user.id);
        setValues({...values, manager: user.id})
        retrieveManagers();
    },[])

    const retrieveManagers = () => {
        UserService.getUsers(token)
        .then(response => {
            const obj = response.data;
            const managersList = [];
            obj.map(manager => (
                manager.groups.filter(group => (group.name === 'SALES')).length > 0 ? 
                managersList.push(manager) : ''
            ))
            setManagers(managersList);
        })
        .catch( e => {
            console.log(e);
        })
    }

    const hangleChangeManager = (e) => {
        setManagerId(e.target.value);
        setValues({...values, manager: e.target.value})
    }

    return ( 
        <div style={{width: '100%'}}>
            <InputLabel 
                id="manager"
            >
                Manager
            </InputLabel>
            <Select
                fullWidth
                labelId="manager"
                id="manager"
                // defaultValue={""}
                value={managerId}
                label="Manager"
                onChange={hangleChangeManager}
            >
                {managers.map(manager => (
                    <MenuItem 
                        key={manager.id} 
                        value={manager.id}
                    >   
                        {`${manager.first_name} ${manager.last_name}`}
                    </MenuItem>
                )
                    )}
            </Select>
                {errors.manager && <FormHelperText error={errors.manager? true : false}>This is required!</FormHelperText>}
        </div>
    );
};