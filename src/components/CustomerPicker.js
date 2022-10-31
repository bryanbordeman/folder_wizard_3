import React, { useEffect, useState, useRef } from 'react';
import CompanyServices from '../services/Company.services';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { Divider } from '@mui/material';
import CustomerDialog from './CustomerDialog';
import { FormControl } from '@mui/material';

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
};

function stringAvatar(name) {
    return {
        sx: {
        bgcolor: stringToColor(name),
        color: 'white',
        },
        children: `${name.split(' ')[0][0].toUpperCase()}`,
    };
};

export default function CustomerPicker(props) {
    const { token, handleOpenSnackbar, errors, values, setValues, clear, setClear, quote, isDisabled} = props
    const { updateContact, contacts, setContacts, checked, setChecked, setEditContacts } = props
    const [ customer, setCustomer ] = useState(''); // existing value picked from list
    const [ editCustomer, setEditCustomer ] = useState(''); // used for dialog
    const [ customers, setCustomers ] = useState([]); // list of customers picked
    const [ companies, setCompanies ] = useState([]); // list of matching customers from search
    const [ newCustomer, setNewCustomer ] = useState(''); // manually written input
    const [ open, setOpen ] = React.useState(false);

    const didMount = useRef(false);

    useEffect(() => {
        // go to backend and seach for matches. seach starts at third input
        if (didMount.current) {
            if(newCustomer !== '' && newCustomer.length > 1)
                searchCompanies(newCustomer)
        } else {
            didMount.current = true;
        }
    },[newCustomer]);

    useEffect(()=> {
        // clear list and inputs
        if(clear){
            setCustomers([]);
            setCustomer('');
            setNewCustomer('');
            setClear(false);
        };
    },[clear]);

    useEffect(() => {
        // if editing quote load data
        if(quote && quote.customers){
            quote.customers.map((customer) => {
                setCustomers(oldArray => [...oldArray, customer]);
            })
        };
    },[quote])

    useEffect(() => {
        // if new customer is added to list update values
        let tempList = []
        customers.map((customer) => {
            tempList.push(customer.id)
        })
        setValues({...values, customers: tempList})
    }, [customers]);
    
    const searchCompanies = (search) => {
        CompanyServices.searchAll(token, search)
        .then((response) => {
            setCompanies(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const createCompany = (data) => {
        CompanyServices.createCompany(data, token)
        .then(response => {
            handleOpenSnackbar('success', 'New Company was created')
            setCustomers(oldArray => [...oldArray, response.data]);
            setCustomer('');
            setNewCustomer('');
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    const addCustomer = () => {
        if (customer){
            let isExisting = customers.find(item => item.name === customer);
            if (!isExisting){
                let customerObj = companies.find(item => item.name === customer);
                setCustomers(oldArray => [...oldArray, customerObj]);
                setCustomer('');
            };
        };
    };

    const removeCustomer = (id) => {
        setCustomers(customers.filter(item => item.id !== id));
    };

    const handleNewCustomer = (e) => {
        setNewCustomer(e.target.value);
    };

    const createNewCustomer = () => {
        const data = {
        'name': newCustomer
        };
        createCompany(data)
    };

    const handleClickOpen = (customerId) => {
        setOpen(true);
        const customerData = (customers.find(element => element.id === customerId));
        setEditCustomer(customerData);
    };

    return (
        <Stack>
        <Stack direction='row' spacing={1}>
            <FormControl 
                style={{width: '100%'}}
            >
                <Autocomplete
                    freeSolo
                    disabled={isDisabled}
                    id="customer"
                    disableClearable
                    onInputChange={(event, newValue) => {
                        setCustomer(newValue)}
                    }
                    inputValue={customer}
                    options={companies}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Customer(s)"
                            onChange={handleNewCustomer}
                            // onKeyPress={(e) => {
                            //     if (e.key === "Enter") {
                            //             alert(e.target.value);
                            //     }
                            // }}
                            onInput = {(e) =>{
                                e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g,"")
                            }}
                            InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            }}
                            helperText={errors.customers === null ? '' : errors.customers}
                            error={errors.customers? true : false}
                        />
                    )}
                />
            </FormControl>
            <IconButton 
                sx={{top: '7px', maxHeight: '2.75rem', border: 1, borderColor: "#1BA2F6 !important" }}
                disabled={isDisabled}
                color="primary" 
                aria-label="back"
                // onClick={customer? addCustomer : createNewCustomer}
                onClick={customer === newCustomer? createNewCustomer : addCustomer }
            >
                <AddIcon />
            </IconButton>
        </Stack>
        <Box>
            <List sx={{mt:3}} dense={false}>
                {customers.map((customer, key) => (
                <Box key={customer.id}>
                    {key > 0? <Divider/> : ''}
                <ListItem
                    secondaryAction={
                    <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => removeCustomer(customer.id)}>
                        <CloseIcon />
                    </IconButton>
                }
                >
                <ListItemButton
                    onClick={() => {
                        handleClickOpen(customer.id);
                    }}
                >     
                <ListItemAvatar>
                    <Avatar {...stringAvatar(customer.name)}/>
                </ListItemAvatar>
            
                <ListItemText
                    primary={customer.name}
                />
                </ListItemButton>
                </ListItem>
                
                </Box>
            ))}
            </List>
            <CustomerDialog
                token={token}
                handleOpenSnackbar={handleOpenSnackbar}
                open={open}
                setOpen={setOpen}
                customerData={editCustomer}
                setCustomers={setCustomers}
                customers={customers}
                quote={quote}
                updateContact={updateContact}
                contacts={contacts}
                setContacts={setContacts}
                checked={checked}
                setChecked={setChecked}
                setEditContacts={setEditContacts}
            />
        </Box>
        </Stack>
    );
};