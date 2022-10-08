import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';


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

export default function ContactsList(props) {
    const { contacts } = props
    const { quoteContacts, setQuoteContacts } = props
    const [ checked, setChecked ] = React.useState([]);

    React.useEffect(() => {
        const quoteList = []
        checked.map((check) => {
            quoteList.push(contacts[check].id)
        })
        setQuoteContacts(quoteList)
    }, [checked])
    const handleToggle = (value) => () => {
        
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <List 
            sx={{ width: '100%', bgcolor: 'background.paper', pb:0 }}
            subheader={<ListSubheader>Select Contact(s)</ListSubheader>}
        >
        {contacts? contacts.map((contact, key) => {
            // const labelId = `checkbox-list-secondary-label-${contact.name}`;
            return (
                <Box key={contact.id}>
                    {key > 0? <Divider/> : ''}
                <ListItem
                    key={key}
                    secondaryAction={
                    <Checkbox
                        edge="end"
                        onChange={handleToggle(key)}
                        checked={checked.indexOf(key) !== -1}
                        // inputProps={{ 'aria-labelledby': labelId }}
                    />
                    }
                    disablePadding
                >
                    <ListItemButton
                        onClick={() => {console.log(contact)}}
                    >
                    <ListItemAvatar>
                        <Avatar {...stringAvatar(contact.name)}/>
                    </ListItemAvatar>
                        <ListItemText 
                            // id={labelId} 
                            primary={`${contact.name}`}
                            secondary={`${contact.job_title}`} />
                    </ListItemButton>
                </ListItem>
                </Box>
            );
        }): ''}
        <ListItem sx={{mt:1, mb:1}}>
            <Button 
                sx={{width:'100%'}}
                variant='contained' 
                color='secondary'
                startIcon={<AddIcon />}
            >
                Add Contact
            </Button>
        </ListItem>
        </List>
    );
}
