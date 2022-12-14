import React from 'react';
import OpportunityForm from '../components/OpportunityForm';
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

export default function Opportunity(props) {
    const { token, user, handleOpenSnackbar } = props
    return (  
        <div style={{marginTop: '5rem'}}>
            <Typography variant="h2" component="h2" sx={{mr:3, ml:3, mb:2}}>
                <Box 
                >
                    Create Opportunity
                </Box>
            </Typography>
            <OpportunityForm
                token={token}
                user={user}
                handleOpenSnackbar={handleOpenSnackbar}
            />
            <div style={{ position:'absolute', top:10, left:10}}>
                <IconButton 
                    sx={{border: 1, borderColor: "#1BA2F6 !important" }}
                    color="primary" 
                    aria-label="back"
                    component={Link} 
                    to='/'
                >
                    <ArrowBackIcon />
                </IconButton>
            </div>
        </div>
    );
};
