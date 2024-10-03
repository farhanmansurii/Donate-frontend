import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Modal, Accordion } from 'react-bootstrap';
import API from './../../utils/API';
import Loading from './../../utils/Loading';
import styled from 'styled-components';

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
    const [campaign, setCampaign] = useState(null);
    const [donorName, setDonorName] = useState('');
    const [amountDonated, setAmountDonated] = useState('');
    const setDonorNameFromSession = () => {
        const userObject = JSON.parse(sessionStorage.getItem('userData'));
        const name = userObject && userObject.name ? userObject.name : 'Anonymous';
        setDonorName(name);
    };

    const handleAmountChange = (e) => {
        const value = (e.target.value);
        setAmountDonated(value);
    };

    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);

    const CampaignCard = styled.div`
        background-color: ${Theme.surface};
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
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

    const Paragraph = styled.p`
        font-size: 1.1rem;
        line-height: 1.8;
        margin-bottom: 1rem;
        color: ${Theme.textDark};
    `;

    useEffect(() => {
        loadCampaignDetails();
        setDonorNameFromSession();
    }, []);

    const loadCampaignDetails = async () => {
        setIsLoading(true);
        const campaignId = window.location.pathname.split('/').pop();
        try {
            const res = await API.getAllCampaigns();
            const campaignDetails = res.data.find(campaign => campaign._id === campaignId);
            if (campaignDetails) {
                setCampaign(campaignDetails);
            } else {
                console.error('Campaign not found');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDonationSubmit = async () => {
        try {
            await API.donateToCampaign(campaign._id, { donorName, amount: 979994 });
            await loadCampaignDetails();
            setAmountDonated('');
            setShowModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading || !campaign) {
        return <Loading />;
    }

    const progressPercentage = (campaign.amountRaised / campaign.goal) * 100;

    return (
        <Container fluid style={{ backgroundColor: Theme.background, color: Theme.text, padding: "2rem 0" }}>
            <Row className="justify-content-center">
                <Col md={8}>
                    <CampaignCard>
                        <CampaignContent>
                            <CampaignTitle>{campaign.title}</CampaignTitle>
                            <Paragraph>{campaign.description}</Paragraph>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <Paragraph>Country: {campaign.country}</Paragraph>
                                <Paragraph>ZIP Code: {campaign.zipCode}</Paragraph>
                            </div>
                            <Paragraph>Status: {campaign.status}</Paragraph>
                            <Paragraph>Recipient: {campaign.recipient}</Paragraph>
                            <ProgressBar>
                                <Progress percent={progressPercentage} />
                            </ProgressBar>
                            <Paragraph>
                                ${campaign.amountRaised} raised of ${campaign.goal} goal
                            </Paragraph>
                            <Paragraph>Remaining Amount: ${campaign.remainingAmount}</Paragraph>
                            <Paragraph>Top Donor: {campaign.topDonor}</Paragraph>
                            <Paragraph>Created On: {new Date(campaign.createdOn).toLocaleDateString()}</Paragraph>
                            {/* <Accordion defaultActiveKey="0">
                                <AccordionContext eventKey="0">
                                    <Accordion.Header>Recent Donations</Accordion.Header>
                                    <Accordion.Body>
                                        {campaign.donations.map((donation, index) => (
                                            <Paragraph key={index}>
                                                {donation.donorName}: ${donation.amount}
                                            </Paragraph>
                                        ))}
                                    </Accordion.Body>
                                </AccordionContext>
                            </Accordion> */}
                            <Form onSubmit={handleDonationSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Donor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={donorName}
                                        onChange={(e) => {
                                            e.preventDefault()
                                            setDonorName(e.target.text)
                                        }}
                                        placeholder="Enter your name (or leave blank for Anonymous)"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Donation Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={amountDonated}
                                        onChange={handleAmountChange}
                                        placeholder="Enter donation amount"

                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Donate
                                </Button>
                            </Form>

                        </CampaignContent>
                    </CampaignCard>
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thank You!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your donation has been successfully processed.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DonateDetails;
