import React, { useState } from 'react';
import styled from 'styled-components';
import API from './../../utils/API'; // Assuming API is imported from a file
import { withRouter } from 'react-router-dom'; // Import withRouter
import video from "../videos/people_walking_on_street.mp4";

// Full Page Background Video
const FullPageBackground = styled.div`
    position: relative;
    height: 100vh; /* Full height of the viewport */
    overflow: hidden; /* Hide overflow */
`;

const BackgroundVideo = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Cover the entire area */
    z-index: 0; /* Behind other content */
`;

const Container = styled.div`
    position: relative; /* Position relative for z-index */
    background-color: rgba(30, 35, 40, 0.7); /* Semi-transparent overlay */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    width: 400px;
    margin: auto;
    z-index: 1; /* Above the video */
    margin-top: 225px;
`;

const Title = styled.h1`
    font-family: 'Playfair Display', serif;
    text-align: center;
    color: #C9A86A;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-bottom: 5px;
    color: #F2F2F2;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #8A7968;
    color: #F2F2F2;
    margin-bottom: 15px;

    &::placeholder {
        color: #A0A0A0;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #D64C31;
    border: none;
    border-radius: 4px;
    color: #F2F2F2;
    font-weight: bold;

    &:hover {
        background-color: #C94C31; /* Darker shade on hover */
    }
`;

const SignIn = (props) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const decodeJwt = (token) => {
        // Split the token into parts
        const base64Url = token.split('.')[1]; // Get the payload part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL safe characters
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')); // Decode base64 and convert to JSON
    
        return JSON.parse(jsonPayload); // Parse JSON string to object
    };
    
    // Example usage in your SignIn component
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.login(credentials);
            if (response.status === 200) {
                const token = response.data.token; // Assuming token is in response.data.token
                const decodedPayload = decodeJwt(token); // Decode the JWT
                
                // Store user data in session storage
                sessionStorage.setItem('userData', JSON.stringify(decodedPayload)); 
                console.log('Sign In successful:', decodedPayload);
                
                props.history.push('/'); // Redirect to home page
            }
        } catch (error) {
            console.error('Error signing in:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <FullPageBackground>
            <BackgroundVideo autoPlay loop muted>
                <source src={video} type="video/mp4"/>
            </BackgroundVideo>
            <Container>
                <Title>Sign In</Title>
                <Form onSubmit={handleSubmit}>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={credentials.email} 
                        onChange={handleChange} 
                        required 
                    />
                    
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={credentials.password} 
                        onChange={handleChange} 
                        required 
                    />
                    
                    <Button type="submit">Sign In</Button>
                </Form>
            </Container>
        </FullPageBackground>
    );
};

export default withRouter(SignIn); // Export withRouter