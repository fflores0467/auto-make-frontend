import { Header } from './Header';
import { Edit } from './Edit';
import { View } from './View';
import { DeleteButton } from './DeleteCancel';
import { SaveButton } from './SaveEdit';

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
        automation: { name: string, parameters: string };
    };

    const [jobs, setJobs] = useState<Job[]>([]);
    const [edit, setEdit] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobsAndAutomations = async () => {
            try {
                const jobsResponse = await axios.get('http://localhost:8080/read-job');
                const jobsData = jobsResponse.data.data;

                const jobs = await Promise.all(
                    jobsData.map(async (job: Job) => {
                        const automationsResponse = await axios.get(`http://localhost:8080/read-automation`, {
                            params: { id: encodeURIComponent(job.automation_id) },
                        });
                        const automation = automationsResponse.data;

                        return {
                            ...job,
                            automation: { name: automation.data.name, parameters: automation.data.parameters },
                        };
                    })
                );
                setJobs(jobs);
            } catch (err) {
                console.error('Error fetching jobs or automations:', err);
                setError('Failed to load automation schedules.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobsAndAutomations();
    }, [edit, success]);

    // Function to handle updates to a job's details
    const handleJobUpdate = (jobName: string, updatedFields: Partial<Job>) => {
        setJobs(prevJobs =>
            prevJobs.map(job => job.name === jobName ? { ...job, ...updatedFields } : job)
        );
    };

    if (loading) {
        return (
            <Container fluid>
                <Card>
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
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
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
                        jobs.map((job) => (
                            <React.Fragment key={job.name}>
                                <Card border='secondary'>
                                    <Card.Header as="h5">{job.name}</Card.Header>
                                    <Card.Body>
                                        <Row>
                                            {/* Edit and View page on Left Side */}
                                            <Col md={10}>
                                                {edit === job.name ?
                                                    <Edit
                                                        job={job}
                                                        handleJobUpdate={handleJobUpdate} // Pass handler to Edit
                                                    />
                                                :
                                                    <View job={job} />
                                                }
                                            </Col>
                                            {/* Buttons on Right Side */}
                                            <Col style={{ alignContent: 'center' }} md={2} className="border-start ps-3">
                                                <Row>
                                                    <SaveButton job={job} edit={edit} setStates={[setSuccess, setError, setEdit]} />
                                                    <DeleteButton job_name={job.name} edit={edit} setStates={[setSuccess, setError, setEdit] } />
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
    );
};
