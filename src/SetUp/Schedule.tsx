import { Header } from './Header';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { setScheduleInputState } from '../features/schedule/scheduleSlice'
import type { RootState, AppDispatch } from '../store'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export const Schedule = () => {
    const dispatch = useDispatch<AppDispatch>(); 
    const schedule = useSelector((state: RootState) => state.schedule); 

    type Schema = {
        name: string;
        start_date: Date;
        end_date: Date;
        interval: number;
        time_unit: string;
        specific_time: string;
        automation_id: number;
        isContinuous: number;
    }

    type TimeUnit = {
        unit: string,
        time_str: string
    }
    const time_units: TimeUnit[] = [{unit: "minutes", time_str: ":SS"}, {unit: "hours", time_str: "MM:SS || :MM"}, {unit: "days", time_str: "HH:MM:SS || HH:MM"}];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        let data: Schema;
         
        dispatch(setScheduleInputState({ name, value }));
      };
    
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
                                    <Form.Control 
                                        placeholder='Enter Schedule Name'
                                        onChange={handleInputChange} 
                                        name='name'
                                        value={schedule.name}
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
                                        name='start_date'
                                        value={schedule.start_date.toISOString().split('T')[0]}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        name='end_date'
                                        value={schedule.end_date.toISOString().split('T')[0]}
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
                                        name='interval'
                                        value={schedule.interval}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Time Unit:</Form.Label>
                                    <Form.Select style={{textTransform: 'capitalize'}} aria-label="Default select example" name='time_unit' value={schedule.time_unit}>
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
                                        placeholder={schedule.specific_time}
                                        name='specific_time'
                                        value={schedule.specific_time}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Do:</Form.Label>
                                    <Form.Select aria-label="Default select example" name='automation_id' value={schedule.automation_id}>
                                        <option value={0}>Select Automation...</option> 
                                        <option value={1}>Universal Hotel Finder</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Until:</Form.Label>
                                    <Form.Select aria-label="Default select example" name='isContinuous' value={schedule.isContinuous}>
                                        <option value={0}>End Date Reached</option>
                                        <option value={1}>Critiria Met</option>
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