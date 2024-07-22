import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, styled, Paper, InputBase, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getFriends } from "../../services/FriendsService";
import { addPersonToTrip } from "../../services/TripsService";

const MainContainer = styled(Container)(({ theme }) => ({
    marginTop: '2rem',
    alignItems: 'center',
    flexDirection: 'column',
}));

const SearchForm = styled(Paper)(({ theme }) => ({
    p: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '2rem',
    boxShadow: theme.shadows[5],
    maxWidth: 'md'
}));

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const ResultBox = styled(Grid)(({ theme }) => ({
    justifyContent: 'center',
    alignItems: 'center',
    direction: 'column',
    boxShadow: theme.shadows[5],
    marginTop: '1rem',
    padding: '0.5rem'
}));

const AddFriendsForm = () => {

    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredFriends, setFilteredFriends] = useState([]);
    const navigate = useNavigate();
    const { tripId } = useParams();
    console.log(tripId);

    const fetchFriends = async () => {
        const friendsData = await getFriends();
        setFriends(friendsData);
    }

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        const results = friends.filter(friend =>
            friend.email.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
        setFilteredFriends(results);
    }, [searchTerm, friends]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleAddFriendToTrip = async (email) => {
        try {
            const response = await addPersonToTrip(tripId, email);
            if (response && response.status === 200) {
                navigate(`/trips/details/${tripId}`);
            }
        } catch (error) {

        }
    }

    return (
        <>
            <MainContainer maxWidth="sm">
                <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                    Add friend to trip
                </Typography>
                <SearchForm
                    component="form"
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1, maxWidth: 'md' }}
                        placeholder="Enter email"
                        inputProps={{ 'aria-label': 'Enter email' }}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </SearchForm>
                <ResultBox item xs={12} md={6}>
                    <Typography sx={{ mt: 4, mb: 2, textDecoration: 'underline' }} variant="h6" align="center">
                        Friends found
                    </Typography>
                    <Demo>
                        <List dense={dense}>
                            {!searchTerm ? (
                                <Typography align="center">Enter friend's email to start search</Typography>
                            ) : filteredFriends.length === 0 ? (
                                <Typography align="center">No results</Typography>
                            ) : (
                                filteredFriends.map(friend => (
                                    <ListItem
                                        key={friend.id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="add-friend" onClick={() => handleAddFriendToTrip(friend.email)}>
                                                <AddIcon/>
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar>

                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${friend.firstName} ${friend.lastName}`}
                                            secondary={secondary ? 'Secondary text' : null}
                                        />
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Demo>
                </ResultBox>
            </MainContainer>
        </>
    )
};

export default AddFriendsForm;