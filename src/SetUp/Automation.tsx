import { Loading } from '../components/Loading'
import { Header } from "./Header";
import { Footer } from './Footer';

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

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const Automation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const jobState = useSelector((state: RootState) => state.job);
    const automationState = useSelector((state: RootState) => state.automation);
    const automation_id = jobState.automation_id;

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');


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

    useEffect(() => {
        const fetchAutomationParameters = async () => {
            if (automation_id && automation_id > 0) {
                setError("");
                setLoading(true);
                try {
                    const response = await axios.get(`${baseUrl}/read-automation`, {
                        params: { id: encodeURIComponent(automation_id) },
                        timeout: 5000,
                    });

                    const json = response.data;
                    const parsedParameters = JSON.parse(json.data.parameters);
                    const parsedCriteria = JSON.parse(json.data.criteria);

                    setSettings({
                        ...json,
                        data: {
                            ...json.data,
                            parameters: parsedParameters,
                            criteria: parsedCriteria
                        }
                    });
                } catch (error) {
                    setError("An error occurred while fetching automation parameters.");
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setError('Please select an automation from the "Build Schedule" Page.');
                setLoading(false);
            }
        };

        fetchAutomationParameters();
    }, [automation_id]);

    // Dispatch automation state in redux to keep data globally
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        dispatch(setAutomationState({ field: name, value })); // Update automation parameters in Redux
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

                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Footer />
                </Card.Footer>
            </Card>


        </Container >
    );
};
