import { Header } from './Header';
import { Edit } from './Edit';
import { DeleteButton } from './Delete';
import { SaveButton } from './Save';


import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

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
        automation: {name: string, parameters: string}; // Added automation_details to the Job type
    }

    const [jobs, setJobs] = useState<Job[]>([]);
    const [success, setSuccess] = useState('');
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobsAndAutomations = async () => {
            try {
                // Fetch all jobs
                const jobsResponse = await axios.get('http://localhost:8080/read-job');
                const jobsData = jobsResponse.data.data;
    
                // Map over jobs and fetch the corresponding automation for each job
                const jobs = await Promise.all(
                    jobsData.map(async (job: Job) => {
                        const automationsResponse = await axios.get(`http://localhost:8080/read-automation`, {
                            params: { id: encodeURIComponent(job.automation_id) },
                        });
                        const automation = automationsResponse.data;
    
                        // Return the job with the added automation name
                        return {
                            ...job,
                            automation: {name: automation.data.name, parameters: automation.data.parameters}, // Adding automation name to job object
                        };
                    })
                );
    
                // Set the jobs state with jobs containing automation names
                setJobs(jobs);
            } catch (err) {
                console.error('Error fetching jobs or automations:', err);
                setError('Failed to load automation schedules.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchJobsAndAutomations();
    }, [success]);

    if (loading) {
        return (
            <Container fluid>
                <Card border='warning'>
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

    const borderType = error ? 'danger' : success ? 'success' : 'secondary';
    return (
        <Container fluid>
            <Card border={'light'}>
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
                {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                        <React.Fragment key={index}>
                            <Card border='secondary'>
                                <Card.Header as="h5">{job.name}</Card.Header>
                                <Card.Body>
                                    <Row>
                                        {/* Left Side */}
                                        <Col md={10}>
                                            <Edit edit={edit} job={job} setStates={[setSuccess, setError]}></Edit>
                                        </Col>
                                        {/* Right Side */}
                                        <Col md={2} className="border-start ps-3">
                                            <Row>
                                                <SaveButton useEditState={[edit, setEdit]}></SaveButton>
                                                <DeleteButton useEditState={[edit, setEdit]} job_name={job.name} setStates={[setSuccess, setError]}></DeleteButton>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <br />
                        </React.Fragment>
                    ))
                ) : (
                    <Card.Body>
                        <Card.Text>No Automation Schedules are Available!</Card.Text>
                    </Card.Body>
                )}
                </Card.Body>
            </Card>
        </Container>
    )
}