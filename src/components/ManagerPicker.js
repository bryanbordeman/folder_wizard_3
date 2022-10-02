import React, { useEffect, useState } from 'react';
import UserService from '../services/User.services'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';


export default function ManagerPicker(props) {
    const { token, user, clear, setClear, quote, isDisabled } = props
    const { values, setValues, errors } = props
    const [ managers, setManagers ] = useState([]);
    const [ managerId, setManagerId ] = useState('');

    useEffect(()=> {
        if(clear){
            setManagerId(user.id);
            setValues({...values, manager: user.id})
            setClear(false);
        };
    },[clear]);

    React.useEffect(() => {
        if(quote){
            setManagerId(quote.manager.id);
        };
    },[quote])

    useEffect(() => {
        setManagerId(user.id);
        setValues({...values, manager: user.id})
        retrieveManagers();
    },[]);

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
    };

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
                disabled={isDisabled}
                labelId="manager"
                id="manager"
                // defaultValue={user.id}
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