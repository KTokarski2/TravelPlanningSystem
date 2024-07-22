import { Avatar, Container, TextField, Box, styled, Paper, Button, IconButton, Typography, Divider, Grid } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from "react";
import { arrayBufferToBase64, getCurrentUserData, getProfilePhoto, getProfileStats, setProfilePhoto } from "../../services/ProfileService";

const ProfilePicture = styled(Avatar)(({ theme }) => ({
    width: '100px',
    height: '100px',
    marginRight: '10px',
    cursor: 'pointer',

}));

const MainContainer = styled(Container)(({ theme }) => ({
    marginTop: '2rem',
    alignItems: 'center',
    flexDirection: 'column',
}));

const MainProfileDataForm = styled(Paper)(({ theme }) => ({

    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '2rem',
    boxShadow: theme.shadows[5],
    maxWidth: 'xs',
    padding: '1rem',
    width: '100%'
}));

const ProfileStats = styled(Paper)(({ theme }) => ({

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem',
    boxShadow: theme.shadows[5],
    maxWidth: 'xs',
    padding: '1rem',
    width: '100%'
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: '2rem',
    width: '100%'
}));

const StatItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 1rem'
}));

const MyProfile = () => {

    const [profilePicture, setProfilePicture] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userInitials, setUserInitials] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: ''
    });

    const [usersStats, setUserStats] = useState({});

    const handleProfilePictureClick = () => {
        document.getElementById('profilePictureInput').click();
    };

    const getUserInitials = (firstName, lastName) => {
        if (!firstName || !lastName) {
            return '';
        }
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName.charAt(0).toUpperCase();

        return firstInitial + lastInitial;
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            try {
                const response = await setProfilePhoto(formData.id, file);
                if (response && response.status === 200) {
                    window.location.reload();
                }
            } catch (e) {
                console.error("Error while setting photo", e);
            }
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleApplyClick = () => {
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

    const fetchUserData = async () => {
        const data = await getCurrentUserData();
        if (data) {
            setFormData(data);
            setUserInitials(getUserInitials(formData.firstName, formData.lastName));
        }
    };

    const fetchUserStats = async (id) => {
        const stats = await getProfileStats(id);
        if (stats) {
            setUserStats(stats);
        }
    }

    const fetchUserProfilePicture = async (id) => {
        const response = await getProfilePhoto(id);
        if (response && response.data) {
            const base64Flag = 'data:image/png;base64,';
            const base64Image = arrayBufferToBase64(response.data);
            setProfilePicture(base64Flag + base64Image);
        }
    };
    

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (formData && formData.id) {
            fetchUserProfilePicture(formData.id);
            fetchUserStats(formData.id);
        }
    }, [formData]);
    

    return (
        <>
            <MainContainer maxWidth="sm">
                <MainProfileDataForm>
                    <MainBox>
                        <IconButton onClick={handleProfilePictureClick} style={{ padding: 0 }}>
                            {profilePicture ? (
                                <ProfilePicture src={profilePicture} alt="Profile Picture" />
                            ) : (
                                <ProfilePicture>{userInitials}</ProfilePicture>
                            )}
                        </IconButton>
                        <input
                            id="profilePictureInput"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleProfilePictureChange}
                        />
                        <TextFieldsBox>
                            <TextField
                                value={formData.firstName}
                                disabled={!isEditing}
                                id="firstName"
                                label="Name"
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
                                value={formData.lastName}
                                disabled={!isEditing}
                                id="lastName"
                                label="Surname"
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
                                value={formData.email}
                                disabled={!isEditing}
                                id="email"
                                label="Email"
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
                        <Button variant="contained" endIcon={<EditIcon />} onClick={handleEditClick}>
                            Edit
                        </Button>
                    )}
                </MainProfileDataForm>
                <ProfileStats>
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <StatItem>
                                <Typography variant="h4">{usersStats.trips}</Typography>
                                <Typography variant="body2">Trips</Typography>
                            </StatItem>
                        </Grid>
                        <Grid item>
                            <StatItem>
                                <Typography variant="h4">{usersStats.places}</Typography>
                                <Typography variant="body2">Places</Typography>
                            </StatItem>
                        </Grid>
                        <Grid item>
                            <StatItem>
                                <Typography variant="h4">{usersStats.friends}</Typography>
                                <Typography variant="body2">Friends</Typography>
                            </StatItem>
                        </Grid>
                    </Grid>
                </ProfileStats>
            </MainContainer>
        </>
    )
};

export default MyProfile;