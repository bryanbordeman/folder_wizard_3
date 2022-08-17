import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import { Stack } from '@mui/material';
import CategoryList from '../json/projectCategoryList.json'

export default function CategoryTypePickers(props) {
    const { values, setValues, errors, handleInputValue } = props;
    const [ categories, setCategories ] = useState([]);
    const [ types, setTypes ] = useState([]);
    const [ type, setType ] = useState('')
    const [ category, setCategory ] = useState('');

    useEffect(() => {
        setCategories(Object.keys(CategoryList))
    },[])

    const hangleChangeCategory = (e) => {
        setCategory(e.target.value);
        const key = e.target.value
        setTypes(CategoryList[key])
        setValues({...values, category: e.target.value})
    }

    return ( 
        <Stack direction='row' spacing={2}>
            <div style={{width: '100%'}}>
                <InputLabel 
                    id="project-category"
                >
                    Project Category
                </InputLabel>
                <Select
                    fullWidth
                    labelId="project-category"
                    id="project-category"
                    value={category}
                    label="Project Category"
                    onChange={hangleChangeCategory}
                >
                {categories.map((category, key) => (
                    <MenuItem 
                        key={key} 
                        value={category}
                    >   
                        {category}
                    </MenuItem>
                )
                    )}
                </Select>
                    {errors.category && <FormHelperText error={errors.category? true : false}>This is required!</FormHelperText>}
            </div>
            <div style={{width: '100%'}}>
            <InputLabel id="project-type">{category? "Project Type" : "Select Category First"}</InputLabel>
                <Select
                    disabled={category? false: true}
                    fullWidth
                    labelId="project-type"
                    id="project-type"
                    value={values.type}
                    label={category? "Project Type" : "Select Category First"}
                    onChange={handleInputValue}
                >
                {types.map((type, key) => (
                    <MenuItem 
                        key={key} 
                        value={type[1]}
                    >   
                        {type[0]}
                    </MenuItem>
                )
                    )}
                </Select>
                    {errors.type && <FormHelperText error={errors.type? true : false}>This is required!</FormHelperText>}
            </div>
        </Stack>
    );
};