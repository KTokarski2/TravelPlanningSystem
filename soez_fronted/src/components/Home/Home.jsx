import { Container, Typography, styled } from '@mui/material';
import React from 'react';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: '5rem'
}));

const Home = () => {
    return(
        <main>
            <StyledContainer maxWidth='sm'>
                <Typography variant='h2' align='center' color='textPrimary' gutterBottom>
                    Travel planning system
                </Typography>
                <Typography variant='h5' align='center' color='textSecondary' paragraph>
                    Welcome to SoezTrip, your reliable partner in planning the perfect trip!
                    Our platform allows you to easily and intuitively create travel plans
                    tailored to your individual needs and preferences. With SoezTrip, 
                    you can discover new destinations, manage reservations, 
                    track your plans in real-time, and share your adventures with others. 
                    Join our community of travelers and make every journey unforgettable!
                </Typography>
            </StyledContainer>
        </main>
    )
}

export default Home;