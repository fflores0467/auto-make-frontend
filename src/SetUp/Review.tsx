import { findMissingFields } from '../constants/utils'; // Import the utility function
import { Header } from "./Header";
import { Footer } from './Footer';
import { Summary } from './Summary';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

export const Review = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const job = useSelector((state: RootState) => state.job);
    const automation = useSelector((state: RootState) => state.automation);

    // Check if job.arguments is empty and navigate back to /setup/automation
    useEffect(() => {
        const missingScheduleFields = findMissingFields(job);
        const missingArgumentsFields = findMissingFields(job.arguments);
        if (missingScheduleFields.length > 0 || missingArgumentsFields.length > 0) {
            console.error("Unable to proceed: Missing the fields from the following:", '\nbuild scheduler page', missingScheduleFields, '\nconfigure automation settings page', missingArgumentsFields)
            navigate('/setup/automation'); // Redirect to the schedule page if arguments are empty
        }
    }, [job, navigate]);

    const [error, setError] = useState('');

    // Summary Modal
    const [modalShow, setModalShow] = useState(false);

    // Prevent continue if any fields are missing
    const handleReview = (preventContinue: React.Dispatch<React.SetStateAction<boolean>>) => {
        // Function to find missing fields in an object
        const missingScheduleFields = findMissingFields(job);
        const missingArgumentsFields = findMissingFields(job.arguments);

        if (missingScheduleFields.length > 0 || missingArgumentsFields.length > 0) {
            preventContinue(true);
            setError('Please fill in all the required fields.');
            return;
        }

        setError('');
        preventContinue(false);
        setModalShow(true);
        preventContinue(true);
    };

    return (
        <Container fluid className="pt-3">
            <Card border="dark">
                <Card.Header>
                    <Header />
                </Card.Header>
                <Card.Body className="mb-2">
                    {/* Job Details Section */}
                    <Row className="mb-4">
                        <Col>
                            <Card>
                                <Card.Header as="h5">{job.name || "Schedule"} Details</Card.Header>
                                <Card.Body>
                                    <p>
                                        <strong>Start Date:</strong> {job.start_date}
                                    </p>
                                    <p>
                                        <strong>End Date:</strong> {job.end_date}
                                    </p>
                                    <p>
                                        Run "<strong>{automation.name || 'This Automation'}</strong>"{' '}
                                        every <strong>{job.interval || 'N/A'}</strong> <strong>{job.time_unit || 'N/A'}</strong>{' '}
                                        at <strong>{job.specific_time || 'N/A'}</strong>{' '}
                                        until <strong>{job.continuous ? 'the criteria is met' : 'the end date is reached'}</strong>.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Arguments Section */}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header as="h5">{automation.name || "Automation"} Details</Card.Header>
                                <Card.Body>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Key</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(job.arguments).map(([key, value]) => (
                                                <tr key={key}>
                                                    <td>{key}</td>
                                                    <td>{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {error && <p className="text-danger text-center mt-3">{error}</p>}
                    <Summary show={modalShow} setModalShow={setModalShow} />
                </Card.Body>
                <Card.Footer>
                    <Footer validate={handleReview} />
                </Card.Footer>
            </Card>
        </Container>
    );
};
