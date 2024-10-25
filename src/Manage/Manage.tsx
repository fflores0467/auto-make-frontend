import { Header } from './Header';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

import { PencilSquare, Trash } from 'react-bootstrap-icons'; // Import edit and delete icons

export const Manage = () => {

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
        automation_name: string; // Added automation_name to the Job type
    }

    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobsAndAutomations = async () => {
            try {
                // Fetch jobs
                const jobsResponse = await axios.get('http://localhost:8080/read-job');
                const jobsData = jobsResponse.data.data;
    
                // Map over jobs and fetch the corresponding automation for each job
                const jobs = await Promise.all(
                    jobsData.map(async (job: Job) => {
                        const automationsResponse = await axios.get(`http://localhost:8080/read-automation`, {
                            params: { id: job.automation_id },
                        });
                        const automation = automationsResponse.data;
    
                        // Return the job with the added automation name
                        return {
                            ...job,
                            automation_name: automation.data.name, // Adding automation name to job object
                        };
                    })
                );
    
                // Set the jobs state with jobs containing automation names
                setJobs(jobs);
            } catch (err) {
                console.error('Error fetching jobs or automations:', err);
                setError('Failed to load jobs and automations.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchJobsAndAutomations();
    }, []);
    

    if (isLoading) {
        return (
            <Container fluid>
                <Card border='light'>
                    <Card.Header>
                        <Header />
                    </Card.Header>
                    <Card.Body> 
                        <Row className="justify-content-md-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    const borderType = error ? 'danger' : 'primary';
    return (
        <Container fluid>
            <Card border={borderType}>
                <Card.Header>
                    <Header />
                </Card.Header>
                <Card.Body>
                {error && (
                    <Card.Body> 
                        <Card border='secondary'>
                            <Card.Body>
                                <Card.Title>Unable to Proceed</Card.Title>
                                <Card.Text>{error}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Card.Body>
                )}

                {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <React.Fragment key={index}>
                            <Card border='secondary'>
                                <Card.Header>{job.name}</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={10}>
                                            <Card.Text>
                                                {job.automation_name}{' '}
                                                | From: {job.start_date} To: {job.end_date}{' '}
                                                | Interval: {job.interval}{' '}
                                                | Time Unit: {job.time_unit}{' '}
                                                | Specific Time: {job.specific_time}{' '}
                                                | Continuous : {job.isContinuous ? 'true' : 'false'}{' '}
                                            </Card.Text>
                                            <Card.Text>
                                                Arguments: {Object.entries(JSON.parse(job.arguments as string)).map(([key, value], i) => (
                                                <React.Fragment key={i}>
                                                    {key}: {String(value)}{i < Object.entries(JSON.parse(job.arguments)).length - 1 ? ', ' : ''}
                                                </React.Fragment>
                                                ))}
                                            </Card.Text>
                                        </Col>
                                        <Col md={2} className="border-start ps-3">
                                            <Row>
                                                <Button variant="warning mb-1" size="sm">
                                                    <PencilSquare /> Edit
                                                </Button>
                                
                                                <Button variant="danger" size="sm">  
                                                    <Trash /> Delete
                                                </Button>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <br />
                        </React.Fragment>
                    ))
                ) : (
                    <p>No jobs available.</p>
                )}
                </Card.Body>
            </Card>
        </Container>
    )
}
