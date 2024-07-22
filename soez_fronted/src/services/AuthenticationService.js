import {request} from './Authconfig';

export const register = async (firstName, lastName, email, password) => {
    try {
        return await request("POST", "/api/auth/register", {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });
    } catch (error) {
        console.error("Error while register: ", error);
        throw error;
    }
}

export const login = async (email, password) => {
    try {
        return await request("POST", "/api/auth/login", {
            email: email,
            password: password
        });
    } catch (error) {
        console.error("Error while login: ", error);
    }
}

export const getCurrentUserName = async () => {
    try {
        const response = await request("GET", "/users/get");
        return response.data;
    } catch (error) {
        console.error("Error while getting current user");
    }
}