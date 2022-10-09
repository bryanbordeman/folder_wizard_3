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
import AddContactDialog from './AddContactDialog';


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
    const { contacts, company } = props
    const { updateContact, quote, token } = props
    const [ openCreate, setOpenCreate ] = React.useState(false);

    const handleChecked = (id, e) => {
        if(quote){
        const editContact = contacts.filter(element => element.id === id)
        if(!e.target.checked){
            editContact[0].quotes = editContact[0].quotes.filter(element => element.id === quote.id)
        }else{
            editContact[0].quotes.push(quote.id)
        };
            updateContact(id, editContact[0])
        }
    };

    
    return (
        <div>
            <List 
                sx={{ width: '100%', bgcolor: 'background.paper', pb:0 }}
                subheader={<ListSubheader>Select Contact(s)</ListSubheader>}
            >
                {contacts? contacts.map((contact, key) => {
                return (
                    <Box key={contact.id}>
                        {key > 0? <Divider/> : ''}
                    <ListItem
                        key={key}
                        secondaryAction={
                        <Checkbox
                            edge="end"
                            onChange={(e) => handleChecked(contact.id, e)}
                            checked={quote? contact.quotes.includes(quote.id) : false}
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
                        onClick={() => {setOpenCreate(true)}}
                        variant='contained' 
                        color='secondary'
                        startIcon={<AddIcon />}
                    >
                        Add Contact
                    </Button>
                </ListItem>
            </List>
            <AddContactDialog
                open={openCreate}
                token={token}
                setOpen={setOpenCreate}
                company={company}
                quote={quote}
            />
        </div>
    );
}
