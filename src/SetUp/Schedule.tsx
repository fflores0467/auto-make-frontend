import { Header } from './Header';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { setScheduleState } from '../features/setup/scheduleSlice'
import { clearAutomationState } from '../features/setup/automationSlice'

import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export const Schedule = () => {
    const dispatch = useDispatch<AppDispatch>(); 
    const scheduleState = useSelector((state: RootState) => state.schedule); 

    const [automations, setAutomations] = useState<{ automation_id: number, name: string }[]>([]); // For the dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all automations when component mounts
    useEffect(() => {
        const fetchAutomations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/read-automation'); // Replace with your actual endpoint
                setAutomations(response.data.data); // Assuming the data is an array of automations under `data`
                setError('');
            } catch (err) {
                console.error('Error fetching automations:', err);
                setError('Failed to load automations.');
            } finally {
                setLoading(false);
            }
        };

        fetchAutomations();
    }, []);

    
    type TimeUnit = {
        unit: string,
        time_str: string
    }
    const time_units: TimeUnit[] = [{unit: "minutes", time_str: ":SS"}, {unit: "hours", time_str: "MM:SS || :MM"}, {unit: "days", time_str: "HH:MM:SS || HH:MM"}];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        if (name === 'automation_id'){
            dispatch(clearAutomationState());
        }

        // Handle numeric inputs (convert string to number)
        if (name === 'interval' || name === 'automation_id' || name === 'isContinuous') {
            dispatch(setScheduleState({ [name]: parseInt(value, 10) }));
        }
        // Handle string inputs
        else {
            dispatch(setScheduleState({ [name]: value }));
        }
    };

    return (
        <Container fluid>
            <Card border="primary">
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row style={{paddingBottom: "1%"}}>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Schedule Name</Form.Label>
                                    <Form.Control 
                                        placeholder='Enter Schedule Name'
                                        onChange={handleChange} 
                                        name='name'
                                        value={scheduleState.name}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>    

                        <Row style={{paddingBottom: "1%"}}>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        onChange={handleChange} 
                                        name='start_date'
                                        value={scheduleState.start_date}
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
                                        value={scheduleState.end_date}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>  

                        <Form.Label>Run Schedule</Form.Label>
                        <Row style={{paddingBottom: "1%"}}>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Every:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        onChange={handleChange} 
                                        name='interval'
                                        value={scheduleState.interval}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Time Unit:</Form.Label>
                                    <Form.Select
                                        style={{textTransform: 'capitalize'}} 
                                        aria-label="Default select example" 
                                        name='time_unit'
                                        value={scheduleState.time_unit}
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
                                        placeholder={scheduleState.specific_time}
                                        onChange={handleChange} 
                                        name='specific_time'
                                        value={scheduleState.specific_time}
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
                                        value={scheduleState.automation_id}
                                        disabled={loading || automations.length === 0} // Disable until automations load
                                    >
                                        <option value={0}>{loading ? 'Loading Automations...' : 'Select Automation...'}</option> 
                                        {automations.map((automation) => (
                                            <option key={automation.automation_id} value={automation.automation_id}>
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
                                        name='isContinuous' 
                                        value={scheduleState.isContinuous}
                                    >
                                        <option value={0}>End Date Reached</option>
                                        <option value={1}>Critiria Met</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>              
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}