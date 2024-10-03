import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import API from './../../utils/API'; // Adjust the import path as necessary
import Loading from './../../utils/Loading';
import formatDate from './../../utils/DateFormatter';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Theme = {
    fontPrimary: "'Poppins', sans-serif",
    fontSecondary: "'Playfair Display', serif",
    primary: '#C9A86A',
    secondary: '#8A7968',
    accent: '#D64C31',
    background: '#0F1419',
    surface: '#1E2328',
    text: '#F2F2F2',
    textDark: '#A0A0A0',
};

const DonateDetails = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [donateForm, setDonateForm] = useState([]);
    const [open, setOpen] = useState(false);
    const [donorName, setDonorName] = useState('Anonymous');
    const [amountDonated, setAmountDonated] = useState(Array(donateForm.length).fill(''));
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
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

    const CampaignCard = styled.div`
  background-color: ${Theme.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

    const CampaignImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

    const CampaignContent = styled.div`
  padding: 1.5rem;
`;

    const CampaignTitle = styled.h3`
  font-family: ${Theme.fontSecondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${Theme.primary};
`;

    const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${Theme.background};
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

    const Progress = styled.div`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: ${Theme.secondary};
`;

    const H3 = styled.h3`
  font-family: ${Theme.fontSecondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #E0C9A6; // Soft gold color
`;
    const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: ${Theme.textDark};
`;
    useEffect(() => {
        loadCampaignDetails();

    }, []); // Empty dependency array means this runs once on mount

    const loadCampaignDetails = async () => {
        setIsLoading(true);
        const campaignId = window.location.pathname.split('/').pop(); // Extract _id from URL
        try {
            const res = await API.getAllCampaigns();
            const campaignDetails = res.data.find(campaign => campaign._id === campaignId);
            if (campaignDetails) {
                setDonateForm(campaignDetails); // Set the specific campaign details
            } else {
                console.error('Campaign not found');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false); // Ensure loading is turned off
        }
    };

    return (
        <Container fluid style={{ backgroundColor: Theme.background, color: Theme.text }}>
            <h1 style={{ fontWeight: "900", textAlign: "center", padding: "110px  0 0  ", fontFamily: Theme.fontPrimary, color: '#C9A86A' }}>
                {donateForm.title}
            </h1>
            <Paragraph>{donateForm.description}</Paragraph>
            <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:'1rem'}}>
            <Paragraph>Country: {donateForm.country}</Paragraph>
            <Paragraph>ZIP Code: {donateForm.zipCode}</Paragraph>
            </div>
            <div>
                <Paragraph>
                    Status : {donateForm.status}
                </Paragraph>
            </div>
        </Container>
    );
};

export default DonateDetails;
