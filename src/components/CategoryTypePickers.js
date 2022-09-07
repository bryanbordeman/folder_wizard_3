import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import { FormControl, Stack } from '@mui/material';
import CategoryList from '../json/projectCategoryList.json'
import ProjectCategoryServices from '../services/ProjectCategory.services';
import ProjectTypeServices from '../services/ProjectType.services';

export default function CategoryTypePickers(props) {
    const { token } = props
    const { values, setValues, errors, clear, setClear } = props;
    const [ categories, setCategories ] = useState([]);
    const [ types, setTypes ] = useState([]);
    const [ type, setType ] = useState('');
    const [ category, setCategory ] = useState('');

    useEffect(()=> {
        if(clear){
            setType('');
            setCategory('');
            setClear(false);
        };
    },[clear])

    useEffect(() => {
        retrieveCategories();
    },[])

    useEffect(() => {
        retrieveTypes();
    },[category])

    const retrieveCategories = () => {
        ProjectCategoryServices.getCategories(token)
        .then(response => {
            setCategories(response.data);
            
        })
        .catch( e => {
            console.log(e);
        })
    }

    const retrieveTypes= () => {
        ProjectTypeServices.getTypes(token)
        .then(response => {
            if (category){
                const allTypes = response.data
                setTypes(allTypes.filter(type => type.project_category === category))
            }
        })
        .catch( e => {
            console.log(e);
        })
    }

    const hangleChangeCategory = (e) => {
        setCategory(e.target.value);
        setValues({...values, project_category: e.target.value})
    };

    const hangleChangeType = (e) => {
        setType(e.target.value);
        setValues({...values, project_type: e.target.value})
    };


    return ( 
        <Stack direction='row' spacing={2}>
            <FormControl 
                style={{width: '100%'}}
                error={errors.project_category? true : false}
            >
                <InputLabel 
                    id="project-category"
                >
                    Project Category
                </InputLabel>
                <Select
                    fullWidth
                    labelId="project-category"
                    id="project-category"
                    defaultValue={''}
                    value={category}
                    label="Project Category"
                    onChange={hangleChangeCategory}
                >
                {categories.map((category, key) => (
                    <MenuItem 
                        key={key} 
                        value={category.id}
                    >   
                        {category.name}
                    </MenuItem>
                )
                    )}
                </Select>
                    {errors.project_category && <FormHelperText error={errors.project_category? true : false}>This is required!</FormHelperText>}
            </FormControl>
            <FormControl 
                style={{width: '100%'}}
                error={errors.project_type? true : false}
            >
            <InputLabel id="project-type">{category? "Project Type" : "Select Category First"}</InputLabel>
                <Select
                    disabled={category? false: true}
                    fullWidth
                    labelId="project-type"
                    id="project-type"
                    defaultValue={''}
                    value={type}
                    label={category? "Project Type" : "Select Category First"}
                    onChange={hangleChangeType}
                >
                {types.map((type, key) => (
                    <MenuItem 
                        key={key} 
                        value={type.id}
                    >   
                        {type.name}
                    </MenuItem>
                )
                    )}
                </Select>
                    {errors.project_type && <FormHelperText error={errors.project_type? true : false}>This is required!</FormHelperText>}
            </FormControl>
        </Stack>
    );
};