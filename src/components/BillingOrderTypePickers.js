import React, { useEffect, useState, useLayoutEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import { FormControl, Stack } from '@mui/material';

export default function BillingOrderTypePickers(props) {
    const { token } = props
    const { values, setValues, errors, clear, setClear } = props;
    const [ billings, setBillings ] = useState([]);
    const [ billing, setBilling ] = useState('');
    const [ orders, setOrders] = useState([]);
    const [ order, setOrder ] = useState('');

    useEffect(()=> {
        if(clear){
            setBilling('');
            setOrder('');
            setClear(false);
        };
    },[clear])

    useEffect(() => {
        // retrieveCategories();
    },[])


    // const retrieveCategories = () => {
    //     ProjectCategoryServices.getCategories(token)
    //     .then(response => {
    //         setCategories(response.data);
            
    //     })
    //     .catch( e => {
    //         console.log(e);
    //     })
    // }

    // const retrieveTypes= () => {
    //     ProjectTypeServices.getTypes(token)
    //     .then(response => {
    //         if (category){
    //             const allTypes = response.data
    //             setTypes(allTypes.filter(type => type.project_category === category))
    //         }
    //     })
    //     .catch( e => {
    //         console.log(e);
    //     })
    // }

    const hangleChangeBilling = (e) => {
        setBilling(e.target.value);
        setValues({...values, billing_type: e.target.value})
    };

    const hangleChangeOrder = (e) => {
        setOrder(e.target.value);
        setValues({...values, order_type: e.target.value})
    };


    return ( 
        <Stack direction='row' spacing={2}>
            <FormControl 
                style={{width: '100%'}}
                error={errors.billing_type? true : false}
            >
                <InputLabel 
                    id="billing_type"
                >
                    Billing type
                </InputLabel>
                <Select
                    fullWidth
                    labelId="billing_type"
                    id="billing_type"
                    defaultValue={''}
                    value={billing}
                    label="Project Category"
                    onChange={hangleChangeBilling}
                >
                {billings.map((billing, key) => (
                    <MenuItem 
                        key={key} 
                        value={billing.id}
                    >   
                        {billing.name}
                    </MenuItem>
                )
                    )}
                </Select>
                    {errors.billing_type && <FormHelperText error={errors.billing_type? true : false}>This is required!</FormHelperText>}
            </FormControl>
            
            
            <FormControl 
                style={{width: '100%'}}
                error={errors.order_type? true : false}
            >
                <InputLabel 
                    id="order_type"
                >
                    Order type
                </InputLabel>
                <Select
                    fullWidth
                    labelId="billing_type"
                    id="billing_type"
                    defaultValue={''}
                    value={order}
                    label="Project Category"
                    onChange={hangleChangeOrder}
                >
                {orders.map((billing, key) => (
                    <MenuItem 
                        key={key} 
                        value={order.id}
                    >   
                        {order.name}
                    </MenuItem>
                )
                    )}
                </Select>
                    {errors.order_type && <FormHelperText error={errors.order_type? true : false}>This is required!</FormHelperText>}
            </FormControl>
        </Stack>
    );
};