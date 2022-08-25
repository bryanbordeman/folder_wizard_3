import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';


import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import { Divider } from '@mui/material';



export default function CustomerPicker() {
    const [ customer, setCustomer ] = useState('');
    const [ customers, setCustomers ] = useState([]);

    const addCustomer = () => {
        setCustomers(oldArray => [...oldArray, customer]);
        setCustomer('');
    };

    const removeCustomer = (name) => {
        setCustomers(customers.filter(item => item !== name))
    };

    function generate(element) {
        return customers.map((value) =>
            React.cloneElement(element, {
            key: value,
            }),
        );
    }


    return (
        <Stack>
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
                sx={{maxHeight: '2.75rem', border: 1, borderColor: "#1BA2F6 !important" }}
                color="primary" 
                aria-label="back"
                onClick={addCustomer}
            >
                <AddIcon />
            </IconButton>
        </Stack>
        <Box>
            <List sx={{mt:3}} dense={false}>
                {customers.map((customerValue, key) => (
                <div>
                    {key > 0? <Divider/> : ''}
                <ListItem
                    key={key}
                    secondaryAction={
                    <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => removeCustomer(customerValue)}>
                        <DeleteIcon />
                    </IconButton>
                }
                >
                <ListItemAvatar>
                    <Avatar>
                        <BusinessIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={customerValue}
                    // secondary={'Secondary text'}
                />
                </ListItem>
                </div>
            ))}
            </List>
        </Box>
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
