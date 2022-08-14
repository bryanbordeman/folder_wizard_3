import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

export default function SnackbarAlert(props) {

const { openSnackbar, handleCloseSnackbar, severity, message } = props

return (
    <Snackbar 
        open={openSnackbar} 
        anchorOrigin={{vertical: 'top', horizontal: 'center'}} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        sx={{ width: '95%' }}>
        <Alert 
            onClose={handleCloseSnackbar} 
            severity={severity} 
            sx={{ width: '100%' }}
            >
        {message}
        </Alert>
    </Snackbar>
);
}