import * as React from 'react';
import QuoteDataService from '../services/Quote.services';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteIcon from '@mui/icons-material/Delete';
import OpportunityDialog from './OpportunityDialog';
import AddTaskForm from './AddTaskForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
        }}
        transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}
        {...props}
    />
    ))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
        padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
            fontSize: 18,
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(1.5),
        },
        '&:active': {
            backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
            ),
        },
        },
    },
    }));

export default function QuoteLogMenu(props) {
    const {anchorEl}= props
    const {open , quote } = props
    const { token, user, handleOpenSnackbar } = props
    const {handleClick, handleClose, archiveQuote } = props
    const { mouseX, mouseY} = props
    const [ openEdit, setOpenEdit ] = React.useState(false);
    const [ openTask, setOpenTask] = React.useState(false);
    const [ openDelete, setOpenDelete] = React.useState(false);
    const [ deleteMessage, setDeleteMessage ] = React.useState({title: '', content:''});

    const handleEdit = () => {
        setOpenEdit(!openEdit);
        handleClose();
    }

    const handleTask = () => {
        setOpenTask(!openTask);
        handleClose();
    }

    const handleQuote = () => {
        archiveQuote(quote.id);
        handleClose();
    };
    
    const handleDeleteCompany = () => {
        setDeleteMessage({title: 'Permanently delete quote?', content: `${quote.number} ${quote.name}`})
        setOpenDelete(true)
        handleClose();
    };

    const deleteQuote = () => {
        QuoteDataService.deleteQuote(quote.id, token)
        .then(response => {
            handleOpenSnackbar('warning', 'Quote was deleted')
        })
        .catch(e => {
            console.log(e);
            handleOpenSnackbar('error', 'Something Went Wrong!! Please try again.')
        });
    };

    return (
        <div>
            <StyledMenu
                id="demo-customized-menu"
                anchorReference="anchorPosition"
                anchorPosition={{ top: mouseY, left: mouseX }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                
                MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleEdit} disableRipple>
                    <EditIcon />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleTask} disableRipple>
                    <AddTaskIcon />
                    Create Task
                </MenuItem>
                <MenuItem onClick={handleQuote} disableRipple>
                    <ArchiveIcon />
                    Archive
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleDeleteCompany} disableRipple>
                    <DeleteIcon />
                    Delete
                </MenuItem>
            </StyledMenu>
            <OpportunityDialog
                open={openEdit}
                setOpen={setOpenEdit}
                token={token}
                user={user}
                handleOpenSnackbar={handleOpenSnackbar}
                quote={quote}
            />
            <AddTaskForm
                open={openTask}
                editing={false}
                setOpen={setOpenTask}
                user={user}
                token={token}
                handleOpenSnackbar={handleOpenSnackbar}
                quote={quote}
            />
            <DeleteConfirmationModal
                openDelete={openDelete}
                setOpenDelete={setOpenDelete}
                message={deleteMessage}
                deleteAction={deleteQuote}
            />
        </div>
    );
    }