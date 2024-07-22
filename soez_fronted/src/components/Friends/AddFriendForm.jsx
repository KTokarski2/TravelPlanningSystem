import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, styled, Paper, InputBase, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { addFriend, getEmails } from "../../services/FriendsService";

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
    const [emails, setEmails] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEmails, setFilteredEmails] = useState([]);
    const navigate = useNavigate();

    const fetchEmails = async () => {
        const emailsData = await getEmails();
        setEmails(emailsData);
    }

    useEffect(() => {
        fetchEmails();
    }, []);

    useEffect(() => {
        const results = emails.filter(email =>
            email.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEmails(results);
    }, [searchTerm, emails]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleAddFriend = async (id) => {
        try {
            await addFriend(id);
            navigate("/friends");
        } catch (error) {
            console.error("Error while adding friend", error);
        }
    }

    return (
        <>
            <MainContainer maxWidth="sm">
                <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                    Search for new friends
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
                        Users found
                    </Typography>
                    <Demo>
                        <List dense={dense}>
                            {!searchTerm ? (
                                <Typography align="center">Enter the email to start search</Typography>
                            ) : filteredEmails.length === 0 ? (
                                <Typography align="center">No results</Typography>
                            ) : (
                                filteredEmails.map(email => (
                                    <ListItem
                                        key={email.id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="add-friend" onClick={() => handleAddFriend(email.id)}>
                                                <PersonAddIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar>

                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${email.firstName} ${email.lastName}`}
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