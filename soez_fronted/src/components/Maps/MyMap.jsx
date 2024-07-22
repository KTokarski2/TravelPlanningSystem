import React, { useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const MyMap = ({ location }) => {
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const APIkey = '';

    useEffect(() => {
        const loadMap = async () => {
            // Sprawdź, czy google.maps jest dostępny
            if (window.google && window.google.maps) {
                const gc = new window.google.maps.Geocoder();
                gc.geocode({ address: `${location.name}, ${location.country}` }, (results, status) => {
                    if (status === "OK") {
                        setCenter({
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                        });
                    }
                });
            }
        };

        if (location.name && location.country) {
            loadMap();
        }
    }, [location]);

    return (
        <APIProvider apiKey={APIkey}>
            <Map
                style={{ height: '100%', width: '100%' }}
                center={center}
                zoom={10}
                loading="async"
            />
        </APIProvider>
    );
};

export default MyMap;
