import { Button, Container, TextField, styled, Box } from "@mui/material";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { isRequired, isValidEmail, checkLength } from '../../services/Validation';
import { login, register } from "../../services/AuthenticationService";
import { setAuthHeader } from "../../services/Authconfig";

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

const RegisterForm = () => {

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const validateForm = () => {
        
        const newErrors = {};

        if (!isRequired(formData.firstName)) {
            newErrors.firstName = "First name is required";
        }
        if (!isRequired(formData.lastName)) {
            newErrors.lastName = "Last name is required";
        }
        if (!isValidEmail(formData.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!checkLength(formData.password, 6, 20)) {
            newErrors.password = "Invalid password (6-20 characters)";
        }

        setErrors(newErrors);    
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await register(formData.firstName, formData.lastName, formData.email, formData.password);
                if (response && response.status === 201) {
                    setAuthHeader(null);
                    const loginRequest = await login(formData.email, formData.password);
                    if (loginRequest && loginRequest.status === 200) {
                        setAuthHeader(loginRequest.data.accessToken);
                        navigate("/trips");
                    }
                }
            } catch(error) {
                console.error("Error while register:", error);
            }
        }
    };

    return (
        <FormContainer maxWidth="sm">
            <FormBox>
                <Form onSubmit={handleSubmit}>
                    <TextField 
                        id="firstName" 
                        label="Name..." 
                        variant="outlined" 
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        sx={{ margin: '5px' }} />
                    <TextField 
                        id="lastName" 
                        label="Surname..." 
                        variant="outlined"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName} 
                        sx={{ margin: '5px' }} />
                    <TextField 
                        id="email" 
                        label="Email..." 
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email} 
                        sx={{ margin: '5px' }} />
                    <TextField 
                        id="password" 
                        type='password' 
                        label="Password..." 
                        variant="outlined"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password} 
                        sx={{ margin: '5px' }} />
                    <Button
                        type="submit" 
                        variant="contained" 
                        sx={{ margin: '5px' }}>
                            Register
                    </Button>
                </Form>
            </FormBox>
        </FormContainer>
    )
}

export default RegisterForm;