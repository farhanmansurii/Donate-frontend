import React from 'react';

// Define the theme object
const Theme = {
    fontPrimary: "'Poppins', sans-serif",
    fontSecondary: "'Playfair Display', serif",
    primary: '#C9A86A', // Muted gold
    secondary: '#8A7968', // Warm taupe
    accent: '#D64C31', // Deep coral
    background: '#0F1419', // Rich dark blue-gray
    surface: '#1E2328', // Slightly lighter blue-gray
    text: '#F2F2F2', // Off-white
    textDark: '#A0A0A0', // Medium gray
};

// Create a functional component
const Contact = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: Theme.background,
            color: Theme.text,
            fontFamily: Theme.fontPrimary,
            textAlign: 'center'
        }}>
            <h1 style={{
                fontSize: '5rem', // Large size for the text
                margin: 0,
                color: '#C9A86A',
                textShadow: `2px 2px ${Theme.secondary}`
            }}>
                Coming Soon...
            </h1>
        </div>
    );
};

export default Contact;