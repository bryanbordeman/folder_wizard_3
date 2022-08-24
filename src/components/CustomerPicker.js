import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

export default function CustomerPicker() {
    const [ customer, setCustomer ] = useState('');
    const [ customers, setCustomers ] = useState([]);

    const addCustomer = () => {
        setCustomers(oldArray => [...oldArray, customer]);
    };

    const removeCustomer = (name) => {
        setCustomers(customers.filter(item => item !== name))
    };


    return (
        <Stack direction='row' spacing={1}>
            <div style={{width: '100%'}}>
                <Autocomplete
                    freeSolo
                    id="customer"
                    disableClearable
                    value={customer}
                    onChange={(event, newValue) => {
                        setCustomer(newValue)}
                    }
                    options={companies.map((option) => option.name)}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Customer(s)"
                        value={customer}
                        onChange={(e) => {setCustomer(e.target.value)}}
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                    />
                    )}
                />
            </div>
            <IconButton 
                sx={{width: '3.5rem', border: 1, borderColor: "#1BA2F6 !important" }}
                color="primary" 
                aria-label="back"
                onClick={addCustomer}
            >
                <AddIcon />
            </IconButton>
        </Stack>
    );
    }

    const companies =
    [
        {
            "id": 1,
            "name": "National Shielding",
            "fax": null,
            "website": "https://national-shielding.com",
            "address": [],
            "phone": []
        },
        {
            "id": 2,
            "name": "Global Partners in Shielding",
            "fax": null,
            "website": "",
            "address": [
                1
            ],
            "phone": [
                1
            ]
        },
        {
            "id": 3,
            "name": "B.R. Fries & Associates LLC",
            "fax": null,
            "website": "",
            "address": [
                3
            ],
            "phone": [
                1
            ]
        },
        {
            "id": 4,
            "name": "Global Shielding LLC",
            "fax": "",
            "website": "http://www.global-shielding.com",
            "address": [
                6
            ],
            "phone": [
                2
            ]
        }
    ]
