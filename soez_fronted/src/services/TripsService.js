import {request} from "./Authconfig";

export const createTrip = async (title, startingDate, endingDate) => {
    try {
        return await request("POST", "/trips/new", {
            title: title,
            startingDate: startingDate,
            endingDate: endingDate
        });
    } catch (error) {
        console.error("Error while creating trip:", error);
        throw error; // Przekażemy błąd dalej, aby mógł być obsłużony w komponencie
    }
}

export const getAllTrips = async () => {
    try {
        const response = await request("GET", "/trips", {}, {});
        return response.data;
    } catch (error) {
        console.log("Error while fetching trips:", error);
        return [];
    }
}

export const getTrip = async (id) => {
    try {
        const response = await request("GET", `/trips/${id}`, {}, {});
        return response.data;
    } catch (error) {
        console.log("Error while fetching trips:", error);
        return null;
    }
}

export const editTrip = async (id, startingDate, endingDate, title) => {
    try {
        return await request("PUT", `trips/${id}`, {
            startingDate: startingDate,
            endingDate: endingDate,
            title: title,
            finished: null,
            places: []
        });
    } catch (error) {
        console.log("Error while editing trip:", error);
        return null;
    }
}

export const deleteTrip = async (id) => {
    try {
        return await request("DELETE", `trips/${id}`, {}, {})
    } catch (error) {
        console.error("Error while deleting trip", error);
    }
}

export const getCurrentUserRole = async (id) => {
    try {
        const response = await request("GET", `/trips/${id}/role`);
        return response.data;
    } catch (error) {
        console.error("Error while getting role", error);
    }
}

export const addPersonToTrip = async (tripId, email) => {
    try {
        return await request("PUT", `/trips/${tripId}/addPerson`, {
            email: email
        })
    } catch (error) {
        console.error("Error while adding friend to trip", error)
    }
}

export const deletePersonFromTrip = async (id, email) => {
    try {
        return await request("PUT", `/trips/${id}/removePerson`, {
            email: email
        });
    } catch (error) {
        console.error("Error while deleting person from trip", error);
    }
}

export const setTripRole = async (tripId, email, role) => {
    try {
        return await request("PUT", `/trips/${tripId}/changeRole`, {
            email: email,
            role: role
        });
    } catch (error) {
        console.error("Error while setting role", error);
    }
}

export const setTripPhoto = async (tripId, tripPhoto) => {
    try {
        const formData = new FormData();
        formData.append('photo', tripPhoto);
        return await request("POST", `/trips/${tripId}/photo`, formData, {
            'Content-Type': 'multipart/form-data'
        });
    } catch (error) {
        console.error("Error while setting trip photo", error);
    }
}

export const getTripPhoto = async (idTrip) => {
    try {
        return await request("GET", `/trips/${idTrip}/photo`, {}, {}, {
            responseType: 'arraybuffer'
        });
    } catch (error) {
        console.error("Error while getting trip photo", error);
    }
}

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export const formatDateInput = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

