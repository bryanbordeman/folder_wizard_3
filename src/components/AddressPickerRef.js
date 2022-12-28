import * as React from 'react';
import AddressServices from '../services/Address.services';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';

const GOOGLE_MAPS_API_KEY = 'AIzaSyChTcMUCY9Zw3j00st0uKkqTz0RGlOpea8';

function loadScript(src, position, id) {
    if (!position) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
};

    const autocompleteService = { current: null };

export default function AddressPickerRef(props) {
    const { token, handleOpenSnackbar} = props
    const [ value, setValue ] = React.useState(null);
    const [ inputValue, setInputValue ] = React.useState('');
    const [ options, setOptions ] = React.useState([]);
    const loaded = React.useRef(false);

    const isExisting = (address) => {
        AddressServices.lookup(address.place_id, token)
        .then(response => {
            if(response.data.length > 0){
                // if address is already in our database
                console.log('true')
                let index = address.terms.length - 1
                let addressObject = {
                    place_id: address.place_id,
                    address: address.terms[index-4].value,
                    city: address.terms[index-3].value,
                    state: address.terms[index-2].value,
                    postal_code: address.terms[index-1].value,
                    country: address.terms[index].value,
                }
                console.log(address.terms[index].value)
                // setExisting(true);
                // setAddressId(response.data[0].id)
            }else{
                // if address is not in our database
                console.log('false')
                // setExisting(false);
                // const data = addressObj;
                // const add = {place_id: placeId};
                // Object.entries(add).forEach(([key,value]) => { data[key] = value });
                // createAddress(data);
            }
            // handleOpenSnackbar('success', 'New Address was created')
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
                document.querySelector('head'),
                'google-maps',
            );
        }

        loaded.current = true;
    }

    const fetch = React.useMemo(() =>
        debounce((request, callback) => {
            autocompleteService.current.getPlacePredictions(request, callback);
        }, 400),
        [],
    );

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
            autocompleteService.current =
            new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results) => {
            if (active) {
                let newOptions = [];

                if (value) {
                newOptions = [value];
                }

                if (results) {
                newOptions = [...newOptions, ...results];
                }
                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <div>
        <Autocomplete
            id="google-map-demo"
            sx={{ width: '100%' }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="No Options"
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                isExisting(newValue)
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Add Address..." fullWidth />
            )}
            renderOption={(props, option) => {
                const matches =
                option.structured_formatting.main_text_matched_substrings || [];

                const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match) => [match.offset, match.offset + match.length]),
                );

                return (
                <li {...props}>
                    <Grid container alignItems="center">
                    <Grid item sx={{ display: 'flex', width: 44 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary' }} />
                    </Grid>
                    <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                        {parts.map((part, index) => (
                        <Box
                            key={index}
                            component="span"
                            sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                        >
                            {part.text}
                        </Box>
                        ))}

                        <Typography variant="body2" color="text.secondary">
                        {option.structured_formatting.secondary_text}
                        </Typography>
                    </Grid>
                    </Grid>
                </li>
                );
            }}
        />
        {value? 
        <Box sx={{mt:2}}>
            <Chip label={`${value.description}`} variant="outlined" />
        </Box> 
         : ''} 
        </div>
    );
}