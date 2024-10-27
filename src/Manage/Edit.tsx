import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
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
    automation: { name: string, parameters: string };
};

export const Edit: React.FC<{
    job: Job;
    handleJobUpdate: (jobName: string, updatedFields: Partial<Job>) => void;
}> = ({ job, handleJobUpdate }) => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [automations, setAutomations] = useState<{ automation_id: number; name: string; parameters: string }[]>([]);
  
    // Fetch all automations (field name/field type) once when component mounts
    useEffect(() => {
        const fetchAutomations = async () => {
            try {
                const response = await axios.get('http://localhost:8080/read-automation');
                setAutomations(response.data.data);
                setError('');
            } catch (err) {
                console.error('Error fetching automations:', err);
                setError('Failed to load automations.');
            } finally {
                setLoading(false)
            }
        };
        fetchAutomations();
    }, []);

    // Function to handle job field updates, including automation_id
    const handleFieldChange = async (name: keyof Job, value: string | number) => {
        if (name === 'automation_id') {
            const selectedAutomation = automations.find((automation) => automation.automation_id === value);

            if (selectedAutomation) {
                const parsedArguments = JSON.stringify(
                    Object.entries(JSON.parse(selectedAutomation.parameters)).reduce((acc, [key]) => {
                        acc[key] = ""; // Set each parameter value to an empty string
                        return acc;
                    }, {} as Record<string, string>)
                )
                handleJobUpdate(job.name, {
                    [name]: typeof value === 'string' ? parseInt(value, 10) : value,
                    arguments: parsedArguments,
                    automation: { name: selectedAutomation.name, parameters: selectedAutomation.parameters },
                });
            }
        } else {
            handleJobUpdate(job.name, { [name]: value });
        }
    };

    const handleArgumentChange = (key: string, value: string) => {
        const updatedArguments = { ...JSON.parse(job.arguments), [key]: value };
        handleJobUpdate(job.name, { arguments: JSON.stringify(updatedArguments) });
    };

    type TimeUnit = {
        unit: string,
        time_str: string
    }
    const time_units: TimeUnit[] = [{unit: "minutes", time_str: ":SS"}, {unit: "hours", time_str: "MM:SS || :MM"}, {unit: "days", time_str: "HH:MM:SS || HH:MM"}];

    return (
        <Card.Text as="div">
            <Form>
                <Row>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label><strong>Automation:</strong></Form.Label>
                            <Form.Select
                                name="automation_id"
                                value={job.automation_id}
                                onChange={(e) => handleFieldChange("automation_id", parseInt(e.target.value))}
                            >
                                {automations.map((automation) => (
                                    <option key={automation.automation_id} value={automation.automation_id}>
                                        {loading ? 'Loading...' : automation.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {error && <p className="text-danger">{error}</p>}

                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label><strong>From:</strong></Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={job.start_date}
                                onChange={(e) => handleFieldChange("start_date", e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label><strong>To:</strong></Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={job.end_date}
                                onChange={(e) => handleFieldChange("end_date", e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Form.Group>
                            <Form.Label><strong>Interval:</strong></Form.Label>
                            <Form.Control
                                type="number"
                                name="interval"
                                value={job.interval}
                                onChange={(e) => handleFieldChange("interval", parseInt(e.target.value))}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label><strong>Time Unit:</strong></Form.Label>
                            <Form.Select
                                style={{textTransform: 'capitalize'}} 
                                aria-label="Default select example" 
                                name='time_unit'
                                value={job.time_unit}
                                onChange={(e) => handleFieldChange("time_unit", e.target.value)}
                                >
                                {time_units.map((x) => (
                                    <option key={x.unit} value={x.unit}>{x.unit}</option> 
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label><strong>Specific Time:</strong></Form.Label>
                            <Form.Control
                                name="specific_time"
                                value={job.specific_time}
                                onChange={(e) => handleFieldChange("specific_time", e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Form.Group>
                            <Form.Label><strong>Continuous:</strong></Form.Label>
                            <Form.Check
                                type="switch"
                                name="isContinuous"
                                checked={!!job.isContinuous}
                                onChange={(e) => handleFieldChange("isContinuous", e.target.checked ? 1 : 0)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    {Object.entries(JSON.parse(job.automation.parameters)).map(([field, type], index) => (
                        <Col key={index} md={2}>
                            <Form.Group>
                                <Form.Label><strong>{field}:</strong></Form.Label>
                                <Form.Control
                                    type={type as string}
                                    placeholder={type === 'number' ? `Enter # of ${field}` : `Enter ${field}`}
                                    value={JSON.parse(job.arguments)[field] || ''}
                                    onChange={(e) => handleArgumentChange(field, e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    ))}
                </Row>
            </Form>
        </Card.Text>
    );
};
