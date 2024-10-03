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

const DonateForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [donateForm, setDonateForm] = useState([]);
    const [open, setOpen] = useState(false);
    const [donorName, setDonorName] = useState('Anonymous');
    const [amountDonated, setAmountDonated] = useState(Array(donateForm.length).fill(''));
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadCampaigns();
        setDonorNameFromSession(); // Set donor name after component mounts
    }, []); // Empty dependency array means this runs once on mount

    const loadCampaigns = async () => {
        setIsLoading(true);
        try {
            const res = await API.getAllCampaigns();
            setDonateForm(res.data);
            console.log(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false); // Ensure loading is turned off
        }
    };

    const handleInputChange = (index, event) => {
        const newAmountDonated = [...amountDonated];
        newAmountDonated[index] = event.target.value; // Update only the specific index
        setAmountDonated(newAmountDonated);
    };

    const handleDonationSubmit = async (id, index) => {
        try {
            const amount = amountDonated[index];
            await API.donateToCampaign(id, { donorName, amount: amount });
            // Refresh campaigns after successful donation
            await loadCampaigns(); // Load updated campaign data
            setAmountDonated(''); // Reset input field after donation
            // Optionally show success message here
        } catch (err) {
            console.error(err);
        }
    };

    const handleDonationSuccess = (id, index) => {
        handleDonationSubmit(id, index);
        setShowModal(true); // Show the modal on successful donation
    };

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
    // Method to set donor name based on login status
    const setDonorNameFromSession = () => {
        const userObject = JSON.parse(sessionStorage.getItem('userData'));
        const name = userObject && userObject.name ? userObject.name : 'Anonymous';
        setDonorName(name);
    };

    return (
        <Container fluid style={{ backgroundColor: Theme.background, color: Theme.text }}>
            {isLoading ? (
                <Loading isLoading={isLoading} /> // Show loading component if loading
            ) : (
                <Row>
                    <Col size="md-6 sm-12">
                        {donateForm.length ? (
                            <div>
                                <h1 style={{ fontWeight: "900", textAlign: "center", margin: "110px 0px 20px", fontFamily: Theme.fontPrimary, color: '#C9A86A' }}>
                                    All Active Campaigns
                                </h1>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '2rem',
                                    margin: '2rem 0rem'
                                }}>
                                    {donateForm.map(({ _id, title, description, amountRaised, remainingAmount, donations, createdUsername, createdUserEmail, createdOn }, index) => {
                                        const goalAmount = amountRaised + remainingAmount;
                                        const progressPercentage = (amountRaised / goalAmount) * 100;

                                        return (
                                            <Link to={`/donate/${_id}`}>
                                                <CampaignCard key={_id} className="grid-item">
                                                    <CampaignContent>
                                                        <CampaignTitle>{title}</CampaignTitle>
                                                        <ProgressBar className="progress-bar" data-progress={progressPercentage.toFixed(0)}>
                                                            <Progress style={{ width: `${progressPercentage}%` }} />
                                                        </ProgressBar>
                                                        <Paragraph>${amountRaised.toLocaleString()} raised of ${goalAmount.toLocaleString()} goal</Paragraph>
                                                        {createdUsername && <Paragraph style={{ fontStyle: 'italic', fontSize: '15px' }}>created by : {createdUsername}</Paragraph>}
                                                    </CampaignContent>
                                                </CampaignCard>
                                            </Link>
                                        );
                                    })}
                                </div>
                                {/* Modal for Donation Success */}
                                <Modal show={showModal} onHide={handleClose} centered style={{ backgroundColor: Theme.background }}>
                                    <Modal.Body style={{ textAlign: 'center', backgroundColor: Theme.background }}>
                                        <h4 style={{ color: '#C9A86A' }}>Thanks for your donation!</h4>
                                        {/* Animated Smiley */}
                                        {/* <FaSmile size={50} className="animate__animated animate__bounce" /> */}
                                        <Button variant="outline-dark" onClick={handleClose} style={{ marginTop: '20px' }}>
                                            Close
                                        </Button>
                                    </Modal.Body>
                                </Modal>

                            </div>
                        ) : (
                            <h3>No Results to Display</h3>
                        )}
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default DonateForm;
