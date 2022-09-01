import React, { useEffect, useState, useRef } from 'react';
import CompanyServices from '../services/Company.services';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider } from '@mui/material';
import CustomerDialog from './CustomerDialog';


function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}
function stringAvatar(name) {
    return {
        sx: {
        bgcolor: stringToColor(name),
        color: 'white',
        },
        children: `${name.split(' ')[0][0].toUpperCase()}`,
    };
}

export default function CustomerPicker(props) {
    const { token, handleOpenSnackbar } = props
    const [ customer, setCustomer ] = useState('');
    const [ customers, setCustomers ] = useState([]);
    const [ companies, setCompanies ] = useState([]);
    const [ newCustomer, setNewCustomer ] = useState('');
    const [open, setOpen] = React.useState(false);

    useEffect(()=> {
        retrieveCompanies();
    },[])

    useEffect(()=> {
        if(newCustomer){
        const data = (companies.find(element => element.name === newCustomer))
        setCustomers(oldArray => [...oldArray, data.id]);
        setNewCustomer('');
        }
    },[companies])
    
    const retrieveCompanies= () => {
        CompanyServices.getAllShort(token)
        .then(response => {
            setCompanies(response.data);
            
        })
        .catch( e => {
            console.log(e);
        })
    }

    const createCompany = (data) => {
        CompanyServices.createCompany(data, token)
        .then(response => {
            // handleOpenSnackbar('success', 'Your announcement has been posted')
            retrieveCompanies();
            // setIsCreated(true);
        })
        .catch(e => {
            console.log(e);
            // handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const addCustomer = () => {
        if (customer)
        setCustomers(oldArray => [...oldArray, customer]);
        setCustomer('');
    };

    const removeCustomer = (id) => {
        setCustomers(customers.filter(item => item !== id))
    };

    const handleNewCustomer = (e) => {
        setNewCustomer(e.target.value);
    };

    const createNewCustomer = () => {
        const data = {
            'name': newCustomer
        };
        createCompany(data);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    return (
        <Stack>
        <Stack direction='row' spacing={1}>
            <div style={{width: '100%'}}>
                <Autocomplete
                    freeSolo
                    id="customer"
                    disableClearable
                    onChange={(event, newValue) => {
                        setCustomer(newValue.id)}
                    }
                    // options={companies.map((option) => option)}
                    options={companies}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Customer(s)"
                        // value={customer}
                        onChange={handleNewCustomer}
                        InputProps={{
                        ...params.InputProps,
                        type: 'search',
                        }}
                    />
                    )}
                />
            </div>
            <IconButton 
                sx={{top: '7px', maxHeight: '2.75rem', border: 1, borderColor: "#1BA2F6 !important" }}
                color="primary" 
                aria-label="back"
                onClick={newCustomer && !customer? createNewCustomer : addCustomer}
            >
                <AddIcon />
            </IconButton>
        </Stack>
        <Box>
            <List sx={{mt:3}} dense={false}>
                {customers.map((customerId, key) => (
                <Box key={customerId}>
                    {key > 0? <Divider/> : ''}
                <ListItem
                    secondaryAction={
                    <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => removeCustomer(customerId)}>
                        <DeleteIcon />
                    </IconButton>
                }
                >
                <Button onClick={handleClickOpen}>
                    <ListItemAvatar>
                        <Avatar {...stringAvatar(companies.find(item => item.id === customerId).name)}/>
                    </ListItemAvatar>
                </Button>
                <ListItemText
                    primary={companies.find(item => item.id === customerId).name}
                    // secondary={'Secondary text'}
                />
                </ListItem>
                <CustomerDialog
                    open={open}
                    setOpen={setOpen}
                    // customerId={customerId}
                />
                </Box>
            ))}
            </List>
        </Box>
        </Stack>
    );
    }

    // const companies =
    // [
    //     {
    //         "id": 1,
    //         "name": "National Shielding"
    //     },
    //     {
    //         "id": 2,
    //         "name": "Global Partners in Shielding"
    //     },
    //     {
    //         "id": 3,
    //         "name": "B.R. Fries & Associates LLC"
    //     },
    //     {
    //         "id": 4,
    //         "name": "Global Shielding LLC"
    //     }
    // ]