import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { isLoggedIn } from '../../services/Authconfig';

const PrivateRoute = () => {
    const auth = isLoggedIn();
    return auth ? <Outlet/> : <Navigate to="/login"/>
}

export default PrivateRoute;