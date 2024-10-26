import React, { useState, Dispatch, SetStateAction } from 'react';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Job = {
    name: string;
    start_date: string;
    end_date: string;
    interval: number;
    time_unit: string;
    specific_time: string;
    automation_id: number;
    isContinuous: number;
    arguments: string;
    automation: { name: string; parameters: string };
};

type JobDetails = {
    name: string;
    start_date: string;
    end_date: string;
    interval: number;
    time_unit: string;
    specific_time: string;
    isContinuous: number;
};

type ArgumentsType = Record<string, string>;

export const Edit: React.FC<{ edit: boolean; job: Job; setStates: Dispatch<SetStateAction<string>>[] }> = ({
    edit,
    job,
    setStates,
}) => {

    const [setSuccess, setError] = setStates;
    const [loading, setLoading] = useState(false);

    const parameters = JSON.parse(job.automation.parameters);
    const parsedArguments = JSON.parse(job.arguments as string);

    const [jobDetails, setJobDetails] = useState<JobDetails>({
        name: job.name,
        start_date: job.start_date,
        end_date: job.end_date,
        interval: job.interval,
        time_unit: job.time_unit,
        specific_time: job.specific_time,
        isContinuous: job.isContinuous,
    });

    const [editedArguments, setEditedArguments] = useState<ArgumentsType>(parsedArguments);

    const handleDetailsChange = (key: keyof JobDetails, value: string | number) => {
        setJobDetails((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleArgumentChange = (key: string, value: string) => {
        setEditedArguments((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    if (edit) {
        return (
            <>
                <Card.Text as="div">
                    <Form>
                        <Row>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label><strong>Automation:</strong></Form.Label>
                                    <Form.Control 
                                        placeholder='Enter Schedule Name'
                                        name='automation_id'
                                        value={job.automation.name}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label><strong>From:</strong></Form.Label>
                                    <Form.Control 
                                        type='date'
                                        name='start_date'
                                        value={job.start_date}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label><strong>To:</strong></Form.Label>
                                    <Form.Control 
                                        type='date'
                                        name='end_date'
                                        value={job.end_date}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group>
                                    <Form.Label><strong>Interval:</strong></Form.Label>
                                    <Form.Control 
                                        type='number'
                                        name='interval'
                                        value={job.interval}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label><strong>Time Unit:</strong></Form.Label>
                                    <Form.Control 
                                        placeholder='Enter Time Unit'
                                        name='time_unit'
                                        value={job.time_unit}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label><strong>Specific Time:</strong></Form.Label>
                                    <Form.Control 
                                        placeholder='Enter Specific Time'
                                        name='specific_time'
                                        value={job.specific_time}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group>
                                    <Form.Label><strong>Continuous:</strong></Form.Label>
                                    <Form.Check 
                                        type="switch"
                                        name="isContinuous"
                                        checked={Boolean(job.isContinuous)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                    </Form>
                </Card.Text>
                <br/>
                <Card.Text as="div">
                    <Form>
                        <strong>Arguments:</strong>
                        <Row>
                            {Object.entries(parameters).map(([key, type], i) => (
                                <Col key={i} md={2}>
                                    <Form.Group>
                                        <Form.Label><strong>{key}:</strong></Form.Label>
                                        <Form.Control
                                            type={type as string}
                                            value={editedArguments[key] || ''}
                                        />  
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                    </Form>
                </Card.Text>
                
            </>
        );
    }

    return (
        <>
            <Card.Text>
                <strong>Automation:</strong> {job.automation.name} | <strong>From:</strong> {jobDetails.start_date} |{' '}
                <strong>To:</strong> {jobDetails.end_date} | <strong>Interval:</strong> {jobDetails.interval} |{' '}
                <strong>Time Unit:</strong> {jobDetails.time_unit} | <strong>Specific Time:</strong>{' '}
                {jobDetails.specific_time} | <strong>Continuous:</strong>{' '}
                {jobDetails.isContinuous ? 'true' : 'false'}
            </Card.Text>

            <Card.Text>
                <strong>Arguments:</strong>
                {Object.entries(parsedArguments).map(([key, value], i) => (
                    <React.Fragment key={i}>
                        {key}: {String(value)}
                        {i < Object.entries(parsedArguments).length - 1 ? ', ' : ''}
                    </React.Fragment>
                ))}
            </Card.Text>
        </>
    );
};
