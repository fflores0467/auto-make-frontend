import { findMissingFields } from '../constants/utils'; // Import the utility function
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
        const missingFields = findMissingFields(job)
        if (missingFields.length > 0) {
            console.error("Unable to proceed: Missing the following fields from the build scheduler page", missingFields)
            navigate('/setup/schedule'); // Redirect to the schedule page if arguments are empty
        }
    }, [job, navigate]);

    const automationParameters = useMemo(() => {
        if (automation.parameters) {
            return JSON.parse(automation.parameters);
        } else {
            return {};
        }
    }, [automation.parameters]);

    type Criteria = {
        field: {
            name: string;
            type: string;
            options: string[];
        };
    };

    // settings schema from the database, stored in state for user input boxes
    const [settings, setSettings] = useState({
        message: "",
        data: {
            automation_id: 0,
            name: '',
            parameters: {} as Record<string, string>,
            criteria: {} as Criteria
        }
    });

    // Dispatch automation state in redux to keep data globally
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        dispatch(setJob({ arguments: { ...job.arguments, [name]: value } }));
    };

    // State to track missing fields
    const [missingFields, setMissingFields] = useState<string[]>([]);

    // Prevent continue if any fields are missing
    const handleContinue = (preventContinue: React.Dispatch<React.SetStateAction<boolean>>) => {
        const missingFields = findMissingFields(job.arguments)

        if (missingFields.length > 0) {
            preventContinue(true);
            setMissingFields(missingFields); // Update missing fields state
            return;
        }

        preventContinue(false);
        setMissingFields([]); // Clear missing fields state when there are no missed fields
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
                                                    isInvalid={missingFields.includes(field)}
                                                    onChange={handleChange}
                                                    type={type as "text" | "number" | "date"}
                                                    value={job.arguments[field] || ''}
                                                />
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
                <Card.Footer>
                    <Footer validate={handleContinue} />
                </Card.Footer>
            </Card>
        </Container >
    );
};
