import React, { useEffect, useState } from "react";
import { Container, IconButton, List, MenuItem, ListItem, ListItemAvatar, Avatar, ListItemText, styled, Paper, Box, TextField, Button, Typography, Grid, Card, CardMedia, CardContent, CardActions, Pagination } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { deletePersonFromTrip, editTrip, formatDate, formatDateInput, getCurrentUserRole, getTrip, setTripRole } from "../../services/TripsService";
import { deletePlace, getPlacePhoto, getTripPlaces, setPlacePhoto } from "../../services/PlaceService";
import { getRandomPhoto } from "../../services/PhotoService";
import Chat from "../Chat/Chat";
import { arrayBufferToBase64, getProfilePhoto } from "../../services/ProfileService";

const MainDataContainer = styled(Container)(({ theme }) => ({
    marginTop: '2rem',
    alignItems: 'center',
    flexDirection: 'column',
}));

const ComponentSpace = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '2rem',
    boxShadow: theme.shadows[5],
    maxWidth: 'xs',
    padding: '1rem',
    width: '100%',
    marginBottom: '2rem'
}));

const MainBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: '2rem',
    width: '100%',
    marginBottom: '1rem'
}));

const TextFieldsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
}));

const DateFieldsBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '1rem',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    paddingTop: '56.25%' // 16:9
}));

const CardGrid = styled(Container)(({ theme }) => ({
    padding: '20px 0'
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
}));

function generate(element) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

const roles = [
    {
        value: 'OWNER',
        label: 'Owner',
    },
    {
        value: 'MANAGER',
        label: 'Manager',
    },
    {
        value: 'PARTICIPANT',
        label: 'Participant',
    }
];

const TripDetails = () => {

    const { id } = useParams();
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [places, setPlaces] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 9;
    const [usersPhotos, setUsersPhotos] = useState({});
    const [placesPhotos, setPlacesPhotos] = useState({});
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const count = Math.ceil(places.length / itemsPerPage);


    const handlePageChange = (event, value) => {
        setPage(value);
    }

    const paginatedPlaces = places.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        startingDate: '',
        endingDate: ''
    });

    const [tripData, setTripData] = useState({});

    const [chatroomId, setChatroomId] = useState(null);

    const [participants, setParticipants] = useState([]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleApplyClick = (e) => {
        e.preventDefault();
        handleSubmit(e);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value
        }));
    };

    const fetchPlaces = async () => {
        const places = await getTripPlaces(id);
        if (places) {
            setPlaces(places);
            for (const place of places) {
                try {
                    const photoData = await getPlacePhoto(place.id);
                    if (photoData && photoData.data) {
                        const base64Flag = 'data:image/png;base64,';
                        const base64Image = arrayBufferToBase64(photoData.data);
                        placesPhotos[place.id] = base64Flag + base64Image;
                    }
                } catch (error) {
                    console.error("Error while getting place photo", error);
                }
            }
            setPlacesPhotos(placesPhotos);
        }
    }

    const fetchCurrentUserRole = async () => {
        const data = await getCurrentUserRole(id);
        setCurrentUserRole(data);
    }

    const handlePlacePhotoChange = async (event, tripId, placeId) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            try {
                const response = await setPlacePhoto(tripId, placeId, file);
                if (response && response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error while setting place photo");
            }
        }
    }

    useEffect(() => {
        fetchCurrentUserRole();
        fetchPlaces();
    }, [])

    const fetchTrip = async () => {
        const tripData = await getTrip(id);
        console.log(tripData);
        if (tripData) {
            setFormData({
                ...tripData,
                startingDate: formatDateInput(tripData.startingDate),
                endingDate: formatDateInput(tripData.endingDate)
            });
            setParticipants(tripData.participants);
            for (const participant of tripData.participants) {
                const photoData = await getProfilePhoto(participant.id);
                if (photoData) {
                    const base64Flag = 'data:image/png;base64,';
                    const base64Image = arrayBufferToBase64(photoData.data);
                    usersPhotos[participant.id] = base64Flag + base64Image;
                }
            }
            setUsersPhotos(usersPhotos);
            setTripData(tripData);
        }
    }

    useEffect(() => {
        fetchTrip();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await editTrip(id, formData.startingDate, formData.endingDate, formData.title);
            if (response && response.status === 201) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error while editing trip", error);
        }
    };

    const handleDeletePlace = async (tripId, placeId) => {
        try {
            await deletePlace(tripId, placeId);
            setPlaces(prevPlaces => prevPlaces.filter(place => place.id !== placeId));
        } catch (erorr) {
            console.erorr("Error while deleting place: ", erorr)
        }
    }

    const handleRemoveParticipant = async (tripId, email) => {
        try {
            await deletePersonFromTrip(tripId, email);
            setParticipants(prevParticipants => prevParticipants.filter(participant => participant.email !== email));
        } catch (error) {
            console.error("Error while deleting participant", error);
        }
    };

    const handleRoleChange = async (participantId, value, email) => {
        setParticipants(prevParticipants =>
            prevParticipants.map(participant =>
                participant.id === participantId ? { ...participant, role: value } : participant
            )
        );
        try {
            const response = await setTripRole(id, email, value);
            if (response && response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error while setting role", error);
        }

    };

    return (
        <>
            <MainDataContainer maxWidth="sm">
                <Typography variant="h2" align="center" color="textPrimary" marginTop="4rem" gutterBottom>
                    Trip details
                </Typography>
                <ComponentSpace>
                    <MainBox>
                        <TextFieldsBox>
                            <TextField
                                value={formData.title}
                                disabled={!isEditing}
                                id="title"
                                label="Title"
                                variant="standard"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                sx={{
                                    marginTop: '10px'
                                }}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <DateFieldsBox marginTop="2rem">
                                <TextField
                                    value={formData.startingDate}
                                    disabled={!isEditing}
                                    type="date"
                                    id="startingDate"
                                    label="Starting date"
                                    variant="standard"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    sx={{
                                        marginTop: '10px'
                                    }}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    value={formData.endingDate}
                                    disabled={!isEditing}
                                    type="date"
                                    id="endingDate"
                                    label="Ending date"
                                    variant="standard"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    sx={{
                                        marginTop: '10px'
                                    }}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </DateFieldsBox>
                        </TextFieldsBox>
                    </MainBox>
                    {isEditing ? (
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                            <Button variant="contained" onClick={handleApplyClick}>
                                Apply
                            </Button>
                            <Button variant="outlined" onClick={handleCancelClick}>
                                Cancel
                            </Button>
                        </Box>
                    ) : (
                        <Button 
                            variant="contained" 
                            endIcon={<EditIcon />} 
                            onClick={handleEditClick}
                            disabled={currentUserRole !== 'OWNER' && currentUserRole !== 'MANAGER'}
                        >
                             Edit
                        </Button>
                    )}
                </ComponentSpace>
                <ComponentSpace>
                    <Typography sx={{ mt: 4, mb: 2, textDecoration: 'underline' }} variant="h6" align="center">
                        Participants
                    </Typography>
                    <List dense={dense} sx={{ width: '100%' }}>
                        {participants.map(participant => (
                            <ListItem
                                key={participant.id}
                                secondaryAction={
                                    <Box>
                                        <IconButton edge="end" aria-label="info" sx={{ marginRight: '5px' }} onClick={() => navigate(`/users/profile/${participant.id}`)}>
                                            <InfoIcon />
                                        </IconButton>
                                        <IconButton 
                                        edge="end" 
                                        aria-label="delete" 
                                        onClick={() => handleRemoveParticipant(id, participant.email)}
                                        disabled={currentUserRole !== 'OWNER' && currentUserRole !== 'MANAGER'}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar src={usersPhotos[participant.id]}>
                                        {!usersPhotos[participant.id] && `${participant.firstName[0]}${participant.lastName[0]}`}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${participant.firstName.toUpperCase()} ${participant.lastName.toUpperCase()}`}
                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                    secondary={
                                        <TextField
                                            sx={{ marginTop: '8px', width: '130px' }}
                                            id={`outlined-select-role-${participant.id}`}
                                            select
                                            disabled={currentUserRole !== 'OWNER'}
                                            value={participant.role || 'PARTICIPANT'}
                                            onChange={(e) => handleRoleChange(participant.id, e.target.value, participant.email)}
                                            size="small"
                                        >
                                            {roles.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Button 
                    variant="contained" 
                    sx={{ margin: '10px' }} 
                    onClick={() => navigate(`/trips/${id}/add-friend`)}
                    disabled={currentUserRole !== 'OWNER' && currentUserRole !== 'MANAGER'}
                    >
                        Add participant
                    </Button>
                </ComponentSpace>
                <ComponentSpace>
                    <Typography sx={{ mt: 4, mb: 2, textDecoration: 'underline' }} variant="h6" align="center">
                        Group chat
                    </Typography>
                    <Chat chatRoomId={tripData.chatRoomId} />
                </ComponentSpace>
            </MainDataContainer>
            <Container maxWidth="sm">
                <Typography variant="h3" align="center" color="textPrimary" marginTop="4rem" gutterBottom>
                    Places list
                </Typography>
                <div>
                    <Grid container spacing={2} justifyContent={"center"}>
                        <Grid item>
                            <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => navigate(`/trips/${id}/places/new`)}
                            disabled={currentUserRole !== 'OWNER' && currentUserRole !== 'MANAGER'}
                            >
                                Add new place
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Container>
            <CardGrid maxWidth="md">
                <Grid container spacing={4}>
                    {
                        paginatedPlaces.map((place) => (
                            <Grid item key={place.id} xs={12} sm={6} md={4}>
                                <StyledCard>
                                    <StyledCardMedia
                                        image={placesPhotos[place.id] ? placesPhotos[place.id] : getRandomPhoto()}
                                        title="Image title"
                                        onClick={() => document.getElementById(`tripPhotoInput-${place.id}`).click()}
                                    />
                                    <input
                                        id={`tripPhotoInput-${place.id}`}
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(event) => handlePlacePhotoChange(event, id, place.id)}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5">
                                            {place.name}
                                        </Typography>
                                        <Typography>
                                            {formatDate(place.arrive)} - {formatDate(place.leave)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <CardActions>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => navigate(`/trips/${id}/places/details/${place.id}`)}
                                                startIcon={<InfoIcon />}>
                                                Details
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleDeletePlace(id, place.id)}
                                                startIcon={<DeleteIcon />}>
                                                Delete
                                            </Button>
                                        </CardActions>
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
    );
}

export default TripDetails;
