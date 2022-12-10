import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Transition from './DialogTransistion'
import CloseIcon from '@mui/icons-material/Close';
import { Stack, IconButton, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';



export default function ProjectPreviewDialog(props) {
    const { open, setOpen, project, projectType } = props;

    // format price with commas and decimal
    let price = ''
    if(project.price){
        if (Number.isInteger(project.price)){
            price = `$${project.price.toLocaleString("en-US")}.00`
        }else{
            let num = String(project.price)
            let len = num.length
            let decimalIndex = num.indexOf('.')
            
            if(len - decimalIndex === 3){
                price = `$${project.price.toLocaleString("en-US")}`
            }else{
                price = `$${project.price.toLocaleString("en-US")}0`
            }
            // console.log(len)
        }
    }
    // let title = ''
    // switch(projectType) {
    //     case 2:
    //         title = 'Preview Service'
    //         break;
    //     case 3:
    //         title = 'Preview HSE'
    //         break;
    //     default:
    //         title = 'Preview Project'
    // }
    
    const handleClose = () => {
        setOpen(!open)
    };

    return (
        <Box>
            {project? 
            <Dialog 
                TransitionComponent={Transition}
                fullScreen
                open={open} 
                onClose={handleClose}
            >
                <DialogTitle>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Stack>
                            <Typography variant="h4">
                                {project.number}
                            </Typography>
                            <Typography variant="subtitle1">
                                {project.name}
                            </Typography>
                        </Stack>
                        <div>
                        <IconButton 
                            edge="end" 
                            aria-label="close"
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        </div> 
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <List dense disablePadding={true} sx={{ width: '100%', bgcolor: 'background.paper'}}>
                        <ListItem divider>
                            <ListItemText 
                                primary="Category" 
                                secondary={project.project_category.name} 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText 
                                primary="Type" 
                                secondary={project.project_type.name} 
                            />
                        </ListItem>
                        {project.address?
                            <ListItem divider>
                                <ListItemText 
                                    primary="Address" 
                                    secondary={`${project.address.address}, ${project.address.city}, ${project.address.state}, ${project.address.postal_code}`} 
                                />
                            </ListItem >
                        : '' }
                        <ListItem divider>
                            <ListItemText 
                                primary="Customer" 
                                secondary={project.customer.name} />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText 
                                sx={{color: project.prevailing_rate ? '#2e7d32' : '#c62828'}}
                                primary="Prevailing Rate" 
                                secondary={project.prevailing_rate ? 'Yes' : 'No' } 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText  
                                sx={{color: project.union ? '#2e7d32' : '#c62828'}}
                                primary="Union" 
                                secondary={project.union ? 'Yes' : 'No' } 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText  
                                sx={{color: project.certified_payroll ? '#2e7d32' : '#c62828'}}
                                primary="Certified Payroll" 
                                secondary={project.certified_payroll ? 'Yes' : 'No' } 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText  
                                sx={{color: project.material_only ? '#2e7d32' : '#c62828'}}
                                primary="Material Only" 
                                secondary={project.material_only ? 'Yes' : 'No' } 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText  
                                sx={{color: project.travel_job ? '#2e7d32' : '#c62828'}}
                                primary="Travel Job" 
                                secondary={project.travel_job ? 'Yes' : 'No' } 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText  
                                sx={{color: project.tax_exempt ? '#2e7d32' : '#c62828'}}
                                primary="Tax Exempt" 
                                secondary={project.tax_exempt ? 'Yes' : 'No' } 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText 
                                primary="Billing Type" 
                                secondary={project.billing_type.name}
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText 
                                primary="Order Type" 
                                secondary={project.order_type.name} 
                            />
                        </ListItem>
                        <ListItem divider>
                            <ListItemText 
                                primary="Terms" 
                                secondary={project.terms} 
                            />
                        </ListItem>
                        <ListItem divider={project.po_number? true : false}>
                            <ListItemText 
                                primary="Price" 
                                secondary={price}
                            />
                        </ListItem>
                        {project.po_number? 
                            <ListItem divider={project.notes? true : false}>
                                <ListItemText 
                                    primary="PO or Contract Number" 
                                    secondary={project.po_number} 
                                />
                            </ListItem>
                        : '' }
                        {project.notes? 
                            <ListItem>
                                <ListItemText 
                                    primary="Notes" 
                                    secondary={project.notes}
                                />
                        </ListItem>
                        : ''}
                    </List>
                </DialogContent>
            </Dialog>
            : ''}
        </Box>
    );
}
