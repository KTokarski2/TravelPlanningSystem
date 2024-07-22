import { request } from "./Authconfig";

export const addPlace = async (tripId, name, arrive, leave, country) => {
    try {
        return await request("POST", `/trips/places/${tripId}/new`, {
            name: name,
            arrive: arrive,
            leave: leave,
            country: country
        }, {}, {});
    } catch (error) {
        console.error("Error while adding place");
    }
};

export const getTripPlaces = async (tripId) => {
    try {
        const response = await request("GET", `/trips/${tripId}`);
        return response.data.places;
    } catch (error) {
        console.error("Error while getting places", error);
    }
};

export const deletePlace = async (tripId, placeId) => {
    try {
        return await request("DELETE", `/trips/${tripId}/places/delete/${placeId}`);
    } catch (error) {
        console.error("Error while deleting place", error);
    }
}

export const getPlace = async (placeId) => {
    try {
        const response = await request("GET", `/places/${placeId}`, {}, {})
        return response.data;
    } catch (error) {
        console.log("Error while fetching place", error);
        return null;
    }
}

export const setPlacePhoto = async (tripId, placeId, placePhoto) => {
    try {
        const formData = new FormData();
        formData.append('photo', placePhoto);
        return await request("POST", `/trips/${tripId}/places/${placeId}/photo`, formData, {
            'Content-Type': 'multipart/form-data'
        });
    } catch (error) {
        console.error("Error while setting place photo", error);
    }
}

export const getPlacePhoto = async (idPlace) => {
    try {
        return await request("GET", `/place/${idPlace}/photo`, {}, {}, {
            responseType: 'arraybuffer'
        });
    } catch (error) {
        console.error("Error while gettting place photo", error);
    }
}

export const editPlace = async (tripId, placeId, name, arrive, leave, country) => {
    try {
        return await request("PUT", `/trips/${tripId}/places/${placeId}`, {
            name: name,
            arrive: arrive,
            leave: leave,
            country: country
        }, {}, {})
    } catch (error) {
        console.error("Error while editing place", error);
    }
}

export const getPlaceWeather = async (placeId) => {
    try {
        return await request("GET", `/trips/places/${placeId}/weather`);
    } catch (error) {
        console.error("Error while getting weather", error);
    }
}

export const generatePlacePlan = async (placeId, tripId, placeName) => {
    try {
        return await request("POST", `/trips/${tripId}/places/${placeId}/prompt`, {
            name: placeName
        }, {}, {})
    } catch (error) {
        console.error("Error while generating plan", error);
    }
}

export const editPlacePlan = async (tripId, placeId, plan) => {
    try {
        return await request("PUT", `/trips/${tripId}/places/${placeId}`, {
            prompt: plan
        }, {}, {})
    } catch (error) {
        console.error("Error while editing plan");
    }
}

export const uploadTicket = async (tripId, placeId, ticket) => {
    try {
        const formData = new FormData();
        formData.append('ticketFile', ticket);
        return await request("POST", `/trips/${tripId}/places/${placeId}/tickets/new`, formData, {
            'Content-Type': 'multipart/form-data'
        });
    } catch (error) {
        console.error("Error while uploading ticket")
    }
}

export const getPlaceTickets = async (placeId) => {
    try {
        return await request("GET", `/place/${placeId}/tickets`);
    } catch (error) {
        console.error("Error while getting tickets")
    }
}

export const deleteTicket = async (tripId, placeId, ticketId) => {
    try {
        return await request("DELETE", `/trips/${tripId}/places/${placeId}/tickets/${ticketId}`);
    } catch (error) {
        console.error("Erro while deleting ticekt");
    }
}

export const downloadTicket = async (ticketId) => {
    try {
        const response = await request("GET", `/tickets/${ticketId}/download`, null, {}, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ticket_${ticketId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error while downloading ticket");
    }
}