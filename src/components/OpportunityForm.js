import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import { Stack, Box } from '@mui/material';
import  Divider from '@mui/material/Divider';
import ManagerPicker from './ManagerPicker';
import CategoryTypePickers from './CategoryTypePickers';

export default function OpportunityForm(props) {
    const { token, user } = props
    const [ values, setValues ] = useState({});
    const [ errors, setErrors ] = useState({});

    const handleInputValue = (e) => {
        const { name, value } = e.target;
        setValues({
        ...values,
        [name]: value
        });
    };

    return ( 
        <Box sx={{mr:3, ml:3}}>
            <Stack spacing={2}>
                <TextField
                    autoFocus={false}
                    margin="dense"
                    id="project_name"
                    name='project_name'
                    label="Project Name"
                    onChange={handleInputValue}
                    value={values.project_name}
                    type="text"
                    fullWidth
                    variant="outlined"
                    helperText={errors.project_name === null ? '' : errors.project_name}
                    error={errors.project_name? true : false}
                />
                <CategoryTypePickers
                    token={token}
                    user={user}
                    values={values}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                />
                <ManagerPicker
                    token={token}
                    user={user}
                    values={values}
                    setValues={setValues}
                    errors={errors}
                    handleInputValue={handleInputValue}
                />
                {/* <FormControlLabel
                    onChange={() => {setValues({...values, is_active: !values.is_active})}}
                    control={<Switch checked={values.is_active} color="primary" />}
                    id="is_active"
                    name="is_active"
                    label="Is Active"
                    value={values.is_active}
                /> */}
                <Divider/>
                <Stack direction='row' spacing={1}>
                    <Button variant='outlined'>Clear</Button>
                    <Button variant='contained' color='secondary' >Submit</Button>
                </Stack>
            </Stack>
        </Box>
    );
};