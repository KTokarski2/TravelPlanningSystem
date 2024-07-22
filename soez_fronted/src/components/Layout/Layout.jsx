import React from 'react';
import Header from './Header'
import Footer from './Footer';
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from '@mui/material';
import { isLoggedIn, useAuth } from '../../services/Authconfig';

const Layout = () => {

    const navigate = useNavigate();
    const isUserLoggedIn = isLoggedIn();
    useAuth();

    return (
        <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                <Header isUserLoggedIn={isUserLoggedIn} navigate={navigate}/>
                <Outlet />
                <Footer />
            </Box>
        </>
    )
}

export default Layout;