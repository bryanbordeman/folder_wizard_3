import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import OpportunityPicker from './OpportunityPicker';
import ProjectButtons from './ProjectButtons';

export default function ProjectForm(props) {
    const { token, handleChangeQuote, handleOpenSnackbar, darkState} = props;
    const [ projectType, setProjectType ] = useState(''); // project type

    const initialValues = {
        is_active: true,
        number: '',
        name:'',
        project_category:'',
        project_type:'',
        address:'',
        prevailing_rate: false,
        travel_job: false,
        notes:''
    };

    const [ values, setValues ] = React.useState(initialValues);

    const initialErrors = {
        name:'',
        project_category:'',
        project_type:'',
        address:'',
    };

    const [ errors, setErrors ] = useState(initialErrors);

    const handleChangeProjectType = (id) => {
        /*
        set project type 
        {id: 1, name: 'project'},
        {id: 2, name: 'service'},
        {id: 3, name: 'HSE project'}
        */
        setProjectType(id);
    };
    
    return ( 
        <Box sx={{mr:3, ml:3}}>
            <Stack spacing={2}>
            <OpportunityPicker
                    token={token}
                    handleOpenSnackbar={handleOpenSnackbar}
                    handleChangeQuote={handleChangeQuote}
            />
            <ProjectButtons
                darkState={darkState}
                projectType={projectType}
                handleChangeProjectType={handleChangeProjectType}/>

            </Stack>
        </Box>
    );
};

