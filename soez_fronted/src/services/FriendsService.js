import {request} from "./Authconfig";

export const getEmails = async () => {
    try {
        const response = await request("GET", "/users");
        const users = response.data;
        return users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }));
    } catch (error) {
        console.error("Error while getting emails", error);
        throw error;
    }
}

export const getFriends = async () => {
    try {
        const response = await request("GET", "user/friends");
        const users = response.data;
        return users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }));
    } catch (error) {
        console.error("Error while getting friends", error);
        throw error;
    }
}

export const addFriend = async (id) => {
    try {
        return await request("POST", `/users/add-friend/${id}`, {});
    } catch (error) {
        console.error("Error while adding friend", error);
        throw error;
    }
}

export const removeFriend = async (id) => {
    try {
        return await request("DELETE", `/users/remove-friend/${id}`, {}, {});
    } catch (error) {
        console.error("Error while removing friend", error);
        throw error;
    }
}