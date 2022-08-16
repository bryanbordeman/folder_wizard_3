import React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../assets/folder_wizard_logo_3.png'
import LogoLight from '../assets/folder_wizard_logo_light_3.png'

function Home(props) {
    const { darkState } = props
    return ( 
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
                        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        adjective
                        </Typography> */}
                        {/* <Link to='/opportunity'> */}
                        <Typography variant="body2">
                            Create or edit quotes
                        </Typography>
                        {/* </Link> */}
                    </CardContent>
                    <CardActions >
                        <Button 
                            variant='contained' 
                            color='secondary' 
                            sx={{ width: '50%', left: '25%' }}
                            component={Link} 
                            to='/opportunity'
                        >Create Quote
                    </Button>
                    </CardActions>
                    <CardActions sx={{mb:2}}>
                        <Button variant='outlined' color='primary' sx={{ width: '50%', left: '25%' }}>Edit Quote</Button>
                    </CardActions>
                </Card>
                <Card sx={{ width: '100%', textAlign: 'center', border: 1, borderRadius:2, borderColor: "#1BA2F6 !important" }} elevation={0}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom component="div">
                            PROJECT
                        </Typography>
                        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        adjective
                        </Typography> */}
                        <Typography variant="body2">
                            Create or edit projects
                        </Typography>
                    </CardContent>
                    <CardActions >
                        <Button variant='contained' color='secondary' sx={{ width: '50%', left: '25%' }}>Create Project</Button>
                    </CardActions>
                    <CardActions sx={{mb:2}}>
                        <Button variant='outlined' color='primary' sx={{ width: '50%', left: '25%' }}>Edit Project</Button>
                    </CardActions>
                </Card>
            </Stack>
        </Stack>
    );
}

export default Home;