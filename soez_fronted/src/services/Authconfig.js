import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const getAuthToken = () => {
    return window.localStorage.getItem('auth_token');
}

export const setAuthHeader = (token) => {
    if (token !== null) {
        window.localStorage.setItem('auth_token', token);
        window.localStorage.setItem('auth_token_set_time', new Date().toISOString())
    }else {
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('auth_token_set_time');
    }
}

export const isTokenExpired = () => {
    const tokenSetTime = window.localStorage.getItem('auth_token_set_time');
    if (tokenSetTime) {
        const setTime = new Date(tokenSetTime);
        const currentTime = new Date();
        const elapsedSeconds = (currentTime - setTime) / 1000;
        return elapsedSeconds > 7200;//7200 -> 2h
    }
    return false;
}

export const useAuth = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const checkTokenValidity = () => {
            if (isTokenExpired()) {
                console.log("Token expired. Logging out and navigating to login")
                Logout();
                navigate('/login');
            }
        };
        const intervalId = setInterval(checkTokenValidity, 1000);
        return () => clearInterval(intervalId);
    }, [navigate]);
};

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.post["Content-Type"] = 'application/json'

export const request = (method, url, data, customHeaders = {}, options = {}) => {

    let headers = customHeaders;

    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers['Authorization'] = `Bearer ${getAuthToken()}`;
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data,
        ...options
    });
};

export const isLoggedIn = () => {
    const authToken = getAuthToken();
    return authToken !== null && authToken !== "null";
}

export const Logout = () => {
    console.log("Logging out...")
    window.localStorage.clear();
}