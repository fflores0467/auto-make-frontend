import { Header } from "./Header";

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setAutomationState } from '../features/setup/automationSlice';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';

export const Automation = () => {
    const dispatch = useDispatch<AppDispatch>(); 
    const scheduleState = useSelector((state: RootState) => state.schedule);
    const automationState = useSelector((state: RootState) => state.automation); 
    const automation_id = scheduleState.automation_id;
    
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
            axios.get(`http://localhost:8080/read-automation`, {
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

    // Onload or when schedule name changes, check if the schedule already exists
    const [submitState, setSubmitState] = useState('')
    useEffect(() => {
        if (scheduleState.name) {
            setLoading(true);
            axios.get(`http://localhost:8080/read-job`, {
                params: { name: encodeURIComponent(scheduleState.name) },
                timeout: 5000,
                validateStatus: (status) => status === 200 || status === 404, // Allow 404 to pass through
            })
            .then((response) => {
                if (response.status === 404 && response.data?.message === "No jobs found") {
                    setSubmitState('Create'); // Job not found, proceed with create mode
                } else if (response.status === 200) {
                    setSubmitState('Update'); // Job exists
                } else {
                    throw new Error("Unexpected response status"); // Force catch if other issues
                }
            })
            .catch((err) => {
                console.error("Error or unexpected 404:", err); // Catch other errors or unexpected 404s
                setError("An unexpected error occurred.");
            })
            .finally(() => setLoading(false));
        }
    }, [scheduleState.name, success]);

    // Dispatch automation state in redux to keep data globally
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        dispatch(setAutomationState({ field: name, value })); // Update automation parameters in Redux
    };

    // Handle form submission with validation
    const handleSubmit = async (requestType: string) => {
        setError("");
        const findMissingFields = (obj: Record<string, any>) =>
            Object.entries(obj)
                .filter(([key, value]) => value === null || value === undefined || value === "" || value < 0)
                .map(([key]) => key); // Return the keys of missing fields
        const missingAutomationFields = findMissingFields(automationState.parameters);
        const missingScheduleFields = findMissingFields(scheduleState);
    
        if (Object.keys(settings.data.parameters).length !== Object.keys(automationState.parameters).length) {
            setError('Please fill in all fields on the "Configure Automation Settings" Page.');
            return;
        }
    
        if (missingAutomationFields.length > 0) {
            setError(`Please fill in the following fields on the "Configure Automation Settings" Page:\n${missingAutomationFields.join(', ')}`);
            return;
        }
    
        if (missingScheduleFields.length > 0) {
            setError(`Please fill in the following fields on the "Build Scheduler" Page:\n${missingScheduleFields.join(', ')}`);
            return;
        }
    
        const jobData = {
            name: scheduleState.name,
            automation_id: automation_id,
            start_date: scheduleState.start_date,
            end_date: scheduleState.end_date,
            isActive: true,
            isContinuous: scheduleState.isContinuous,
            interval: scheduleState.interval,
            time_unit: scheduleState.time_unit,
            specific_time: scheduleState.specific_time,
            parameters: automationState.parameters 
        };
    
        const url = requestType === 'create' 
        ? 'http://localhost:8080/create-job' 
        : `http://localhost:8080/update-job?name=${encodeURIComponent(scheduleState.name)}`;
        const method = requestType === 'create' ? 'post' : 'put';
    
        try {
            setLoading(true);
            await axios({ method, url, data: jobData, headers: { 'Content-Type': 'application/json' } });
            setSuccess(`The Schedule "${scheduleState.name}" was ${requestType === 'create' ? 'created' : 'updated'} successfully.`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'An error occurred';
                setError(errorMessage.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed") ? `"${scheduleState.name}" is already in use` : errorMessage);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <Container fluid>
                <Card border='warning'>
                    <Card.Header>
                        <Header />
                    </Card.Header>
                    <Card.Body> 
                        <Row className="justify-content-md-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const borderType = error ? 'danger' : success ? 'success' : 'secondary';
    return (
        <Container fluid>
            <Card border={'light'}>
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
                                    <Row key={index} style={{ paddingBottom: '1%' }}>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label style={{textTransform: 'capitalize'}}>{field}</Form.Label>
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
                            <Col md={6} className="border-start ps-3">
                                <Card border="secondary">
                                    <Card.Header>{scheduleState.name || ""} Schedule Details</Card.Header>
                                    <Card.Body>
                                        <Card.Text>Start Date: {scheduleState.start_date}</Card.Text>
                                        <Card.Text>End Date: {scheduleState.end_date}</Card.Text>
                                        <Card.Text>
                                            Run "{settings.data.name || 'This Automation'}"{' '}
                                            every {scheduleState.interval || 'N/A'} {scheduleState.time_unit || 'N/A'}{' '}
                                            at {scheduleState.specific_time || 'N/A'}{' '}
                                            until {scheduleState.isContinuous ? 'the criteria is met' : 'the end date is reached'}.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <div className="d-grid gap-2" style={{ paddingTop: "1%" }}>
                                    <Button onClick={() => handleSubmit(submitState.toLowerCase())} variant="primary" size="lg" disabled={loading}>
                                        {`${submitState} Automation Schedule`}
                                    </Button>
                                    {success && (
                                        <p style={{ textAlign: 'right' }}>
                                            *Schedule {submitState === "Create" ? "Created" : "Updated"} successfully.
                                            <LinkContainer to="/setup/schedule">
                                                <Nav.Link>
                                                    <span style={{ display: 'inline', textDecoration: 'underline', padding: 0, marginLeft: '5px' }}>Return to Build Scheduler</span>
                                                </Nav.Link>
                                            </LinkContainer>
                                        </p>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};
