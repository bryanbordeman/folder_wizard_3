import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Stack, Box } from '@mui/material';
import  Divider from '@mui/material/Divider';

export default function OpportunityForm() {
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
            <Stack direction="column" spacing={2}>
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