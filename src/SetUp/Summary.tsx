import axios from 'axios';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { clearJobName } from '../features/setup/jobSlice'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import Modal from 'react-bootstrap/Modal';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const Summary = ({ show, setModalShow }: { show: boolean; setModalShow: (show: boolean) => void }) => {

    const dispatch = useDispatch<AppDispatch>();
    const jobState = useSelector((state: RootState) => state.job);
    const automationState = useSelector((state: RootState) => state.automation);
    const automation_id = jobState.automation_id;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');

    const handleClose = () => {
        setSuccess('')
        setError('')
        setLoading(false)
        setModalShow(false);
    };

    // Handle form submission with validation
    // TODO: Fix this by setting up a const of Job and Automation objects with full data needed (alerting, etc..).
    const handleSubmit = async () => {
        setError("");
        setLoading(true)
        try {
            const findMissingFields = (obj: Record<string, any>) =>
                Object.entries(obj)
                    .filter(([key, value]) => value === null || value === undefined || value === "" || value < 0)
                    .map(([key]) => key); // Return the keys of missing fields
            const missingAutomationFields = findMissingFields(automationState.parameters);
            const missingJobFields = findMissingFields(jobState);

            if (jobState.user_id < 1) {
                setError('Your session has expired or your user ID is invalid. Please log in again.');
                return;
            }

            // if (Object.keys(settings.data.parameters).length !== Object.keys(automationState.parameters).length) {
            //     setError('Please fill in all fields on the "Configure Automation Settings" Page.');
            //     return;
            // }

            if (missingAutomationFields.length > 0) {
                setError(`Please fill in the following fields on the "Configure Automation Settings" Page:\n${missingAutomationFields.join(', ')}`);
                return;
            }

            if (missingJobFields.length > 0) {
                setError(`Please fill in the following fields on the "Build Scheduler" Page:\n${missingJobFields.join(', ')}`);
                return;
            }

            const jobData = {
                name: jobState.name,
                start_date: jobState.start_date,
                end_date: jobState.end_date,
                active: true,
                continuous: jobState.continuous,
                interval: jobState.interval,
                time_unit: jobState.time_unit,
                specific_time: jobState.specific_time,
                automation_id: automation_id,
                user_id: jobState.user_id,
                parameters: automationState.parameters // Get automation parameters from Redux
            };

            await axios.post(`${baseUrl}/create-job`, jobData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccess(`The Automation Schedule was Created. The Automation "${jobState.automation_id}" is Scheduled to Run.\n
                Feel Free to Build a New Automation Schedule!`);
            dispatch(clearJobName());
            handleClose()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'An axios error occurred. Please try again.';
                console.error('Error response:', errorMessage);
                setError(errorMessage.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed") ? `"${jobState.name}" is Already in Use` : `${errorMessage}`)
                return;
            }
            console.error('An unknown error occurred:', (error as Error).message || error);
            setError('An unknown error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={loading ? "static" : true} // Conditional backdrop
            keyboard={!loading} // Disable keyboard interaction when loading
        >
            {/* Modal content goes here */}

            <Modal.Header closeButton>
                <Modal.Title>{jobState.name || ""} Schedule Details</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Row>
                        <Col md={12}>
                            Start Date: {jobState.start_date}
                        </Col>
                        <Col md={12}>
                            End Date: {jobState.end_date}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            Run "{jobState.automation_id || 'This Automation'}"{' '}
                            every {jobState.interval || 'N/A'} {jobState.time_unit || 'N/A'}{' '}
                            at {jobState.specific_time || 'N/A'}{' '}
                            until {jobState.continuous ? 'the criteria is met' : 'the end date is reached'}.
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>

            <Modal.Footer className="flex-column align-items-end">
                <Row>
                    <Col>
                        {/* TODO: Submit Data */}
                        <LinkContainer to="/setup/confirmation">
                            <Nav.Link>
                                {/* <Button onClick={handleSubmit} disabled={loading || success.length > 0} variant="primary"> */}
                                <Button
                                    onClick={handleClose}
                                    disabled={loading || success.length > 0}
                                    variant="primary"
                                >
                                    Create Automation Schedule
                                </Button>
                            </Nav.Link>
                        </LinkContainer>

                    </Col>
                </Row>
                {error && (
                    <Row>
                        <Col className="text-danger text-end">{error}</Col>
                    </Row>
                )}
            </Modal.Footer>
        </Modal >
    )
}