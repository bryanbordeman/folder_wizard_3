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
    const { checked, setChecked } = props
    const { contacts, setContacts, company } = props
    const { updateContact, quote, token, handleOpenSnackbar } = props
    const [ openCreate, setOpenCreate ] = React.useState(false);
    const [ contact, setContact ] = React.useState('');

    // const handleChecked = (id, e) => {
    //     if(quote){
    //         // Edit Opportunity
    //         const editContact = contacts.filter(element => element.id === id)
    //         if(!e.target.checked){
    //             editContact[0].quotes = editContact[0].quotes.filter(element => element.id === quote.id)
    //         }else{
    //             editContact[0].quotes.push(quote.id)
    //         };
    //             updateContact(id, editContact[0])
    //     }else{
    //         // Create Opportunity
    //         console.log(id)
    //     }
    // };

    const handleChecked = (contact) => {
        // make list of checked contacts
        // console.log(contact)
        const isChecked = checked.includes(contact);
        if(!isChecked){
            setChecked(oldArray => [...oldArray, contact]);
        }else{
            const newList = checked.filter(c => c !== contact)
            setChecked(newList);
            
        }
        
    }

    const handleEdit = (contact) => {
        setContact(contact);
        setOpenCreate(true)
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
                            onChange={() => handleChecked(contact)}
                            // checked={quote? contact.quotes.includes(quote.id) : false}
                            checked={checked.includes(contact)}
                        />
                        }
                        disablePadding
                    >
                        <ListItemButton
                            onClick={() => {handleEdit(contact)}}
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
                handleOpenSnackbar={handleOpenSnackbar}
                setOpen={setOpenCreate}
                company={company}
                quote={quote}
                setContacts={setContacts}
                contact={contact}
                setContact={setContact}
                contacts={contacts}
                updateContact={updateContact}
            />
        </div>
    );
}
