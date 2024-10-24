import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { setAutomationState } from '../features/setup/automationSlice'

import type { RootState, AppDispatch } from '../store'

import { Header } from "./Header"
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

export const Automation = () => {
    const dispatch = useDispatch<AppDispatch>(); 
    const scheduleState = useSelector((state: RootState) => state.schedule);
    const automation = useSelector((state: RootState) => state.automation); 
    const automation_id = scheduleState.automation_id;
    
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState({
        message: "", 
        data: {
            automation_id: 0, 
            name: '', 
            parameters: {} as Record<string, string> 
        }
    })

    useEffect(() => {
        if (automation_id && automation_id !== 0) {
            setIsLoading(true)
            fetch(`http://localhost:8080/read-automation?id=${automation_id}`)
                .then((res) => res.json())
                .then((json) => {
                    try {
                        // Parse the parameters JSON string and store it as an object
                        const parsedParameters = JSON.parse(json.data.parameters);
                        setSettings({
                            ...json, // Spread the rest of the settings
                            data: {
                                ...json.data,
                                parameters: parsedParameters // Replace parameters string with the parsed object
                            }
                        });
                    } catch (error) {
                        console.error('Failed to parse parameters:', error);
                    } finally {
                        setIsLoading(false)
                    }
                })
                .catch((err) => {
                    console.error('Failed to fetch automation settings:', err);
                    setIsLoading(false)
                });
        }
    }, [automation_id]); // Dependency array ensures this runs when `automation_id` changes

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        dispatch(setAutomationState({ field: name, value })); // Dispatch the field name and value to Redux
    };    

    if (!automation_id || settings.data.automation_id === 0) {
        return (
            <Container fluid>
                <Card>
                    <Card.Header>
                        <Header></Header>
                    </Card.Header>
                    <Card.Body> 
                        <Card border="warning" >
                            <Card.Body>
                                <Card.Title>Unable to Proceed</Card.Title>
                                <Card.Text>
                                    Please Return to the "Build Schedule" Page and Select An Automation to Run.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Card.Body>
                </Card>
            </Container>
        )     
    }

    if (isLoading) {
        return (
            <Container fluid>
                <Card>
                    <Card.Header>
                        <Header></Header>
                    </Card.Header>
                    <Card.Body> 
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Card.Body>
                </Card>
            </Container>
        )
    }

    return(
        <Container fluid>
            <Card>
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body> 
                    <Card.Header>
                        <h5>{settings.data.name}</h5>
                    </Card.Header>
                    <br/>
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
                                                    value={automation.parameter[field] || ''} // Read the value from Redux, fallback to empty string
                                                    type={type}
                                                    />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                ))}
                            </Col>

                            {/* Right Side */}
                            <Col md={6} className="border-start ps-3">
                                    <Card border="primary" >
                                        <Card.Header>{scheduleState.name || "Unnamed"} Schedule Details</Card.Header>
                                        <Card.Body>
                                            <Card.Text>Start Date: {scheduleState.start_date}</Card.Text>
                                            <Card.Text>End Date: {scheduleState.end_date}</Card.Text>
                                            <Card.Text>
                                                Run "{settings.data.name || 'this automation'}"{' '}
                                                every {scheduleState.interval || 'N/A'} {scheduleState.time_unit || 'N/A'}{' '}
                                                at {scheduleState.specific_time || 'N/A'}{' '}
                                                until {scheduleState.isContinuous ? 'the criteria is met' : 'the end date is reached'}.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                <div className="d-grid gap-2" style={{paddingTop: "1%"}}>
                                    <Button variant="primary" size="lg">
                                        Proceed to Checkout
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}