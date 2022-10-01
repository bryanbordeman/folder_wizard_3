import React, { useEffect, useState, useRef } from 'react';
import QuoteDataService from '../services/Quote.services';
import ProjectCategoryService from '../services/ProjectCategory.services';
import ProjectTypeService from '../services/ProjectType.services';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ManagerPicker from './ManagerPicker';
import CategoryTypePickers from './CategoryTypePickers';
import AddressPicker from './AddressPicker';
import CustomerPicker from './CustomerPicker';
import OpportunityPicker from './OpportunityPicker';
import { Stack, Box } from '@mui/material';


export default function OpportunityFormEdit(props) {
    const initialValues = {}
    const { token, user, handleOpenSnackbar } = props;
    const [ quote , setQuote ] = useState({});
    const [ isValid, setIsValid ] = useState(true);
    const [ categoryCode, setCategoryCode ] = useState('');


    const [ values, setValues ] = React.useState(initialValues);

    const handleChangeQuote = (quote) => {
        setQuote(quote)
    }
    

    return ( 
        <Box sx={{mr:3, ml:3}}>
            <Stack spacing={2}>
                <OpportunityPicker
                    token={token}
                    handleOpenSnackbar={handleOpenSnackbar}
                    handleChangeQuote={handleChangeQuote}
                />
            </Stack>
        </Box>

    );
}

