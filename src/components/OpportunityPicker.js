import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import QuoteDataService from '../services/Quote.services';

export default function OpportunityPicker(props) {
    const { token, handleOpenSnackbar } = props;
    const [ value, setValue ] = React.useState(null);
    const [ quotes, setQuotes ] = React.useState([{}])
    const [ inputValue, setInputValue ] = React.useState('');

    const { handleChangeQuote } = props

    React.useEffect(() => {
        retrieveQuotes()
    },[])

    const retrieveQuotes = () => {
        QuoteDataService.getAll(token)
        .then(response => {
            setQuotes(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const handleInputValue = (newValue) => {
        setValue(newValue);
        handleChangeQuote(newValue)
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
                                    id="quote"
                                    name='quote'
                                    label="Search Quotes" 
                                    variant="standard"
                                    />}
        />
    );
}

