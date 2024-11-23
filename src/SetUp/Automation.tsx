import { findErrorFields, getLocalTodayDate, parseAutomationParameters } from '../constants/utils'; // Import the utility function
import { Header } from "./Header";
import { Footer } from './Footer';

import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setJob } from '../features/setup/jobSlice'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Automation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const job = useSelector((state: RootState) => state.job);
    const automation = useSelector((state: RootState) => state.automation);

    // Check if job is empty and navigate back to /setup/schedule to set up the schedule
    useEffect(() => {
        const errorFields = findErrorFields(job)
        if (errorFields.length > 0) {
            console.error("Unable to proceed: Missing the following fields from the build scheduler page", errorFields)
            navigate('/setup/schedule'); // Redirect to the schedule page if arguments are empty
        }
    }, [job, navigate]);

    const automationParameters = useMemo(() => parseAutomationParameters(automation.parameters), [automation.parameters]);

    // Dispatch automation state in redux to keep data globally
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        dispatch(setJob({ arguments: { ...job.arguments, [name]: value } }));
    };

    // State to track error fields
    const [errorFields, setErrorFields] = useState<Record<string, string>>({});

    // Prevent continue if any fields are missing
    const handleContinue = (preventContinue: React.Dispatch<React.SetStateAction<boolean>>) => {
        const errors = findErrorFields(job.arguments);

        if (errors.length > 0) {
            preventContinue(true);
            const errorMessages = errors.reduce((acc, { key, errorMessage }) => {
                acc[key] = errorMessage;
                return acc;
            }, {} as Record<string, string>);
            setErrorFields(errorMessages); // Update state with error messages
            return;
        }

        preventContinue(false);
        setErrorFields({}); // Clear error messages when there are no issues
    };

    return (
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
                <Card.Header>
                    <Header />
                </Card.Header>
                <Card.Body>
                    <Card.Header>
                        <h5>{automation.name || "This Automation"}</h5>
                    </Card.Header>
                    <br />
                    <Form>
                        <Row>
                            {/* Left Side */}
                            <Col md={6}>
                                {Object.entries(automationParameters).map(([field, type]) => (
                                    <Row key={field} className="pb-3">
                                        <Col>
                                            <Form.Group>
                                                <Form.Label style={{ textTransform: 'capitalize' }}>{field}</Form.Label>
                                                <Form.Control
                                                    placeholder={type === 'number' ? `Enter # of ${field}` : `Enter ${field}`}
                                                    name={field}
                                                    isInvalid={!!errorFields[field]} // Corrected validation check
                                                    onChange={handleChange}
                                                    type={type as "text" | "number" | "date"}
                                                    value={job.arguments[field] || ''}
                                                    // Apply min={0} for 'number' and min={today's date} for 'date' in the correct format
                                                    {...(type === 'number' ? { min: 0 } : {})}
                                                    {...(type === 'date' ? { min: getLocalTodayDate(), onKeyDown: (e) => e.preventDefault() } : {})}
                                                    onKeyDown={(e) => {
                                                        // Prevent invalid characters only for 'number' type
                                                        if (type === 'number' && (e.key === 'e' || e.key === 'E' || e.key === '.' || e.key === '-')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                {errorFields[field] && (
                                                    <Form.Text className="text-danger">{errorFields[field]}</Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>

                            {/* Right Side */}
                            <Col md={6} className="border-start ps-3" style={{ alignContent: 'center' }}>

                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Footer className="mb-4"> {/* Added mb-4 for extra space below the footer */}
                    <Footer validate={handleContinue} />
                </Card.Footer>
            </Card>
        </Container >
    );
};
