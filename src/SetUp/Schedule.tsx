import { Header } from './Header';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export const Schedule = () => {
    type TimeUnit = {
        unit: String,
        time_str: String
    }

    const time_units: TimeUnit[] = [{unit: "minutes", time_str: ":SS"}, {unit: "hours", time_str: "MM:SS || :MM"}, {unit: "days", time_str: "HH:MM:SS || HH:MM"}];
    const [automation, setAutomation] = useState("")

    const handleAutomationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAutomation(event.target.value);
    }

    return (
        <Container fluid>
            <Card>
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row style={{paddingBottom: "1%"}}>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Schedule Name</Form.Label>
                                    <Form.Control placeholder='Enter Schedule Name'></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>    

                        <Row style={{paddingBottom: "1%"}}>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date"></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date"></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>  

                        <Form.Label>Run Schedule</Form.Label>
                        <Row style={{paddingBottom: "1%"}}>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Every:</Form.Label>
                                    <Form.Control type="number" value={5}></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Time Unit:</Form.Label>
                                    <Form.Select style={{textTransform: 'capitalize'}} aria-label="Default select example">
                                        {time_units.map(x => 
                                            <option>{x.unit}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>At:</Form.Label>
                                    <Form.Control placeholder=':SS'></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Do:</Form.Label>
                                    <Form.Select onChange={handleAutomationChange} aria-label="Default select example">
                                        <option>Select Automation...</option> 
                                        <option>Universal Hotel Finder</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Until:</Form.Label>
                                    <Form.Select aria-label="Default select example">
                                        <option>End Date Reached</option>
                                        <option>Critiria Met</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>              
                        <Row><Col><Button type="submit">Submit</Button></Col></Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}