import { request } from "./Authconfig";

export const getCurrentUserData = async () => {
    try {
        const response = await request("GET", "/users/get", {}, {});
        return response.data;
    } catch(e) {
        console.error("Error while getting current user data: ", e);
        return null;
    }
}

export const getProfileData = async (id) => {
    try {
        const resposne = await request("GET", `/users/${id}`, {}, {});
        return resposne.data;
    } catch(e) {
        console.error("Error while getting profile data: ", e);
    }
}

export const getProfilePhoto = async (id) => {
    try {
        return await request("GET", `/users/${id}/profilePicture`, {}, {}, {
            responseType: 'arraybuffer'
        });
    } catch(e) {
        console.error("Error while getting profile photo: ", e);
    }
}

export const setProfilePhoto = async (id, profilePicture) => {
    try {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        return await request("PUT", `/users/${id}/uploadPP`, formData, {
            'Content-Type': 'multipart/form-data'
        });
    } catch(e) {
        console.error("Error while setting profile photo: ", e);
    }
}

export const getProfileStats = async (id) => {
    try {
        const resposne  = await request("GET", `/users/${id}/stats`);
        return resposne.data;
    } catch(e) {
        console.error("Error while getting profile stats: ", e);
    }
}

export const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};