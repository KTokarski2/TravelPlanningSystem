import styled from "@emotion/styled";
import { Button, Container, Grid, Typography, Card, CardMedia, CardContent, CardActions, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { deleteTrip, formatDate, getAllTrips, getTripPhoto } from "../../services/TripsService";
import { getRandomPhoto } from "../../services/PhotoService";
import { setTripPhoto } from "../../services/TripsService";
import { arrayBufferToBase64 } from "../../services/ProfileService";

const MainContainer = styled(Container)(({ theme }) => ({
    marginTop: '2rem'
}));

const CardGrid = styled(Container)(({ theme }) => ({
    padding: '20px 0'
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    paddingTop: '56.25%' // 16:9
}));

const Trip = () => {

    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(1);
    const [tripsPhotos, setTripsPhotos] = useState({});
    const itemsPerPage = 9;
    const count = Math.ceil(trips.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const paginatedTrips = trips.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const navigate = useNavigate();

    const fetchTrips = async () => {
        const trips = await getAllTrips();
        setTrips(trips);
        const photos = {};
        for (const trip of trips) {
            try {
                const photoData = await getTripPhoto(trip.id);
                if (photoData && photoData.data) {
                    const base64Flag = 'data:image/png;base64,';
                    const base64Image = arrayBufferToBase64(photoData.data);
                    photos[trip.id] = base64Flag + base64Image;
                }
            } catch (error) {
                console.error("Error while getting trip photo", error);
            }
        }
        setTripsPhotos(photos);
    }

    const handleDeleteTrip = async (id) => {
        try {
            await deleteTrip(id);
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
        } catch(e) {
            console.error("Error while deleting trip", e);
        }
    }

    const handleTripPhotoChange = async (event, tripId) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            try {
                const response = await setTripPhoto(tripId, file);
                if (response && response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error while setting trip photo")
            }
        }
    }

    useEffect(() => {
        fetchTrips();
    }, [])

    return (
        <>
            <MainContainer maxWidth="sm">
                <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                    Your trips
                </Typography>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Button variant="contained" onClick={() => navigate('/trips/new')}>
                        Create new trip
                    </Button>
                </Grid>
            </MainContainer>
            <CardGrid maxWidth="md">
                <Grid container spacing={4}>
                    {
                        paginatedTrips.map((trip) => (
                            <Grid item key={trip.id} xs={12} sm={6} md={4}>
                                <StyledCard>
                                    <StyledCardMedia
                                        image={tripsPhotos[trip.id] ? tripsPhotos[trip.id] : getRandomPhoto()}
                                        title="Image title"
                                        onClick={() => document.getElementById(`tripPhotoInput-${trip.id}`).click()}
                                    />
                                    <input
                                        id={`tripPhotoInput-${trip.id}`}
                                        type="file"
                                        style={{display: 'none'}}
                                        onChange={(event) => handleTripPhotoChange(event, trip.id)} 
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5">
                                            {trip.title}
                                        </Typography>
                                        <Typography>
                                            {formatDate(trip.startingDate)} - {formatDate(trip.endingDate)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button 
                                            size="small" 
                                            variant="contained"
                                            onClick={() => navigate(`/trips/details/${trip.id}`)} 
                                            startIcon={<InfoIcon/>}>
                                                Details
                                        </Button>
                                        <Button 
                                            size="small" 
                                            variant="contained"
                                            onClick={() => handleDeleteTrip(trip.id)} 
                                            startIcon={<DeleteIcon/>}>
                                                Delete
                                        </Button>
                                    </CardActions>
                                </StyledCard>
                            </Grid>
                        ))
                    }
                </Grid>
                <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
                    <Pagination count={count} page={page} onChange={handlePageChange} color="primary" />
                </Grid>
            </CardGrid>
        </>
    )
}

export default Trip;