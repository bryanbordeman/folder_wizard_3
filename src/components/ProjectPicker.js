import React, { useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ProjectDataService from '../services/Project.services';

export default function ProjectPicker(props) {
    const { token, clear, setClear } = props;
    const [ value, setValue ] = useState(null);
    const [ quotes, setQuotes ] = useState([{}])
    const [ inputValue, setInputValue ] = useState('');
    const [ typeString, setTypeString ] = useState('');
    
    const { handleChangeProject, projectType } = props

    React.useEffect(() => {
        switch(projectType) {
            case 2:
                setTypeString('Service')
                retrieveServices()
                break;
            case 3:
                setTypeString('HSE')
                retrieveHSEs()
                break;
            default:
                setTypeString('Project')
                retrieveProjects()
        }
    },[projectType])
  
    // useEffect(()=> {
    //     //! NOT WORKING!!
    //     if(clear){
    //         setValue(null);
    //         setClear(false);
    //     };
    // },[clear])

    const retrieveProjects = () => {
        ProjectDataService.getAll(token)
        .then(response => {
            setQuotes(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const retrieveServices = () => {
        ProjectDataService.getAllServices(token)
        .then(response => {
            setQuotes(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const retrieveHSEs = () => {
        ProjectDataService.getAllHSEs(token)
        .then(response => {
            setQuotes(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const handleInputValue = (newValue) => {
        setValue(newValue);
        handleChangeProject(newValue)
    };


    return (  
        <Autocomplete
            disablePortal
            fullWidth
            autoSelect = {false}
            blurOnSelect = 'touch'
            // value={editing? editObject.project : value}
            value={value}
            onChange={(event, newValue) => {
                handleInputValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={quotes}
            isOptionEqualToValue={(option, newValue) => {
                return option.id === newValue.id;
            }}
            getOptionLabel={(option) => `${option.number} ${option.name}`}
            renderInput={(params) => <TextField 
                                    // helperText={errors.quote === null ? '' : errors.quote}
                                    // error={errors.quote? true : false}
                                    {...params} 
                                    id="project"
                                    name='project'
                                    label={`Search ${typeString}'s`}
                                    variant="standard"
                                    />}
        />
    );
}

