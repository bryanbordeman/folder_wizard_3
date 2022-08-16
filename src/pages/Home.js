import React from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../assets/folder_wizard_logo_3.png'

function Home(props) {
    return ( 
        <div>
            <div style={{ marginTop:'10rem', width: '100%', textAlign: 'center' }}>
                <img src={Logo} alt="Logo" width="50%"/>
            </div>
            <Stack direction='row' spacing={4} 
                sx={{position: 'absolute',
                    width: '100%',
                    top: '75%',
                    transform: 'translateY(-75%)',
                    padding: 4
                    }}
            >
                <Card sx={{ width: '100%', textAlign: 'center' }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom component="div">
                            OPPORTUNITY
                        </Typography>
                        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        adjective
                        </Typography> */}
                        <Typography variant="body2">
                            Create new quote
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' color='secondary' sx={{ width: '50%', left: '25%', mb:3}}>Create</Button>
                    </CardActions>
                </Card>
                <Card sx={{ width: '100%', textAlign: 'center' }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom component="div">
                            PROJECT
                        </Typography>
                        {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        adjective
                        </Typography> */}
                        <Typography variant="body2">
                            Create new project
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant='contained' color='secondary' sx={{ width: '50%', left: '25%', mb: 3 }}>Create</Button>
                    </CardActions>
                </Card>
            </Stack>
        </div>
    );
}

export default Home;