import React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Logo from '../assets/folder_wizard_logo_3.png';
import LogoLight from '../assets/folder_wizard_logo_light_3.png';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';

function Home(props) {
    const { darkState, logout } = props
    return ( 
        <div>
        <Stack 
            spacing={4} 
            sx={{position: 'absolute',
            width: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: 4
            }}>
            <div style={{ width: '100%', textAlign: 'center' }}>
                <img src={darkState? Logo : LogoLight} alt="Logo" width="50%"/>
            </div>
            <Stack direction='row' spacing={4} >
                <Card sx={{ width: '100%', textAlign: 'center', border: 1, borderRadius:2, borderColor: "#1BA2F6 !important" }} elevation={0}>
                    <CardContent>
                            <Typography variant="h4" gutterBottom component="div">
                                OPPORTUNITY
                            </Typography>
                        <Typography variant="body2">
                            Create or edit quotes
                        </Typography>
                    </CardContent>
                    <Stack
                        sx={{mt:1, mb:2}}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Button 
                            size='large'
                            variant='contained' 
                            color='secondary' 
                            component={Link} 
                            to='/opportunity'
                        >Create Quote
                        </Button>
                        <ButtonGroup
                            variant="outlined"
                            size='small'
                            >
                            <Button 
                                startIcon={<EditIcon />}
                                sx={{width: '50%'}}
                                component={Link} 
                                to='/opportunity/edit'
                            >Edit</Button>
                            <Button 
                                startIcon={<BallotTwoToneIcon />}
                                sx={{width: '50%'}}
                                component={Link} 
                                to='/quotelog'
                            >Log</Button>
                        </ButtonGroup>
                    </Stack>
                </Card>
                <Card sx={{ width: '100%', textAlign: 'center', border: 1, borderRadius:2, borderColor: "#1BA2F6 !important" }} elevation={0}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom component="div">
                            PROJECT
                        </Typography>
                        <Typography variant="body2">
                            Create or edit projects
                        </Typography>
                    </CardContent>
                    <Stack
                        sx={{mt:1, mb:2}}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Button 
                            size='large'
                            variant='contained' 
                            color='secondary' 
                            component={Link} 
                            to='/project'
                        >Create Project
                        </Button>
                        <ButtonGroup
                            variant="outlined"
                            size='small'
                            >
                            <Button 
                                startIcon={<EditIcon />}
                                sx={{width: '50%'}}
                                component={Link} 
                                to='/project/edit'
                            >Edit</Button>
                            <Button 
                                startIcon={<BallotTwoToneIcon />}
                                sx={{width: '50%'}}
                                component={Link} 
                                to='/projectlog'
                            >Log</Button>
                        </ButtonGroup>
                    </Stack>
                </Card>
            </Stack>
            <Card sx={{ width: '100%', textAlign: 'center', border: 1, borderRadius:2, borderColor: "#1BA2F6 !important" }} elevation={0}>
                <CardContent>
                    2022 Quotes to Project Conversion Rate 
                </CardContent>
                <CardContent>
                    Leader Board 
                </CardContent>
            </Card>
        </Stack>
        <div style={{ position:'absolute', top:10, left:10}}>
            <IconButton 
                sx={{border: 1, borderColor: "#1BA2F6 !important" }}
                color="primary" 
                aria-label="back"
                onClick={logout}
            >
                <LogoutIcon />
            </IconButton>
        </div>
        </div>
    );
}

export default Home;