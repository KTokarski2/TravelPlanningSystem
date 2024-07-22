import { Typography, styled } from '@mui/material';
import React from 'react';
import CopyrightIcon from '@mui/icons-material/Copyright';

const StyledFooter = styled('footer')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    marginTop: 'auto'
}));

const Footer = () => {
    return(
        <StyledFooter>
            <Typography variant='h6' align='center' gutterBottom>
                SoezTrip 
            </Typography>
            <CopyrightIcon/>
        </StyledFooter>
    )
}

export default Footer;