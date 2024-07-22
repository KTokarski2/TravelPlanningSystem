import React, { useState } from 'react';
import { Button, Container, TextField, styled, Box } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { createTrip } from '../../services/TripsService';

const FormContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
}));

const FormBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(12),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5]
}));

const Form = styled('form')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
}));

const NewTripForm = () => {

    const [formData, setFormData] = useState({
        title: '',
        startingDate: '',
        endingDate: ''
    });

    const [errors, setErrors] = useState({
        title: '',
        startingDate: '',
        endingDate: ''
    });

    const navigate = useNavigate();

    const validateForm = () => {
        return true;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createTrip(
                formData.title,
                formData.startingDate, 
                formData.endingDate
            );
            if (response && response.status === 201) {
                navigate("/trips");
            }
        } catch (error) {
            console.error("Error while creating trip", error);
        }
    };

    return (
        <FormContainer maxWidth="sm">
            <FormBox>
                <Form onSubmit={handleSubmit}>
                    <TextField
                        id="title"
                        label="Title..."
                        variant="outlined"
                        value={formData.title}
                        onChange={handleChange}
                        error={!!errors.title}
                        helperText={errors.title}
                        fullWidth
                        sx={{ margin: '5px' }} />
                    <TextField
                        id="startingDate"
                        type="date"
                        label="Start"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="outlined"
                        value={formData.startingDate}
                        onChange={handleChange}
                        error={!!errors.startingDate}
                        helperText={errors.startingDate}
                        fullWidth
                        sx={{ margin: '5px' }} />
                    <TextField
                        id="endingDate"
                        type="date"
                        label="End"
                        InputLabelProps={{
                            shrink: true
                        }}
                        variant="outlined"
                        value={formData.endingDate}
                        onChange={handleChange}
                        error={!!errors.endingDate}
                        helperText={errors.endingDate}
                        fullWidth
                        sx={{ margin: '5px' }} />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ margin: '5px' }}>
                        Create trip
                    </Button>
                </Form>
            </FormBox>
        </FormContainer>
    )

}

export default NewTripForm;