import React, { useEffect, useState } from "react";
import { Button, Container, Grid, Typography, styled, Paper, InputBase, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import { getFriends } from "../../services/FriendsService";
import { arrayBufferToBase64, getProfilePhoto } from "../../services/ProfileService";

const MainContainer = styled(Container)(({ theme }) => ({
    marginTop: '2rem'
}));

const ResultBox = styled(Grid)(({ theme }) => ({
    justifyContent: 'center',
    alignItems: 'center',
    direction: 'column',
    boxShadow: theme.shadows[5],
    marginTop: '1rem',
    padding: '0.5rem'
}));

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

const Friends = () => {

    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    const [friends, setFriends] = useState([]);
    const [friendPhotos, setFriendPhotos] = useState({});
    const navigate = useNavigate();

    const fetchFriends = async () => {
        const friendsData = await getFriends();
        setFriends(friendsData);
        const photos = {};
        for (const friend of friendsData) {
            const photoData = await getProfilePhoto(friend.id);
            if (photoData) {
                const base64Flag = 'data:image/png;base64,';
                const base64Image = arrayBufferToBase64(photoData.data);
                photos[friend.id] = base64Flag + base64Image;
            }
        }
        setFriendPhotos(photos);
    }

    useEffect(() => {
        fetchFriends();
    }, [])

    return (
        <>
            <MainContainer maxWidth="sm">
                <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
                    Friends list
                </Typography>
                <Grid container spacing={2} justifyContent={"center"} marginTop={"2rem"}>
                    <Button variant="contained" onClick={() => navigate('/friends/add')}>
                        Add new friend
                    </Button>
                </Grid>
                <ResultBox item xs={12} md={6}>
                    <Typography sx={{ mt: 4, mb: 2, textDecoration: 'underline' }} variant="h6" align="center">
                        Friends:
                    </Typography>
                    <Demo>
                        <List dense={dense}>
                            {friends.length === 0 ? (
                                <Typography align="center">No friends added</Typography>
                            ) : (
                                friends.map(friend => (
                                    <ListItem
                                        key={friend.id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="add-friend" onClick={() => navigate(`/users/profile/${friend.id}`)}>
                                                <InfoIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={friendPhotos[friend.id]}>
                                                {!friendPhotos[friend.id] && `${friend.firstName[0]}${friend.lastName[0]}`}
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

}

export default Friends;