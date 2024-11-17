import { Loading } from '../components/Loading'
import { Header } from "./Header";

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setAutomationState } from '../features/setup/automationSlice';
import { clearJobName } from '../features/setup/jobSlice'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const Automation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const jobState = useSelector((state: RootState) => state.job);
    const automationState = useSelector((state: RootState) => state.automation);
    const automation_id = jobState.automation_id;

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');

    // settings schema from the database, stored in state for user input boxes
    const [settings, setSettings] = useState({
        message: "",
        data: {
            automation_id: 0,
            name: '',
            parameters: {} as Record<string, string>
        }
    });

    useEffect(() => {
        if (automation_id && automation_id > 0) {
            setError("");
            setLoading(true);
            axios.get(`${baseUrl}/read-automation`, {
                params: { id: encodeURIComponent(automation_id) },
                timeout: 5000,
            })
                .then((response) => {
                    const json = response.data;
                    try {
                        const parsedParameters = JSON.parse(json.data.parameters);
                        setSettings({
                            ...json,
                            data: {
                                ...json.data,
                                parameters: parsedParameters,
                            }
                        });
                        setError("");
                    } catch (error) {
                        console.error('Failed to parse parameters:', error);
                        setError("An error occurred while parsing automation parameters.");
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch automation parameters:', err);
                    setError("An error occurred while fetching automation parameters.");
                })
                .finally(() => setLoading(false));
        } else {
            setError('Please select an automation from the "Build Automation" Page.');
            setLoading(false);
        }
    }, [automation_id]);

    // Dispatch automation state in redux to keep data globally
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        dispatch(setAutomationState({ field: name, value })); // Update automation parameters in Redux
    };

    // Handle form submission with validation
    const handleSubmit = async () => {
        setError("");
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

        if (Object.keys(settings.data.parameters).length !== Object.keys(automationState.parameters).length) {
            setError('Please fill in all fields on the "Configure Automation Settings" Page.');
            return;
        }

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

        try {
            setLoading(true);
            await axios.post(`${baseUrl}/create-job`, jobData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccess(`The Automation Schedule was Created. The Automation "${settings.data.name}" is Scheduled to Run.\n
                Feel Free to Build a New Automation Schedule!`);
            dispatch(clearJobName());
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'An error occurred';
                console.error('Error response:', errorMessage);
                setError(errorMessage.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed") ? `"${jobState.name}" is Already in Use` : `${errorMessage}`)
                return;
            }
            console.error('An unknown error occurred:', (error as Error).message || error);
            setError('An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Loading Header={<Header />}></Loading>
        );
    }

    const borderType = error ? 'danger' : success ? 'success' : 'secondary';
    return (
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
                <Card.Header>
                    <Header />
                </Card.Header>
                <Card.Body>
                    {(error || success) && (
                        <Card.Body>
                            <Card border={borderType}>
                                <Card.Body>
                                    <Card.Title>{error ? 'Unable to Proceed' : 'Success!'}</Card.Title>
                                    <Card.Text>{error || success}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    )}
                    <Card.Header>
                        <h5>{settings.data.name || "This Automation"}</h5>
                    </Card.Header>
                    <br />
                    <Form>
                        <Row>
                            {/* Left Side */}
                            <Col md={6}>
                                {Object.entries(settings.data.parameters).map(([field, type], index) => (
                                    <Row key={index} className="pb-3">
                                        <Col>
                                            <Form.Group>
                                                <Form.Label style={{ textTransform: 'capitalize' }}>{field}</Form.Label>
                                                <Form.Control
                                                    placeholder={type === 'number' ? `Enter # of ${field}` : `Enter ${field}`}
                                                    name={field}
                                                    onChange={handleChange}
                                                    value={automationState.parameters[field] || ''}
                                                    type={type}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>

                            {/* Right Side */}
                            <Col md={6} className="border-start ps-3" style={{ alignContent: 'center' }}>
                                <Card border="secondary">
                                    <Card.Header>{jobState.name || ""} Schedule Details</Card.Header>
                                    <Card.Body>
                                        <Card.Text>Start Date: {jobState.start_date}</Card.Text>
                                        <Card.Text>End Date: {jobState.end_date}</Card.Text>
                                        <Card.Text>
                                            Run "{settings.data.name || 'This Automation'}"{' '}
                                            every {jobState.interval || 'N/A'} {jobState.time_unit || 'N/A'}{' '}
                                            at {jobState.specific_time || 'N/A'}{' '}
                                            until {jobState.continuous ? 'the criteria is met' : 'the end date is reached'}.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <div className="d-grid gap-2 pt-3">
                                    <Button onClick={handleSubmit} disabled={loading || success.length > 0} variant="primary" size="lg">
                                        Create Automation Schedule
                                    </Button>
                                    <p style={{ textAlign: 'right' }}>
                                        <LinkContainer to="/setup/schedule">
                                            <Nav.Link >
                                                <span style={{ display: 'inline', textDecoration: 'underline', padding: 0, marginLeft: '5px' }}>Return to Build Scheduler</span>
                                            </Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/manage">
                                            <Nav.Link >
                                                <span style={{ display: 'inline', textDecoration: 'underline', padding: 0, marginLeft: '5px' }}>Manage Automation Schedules</span>
                                            </Nav.Link>
                                        </LinkContainer>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};
