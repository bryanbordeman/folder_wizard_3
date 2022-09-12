import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './components/MainRoutes';
import UserService from "./services/User.services";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SnackbarAlert from './components/SnackbarAlert';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import ModeSwitch from './components/ModeSwitch';

// const { ipcRenderer } = window.require('electron');

export default function App() {
    const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')) || {})
    const [ token, setToken ] = useState(localStorage.getItem('token') || null)
    const [ error, setError ] = useState('')
    const [ loginErrors, setLoginErrors ] = useState({username: null, password: null})

    const [ openSnackbar, setOpenSnackbar ] = React.useState(false);
    const [ snackbarSeverity, setSnackbarSeverity ] = React.useState('')
    const [ snackbarMessage, setSnackbarMessage ] = React.useState('')

    const getTheme = localStorage.getItem('theme');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [darkState, setDarkState] = useState(prefersDarkMode);     
    let palletType = darkState ? "dark" : "light";

    
    const theme = createTheme({
        palette: {
            background: 
                {
                    default: darkState? '#0C192A' : "#f8f8ff",
                    paper: darkState? '#0C192A' : '#ffff'
                },
            mode: palletType,
            primary: {
                main: '#1BA2F6',
                contrastText: "#fff"
            },
            secondary: {
                main: '#EA39B8',
            },
            darkBlue: {
                main: '#0C192A',
            },
            
            },
    });

    useEffect(()=> {
        if(getTheme){
            getTheme === 'dark'? setDarkState(true) : setDarkState(false)
        }
    },[])

    useEffect(() => {
        localStorage.setItem('theme', palletType)
    },[palletType])

    const handleChangeMode = () =>{
        setDarkState(!darkState);
    }

    function loadWindow(){
        window.onload = function() {
            if(!window.location.hash) {
                window.location = window.location + '#loaded';
                window.location.reload();
            }
        }
    }

    async function login(user= null){
        UserService.login(user)
        .then(response => {
            setLoginErrors({username: null, password: null});
            setToken(response.data.token);
            setUser(JSON.parse(response.data.userObject))
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(JSON.parse(response.data.userObject)));
            setError('');
            //TODO hack to get dashboard tab highlighted as active page. Need to figure out better solution.
            loadWindow()
        })
        .catch( e => {
            console.log('login', e.toString());
            setLoginErrors({username: 'Username', password: 'Password'});
        });
    };
    async function logout(){
        const userData = Object.keys(user);
        setToken('');
        setUser(userData);
        localStorage.setItem('token', '');
        localStorage.setItem('user', JSON.stringify(userData));
    };
    async function signup(user= null){
        UserService.signup(user)
        .then(response => {
            setToken(response.data.token);
            setUser(user.username);
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', user.username);
        })
        .catch( e => {
            console.log('login', e);
            setError(e.toString());
        });
    };

    const handleOpenSnackbar = (severity, message) => {
        setOpenSnackbar(true);
        setSnackbarSeverity(severity);
        setSnackbarMessage(message);

    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenSnackbar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                {user.username? 
                <>
                </> : ''}
                <MainRoutes
                    user={user}
                    token={token}
                    login={login}
                    signup={signup}
                    logout={logout}
                    error={error}
                    loginErrors={loginErrors}
                    darkState={darkState}
                    handleOpenSnackbar={handleOpenSnackbar}/>
                <SnackbarAlert
                    openSnackbar={openSnackbar}
                    handleCloseSnackbar={handleCloseSnackbar}
                    severity={snackbarSeverity}
                    message={snackbarMessage}/>
                <div style={{ position:'absolute', top:10, right:10}}>
                    <ModeSwitch
                        handleChangeMode={handleChangeMode}
                    />
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}
