import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import API from './../../utils/API'; // Adjust the import path as necessary
import Loading from './../../utils/Loading';
import formatDate from './../../utils/DateFormatter';

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
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Amount Raised</th>
                                            <th>Amount Remaining</th>
                                            <th>Top Donor</th>
                                            <th>Created By</th>
                                            <th>Created On</th>
                                            <th>Enter Donation</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donateForm.map(({ _id, title, description, amountRaised, remainingAmount, donations, createdUsername, createdUserEmail, createdOn }, index) => {
                                            // Find the top donor
                                            const topDonor = donations.length > 0 
                                                ? donations.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) 
                                                : null;

                                            return (
                                                <tr key={_id}>
                                                    <td>{title}</td>
                                                    <td>{description}</td>
                                                    <td>{amountRaised}</td>
                                                    <td>{remainingAmount}</td>
                                                    <td>
                                                        {topDonor ? (
                                                            <React.Fragment>
                                                                {topDonor.donorName}<br />
                                                                <span style={{ fontStyle: 'italic', color: '#C9A86A' }}>
                                                                    (${topDonor.amount})
                                                                </span>
                                                            </React.Fragment>
                                                        ) : (
                                                            'No Top Donor'
                                                        )}
                                                    </td>
                                                    <td>
                                                        {createdUsername}<br />
                                                        <span style={{ fontStyle: 'italic', color: '#C9A86A' }}>
                                                            ({createdUserEmail})
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(createdOn)}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            value={amountDonated[index]} // Bind to specific index
                                                            onChange={(event) => handleInputChange(index, event)} // Pass index to handler
                                                            placeholder='Amount'
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button 
                                                            variant="success" 
                                                            style={{ borderRadius: '5px', padding: '10px 20px', fontWeight: 'bold' }} 
                                                            onClick={() => handleDonationSuccess(_id, index)}
                                                        >
                                                            Donate
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>

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