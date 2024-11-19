import { findMissingFields } from '../constants/utils'; // Import the utility function
import { Header } from './Header';
import { Footer } from './Footer';
import { Automation } from '../constants/types';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { setJob, clearJobAutomation } from '../features/setup/jobSlice'
import { clearAutomation, setAutomation } from '../features/setup/automationSlice'

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const Job = () => {
    const dispatch = useDispatch<AppDispatch>();
    const job = useSelector((state: RootState) => state.job);

    const [automations, setAutomations] = useState<Automation[]>([]); // For the dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all automations when component mounts
    useEffect(() => {
        const fetchAutomations = async () => {
            try {
                const response = await axios.get(`${baseUrl}/read-automation`);
                setAutomations(response.data.data);
                setError('');
            } catch (err) {
                console.error('Error fetching automations:', err);
                setError('Failed to load automations.');
            } finally {
                setLoading(false);
            }
        };
        fetchAutomations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    type TimeUnit = {
        unit: string,
        time_str: string
    }
    const time_units: TimeUnit[] = [{ unit: "minutes", time_str: ":SS" }, { unit: "hours", time_str: "MM:SS || :MM" }, { unit: "days", time_str: "HH:MM:SS || HH:MM" }];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        if (name === 'automation_id') {
            dispatch(clearAutomation()); // Clear any existing automation data
            dispatch(clearJobAutomation()); // Clear existing job arguments

            // Find the automation with the matching ID from the automations list
            const automation = automations.find(
                automation => automation.id === parseInt(value, 10)
            );

            if (automation) {
                dispatch(setAutomation(automation)); // Set the newly found automation in the store

                // Initialize automation parameters with empty strings into job.arguments
                const automationParameters = JSON.parse(automation.parameters);
                // If job.arguments is empty, initialize it with default values from automation.parameters
                if (Object.keys(job.arguments).length === 0) {
                    // Use automation.parameters to generate initialArguments with default empty strings
                    const initialArguments = Object.keys(automationParameters).reduce((acc, key) => {
                        acc[key] = ""; // Initialize each parameter with an empty string
                        return acc;
                    }, {} as Record<string, string>);

                    dispatch(setJob({ arguments: initialArguments })); // Set the initial arguments in the job store
                }
            }
            else {
                // If no matching automation is found, reset automation and arguments to default
                dispatch(clearAutomation());
                dispatch(clearJobAutomation());
            }
        }

        // Handle numeric inputs (convert string to number)
        if (name === 'interval' || name === 'automation_id' || name === 'continuous') {
            dispatch(setJob({ [name]: parseInt(value, 10) }));
        }
        // Handle string inputs
        else {
            dispatch(setJob({ [name]: value }));
        }
    };

    // State to track missing fields
    const [missingFields, setMissingFields] = useState<string[]>([]);

    // Prevent continue if any fields are missing
    const handleContinue = (preventContinue: React.Dispatch<React.SetStateAction<boolean>>) => {
        const missingFields = findMissingFields(job)

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
                    <Header></Header>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row className="pb-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Schedule Name</Form.Label>
                                    <Form.Control
                                        placeholder='Enter Schedule Name'
                                        onChange={handleChange}
                                        name='name'
                                        isInvalid={missingFields.includes('name')}
                                        value={job.name}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="pb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={handleChange}
                                        name='start_date'
                                        isInvalid={missingFields.includes('start_date')}
                                        value={job.start_date}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={handleChange}
                                        name='end_date'
                                        isInvalid={missingFields.includes('end_date')}
                                        value={job.end_date}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Label>Run Schedule</Form.Label>
                        <Row className="pb-3">
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Every:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        onChange={handleChange}
                                        name='interval'
                                        isInvalid={missingFields.includes('interval')}
                                        value={job.interval || ''}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Time Unit:</Form.Label>
                                    <Form.Select
                                        style={{ textTransform: 'capitalize' }}
                                        aria-label="Default select example"
                                        name='time_unit'
                                        isInvalid={missingFields.includes('time_unit')}
                                        value={job.time_unit}
                                        onChange={handleChange}
                                    >
                                        {time_units.map((x) => (
                                            <option key={x.unit} value={x.unit}>{x.unit}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>At:</Form.Label>
                                    <Form.Control
                                        placeholder={job.specific_time}
                                        onChange={handleChange}
                                        name='specific_time'
                                        isInvalid={missingFields.includes('specific_time')}
                                        value={job.specific_time}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Do:</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        onChange={handleChange}
                                        name='automation_id'
                                        isInvalid={missingFields.includes('automation_id')}
                                        value={job.automation_id}
                                        disabled={loading || automations.length === 0} // Disable until automations load
                                    >
                                        <option value={-1}>{loading ? 'Loading Automations...' : 'Select Automation...'}</option>
                                        {automations.map((automation) => (
                                            <option key={automation.id} value={automation.id}>
                                                {automation.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {error && <p className="text-danger">{error}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Until:</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        onChange={handleChange}
                                        name='continuous'
                                        isInvalid={missingFields.includes('continuous')}
                                        value={job.continuous}
                                    >
                                        <option value={0}>Criteria Met</option>
                                        <option value={1}>End Date Reached</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Footer validate={handleContinue} />
                </Card.Footer>
            </Card>
        </Container>
    )
}