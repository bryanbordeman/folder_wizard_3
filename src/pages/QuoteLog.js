import React from 'react';
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import QuoteLogTable from '../components/QuoteLogTable';
import Loading from '../components/Loading';

export default function QuoteLog(props) {
    const { token, user, handleOpenSnackbar, darkState } = props
    const [ isLoading, setIsLoading ] = React.useState(false);

    return (  
        <div style={{marginTop: '5rem'}}>
            <Typography variant="h2" component="h2" sx={{mr:3, ml:3, mb:2}}>
                <Box 
                >
                    Quote Log
                </Box>
            </Typography>
            <QuoteLogTable
                token={token}
                user={user}
                handleOpenSnackbar={handleOpenSnackbar}
                darkState={darkState}
                setIsLoading={setIsLoading}
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
            <Loading
                open={isLoading}
            />
        </div>
    );
};
