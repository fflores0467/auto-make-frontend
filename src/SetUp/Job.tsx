import { findErrorFields, getLocalTodayDate, parseAutomationParameters } from '../constants/utils'; // Import the utility function
import { useFetchAutomations } from "../hooks/apiHooks"

import { Header } from './Header';
import { Footer } from './Footer';

import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { setJob, clearJobAutomation } from '../features/setup/jobSlice'
import { clearAutomation, setAutomation } from '../features/setup/automationSlice'

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

type TimeUnit = {
    unit: string,
    time_str: string
}

// Time unit options
const time_units: TimeUnit[] = [
    { unit: "minutes", time_str: ":SS" },
    { unit: "hours", time_str: "MM:SS || :MM" },
    { unit: "days", time_str: "HH:MM:SS || HH:MM" }
];

export const Job = () => {
    const dispatch = useDispatch<AppDispatch>();
    const job = useSelector((state: RootState) => state.job);
    const { data: automations, loading, error } = useFetchAutomations();

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
                const automationParameters = parseAutomationParameters(automation.parameters);
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

    // State to track error fields
    const [errorFields, setErrorFields] = useState<Record<string, string>>({});

    // Prevent continue if any fields are missing
    const handleContinue = (preventContinue: React.Dispatch<React.SetStateAction<boolean>>) => {
        const errors = findErrorFields(job);

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
                                        isInvalid={!!errorFields.name}
                                        value={job.name}
                                    />
                                    {errorFields.name && (
                                        <Form.Text className="text-danger">{errorFields.name}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="pb-3 gy-3">
                            <Col sm={12} md={6}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={handleChange}
                                        name="start_date"
                                        isInvalid={!!errorFields.start_date}
                                        value={job.start_date}
                                        min={getLocalTodayDate()}
                                        onKeyDown={(e) => e.preventDefault()} // Prevent typing in the date input
                                    />
                                    {errorFields.start_date && (
                                        <Form.Text className="text-danger">{errorFields.start_date}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={handleChange}
                                        name='end_date'
                                        isInvalid={!!errorFields.end_date}
                                        value={job.end_date}
                                        min={getLocalTodayDate()}
                                        onKeyDown={(e) => e.preventDefault()} // Prevent typing in the date input
                                    />
                                    {errorFields.end_date && (
                                        <Form.Text className="text-danger">{errorFields.end_date}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Label>Run Schedule</Form.Label>
                        <Row className="pb-3 gy-3">
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Every:</Form.Label>
                                    <Form.Control
                                        type="number"
                                        onChange={handleChange}
                                        name='interval'
                                        isInvalid={!!errorFields.interval}
                                        value={job.interval || ''}
                                        min={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '.' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    {errorFields.interval && (
                                        <Form.Text className="text-danger">{errorFields.interval}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Time Unit:</Form.Label>
                                    <Form.Select
                                        style={{ textTransform: 'capitalize' }}
                                        aria-label="Default select example"
                                        name='time_unit'
                                        isInvalid={!!errorFields.time_unit}
                                        value={job.time_unit}
                                        onChange={handleChange}
                                    >
                                        {time_units.map((x) => (
                                            <option key={x.unit} value={x.unit}>{x.unit}</option>
                                        ))}
                                    </Form.Select>
                                    {errorFields.time_unit && (
                                        <Form.Text className="text-danger">{errorFields.time_unit}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>At:</Form.Label>
                                    <Form.Control
                                        placeholder={
                                            time_units.find((time) => time.unit === job.time_unit)?.time_str || 'Enter time'
                                        }
                                        onChange={handleChange}
                                        name='specific_time'
                                        isInvalid={!!errorFields.specific_time}
                                        value={job.specific_time}
                                    />
                                    {errorFields.specific_time && (
                                        <Form.Text className="text-danger">{errorFields.specific_time}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Do:</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        onChange={handleChange}
                                        name='automation_id'
                                        isInvalid={!!errorFields.automation_id}
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
                                    {errorFields.automation_id && (
                                        <Form.Text className="text-danger">{errorFields.automation_id}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Until:</Form.Label>
                                    <Form.Select
                                        aria-label="Default select example"
                                        onChange={handleChange}
                                        name='continuous'
                                        isInvalid={!!errorFields.continuous}
                                        value={job.continuous}
                                    >
                                        <option value={0}>Criteria Met</option>
                                        <option value={1}>End Date Reached</option>
                                    </Form.Select>
                                    {errorFields.continuous && (
                                        <Form.Text className="text-danger">{errorFields.continuous}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
                <Card.Footer className="mb-4"> {/* Added mb-4 for extra space below the footer */}
                    <Footer validate={handleContinue} />
                </Card.Footer>
            </Card>
        </Container>
    )
}