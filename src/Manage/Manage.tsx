import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import { useFetchAutomations, useFetchJobs } from "../hooks/apiHooks";
import { Loading } from '../components/Loading';
import { Header } from '../components/BasicHeader';
import { Job } from "../constants/types";
import { Link } from 'react-router-dom';

import { View } from './View';
import { Edit } from './Edit';
import { SaveButton } from './SaveButton';
import { EditButton } from './EditButton';
import { CancelButton } from './CancelButton';
import { DeleteButton } from './DeleteButton';

import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'

const ManageContent: React.FC<{ userId: number }> = ({ userId }) => {
    const { data: jobs, loading: jobsLoading, error: jobsError, refetch: refetchJobs } = useFetchJobs();
    const { data: automations, loading: automationsLoading, error: automationsError, refetch: refetchAutomations } = useFetchAutomations();

    // Editing states
    const [currentlyEditingJobId, setCurrentlyEditingJobId] = useState<number>(-1); // Opens edit menu on specific row based on job id 
    const [editedJob, setEditedJob] = useState<Job | undefined>(); // Parent state which changes in Edit component, and passed to Save Component

    const [successfulJobId, setSuccessfulJobId] = useState<number>(-1); // Used to check if edit or delete on job id was sucessful

    // Refetch data after a successful operation
    useEffect(() => {
        if (successfulJobId !== -1) {
            refetchJobs(); // Refresh the job list
            refetchAutomations(); // Optionally refresh automations if needed
            setCurrentlyEditingJobId(-1); // Close edit menu

            // Clear success indication after 3 seconds
            const timer = setTimeout(() => setSuccessfulJobId(-1), 3000);

            // Clear timeout if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [successfulJobId, refetchJobs, refetchAutomations]);

    // Helper: Get automation name
    const getAutomationNameById = (automation_id: number): string => {
        const automation = automations?.find((a) => a.id === automation_id);
        return automation ? automation.name : 'Unknown Automation';
    };

    // Ensure user ID exists before proceeding
    if (!userId) {
        return (
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Card className="text-center shadow" style={{ width: '24rem' }}>
                    <Card.Body>
                        <Card.Title>Access Denied</Card.Title>
                        <Card.Text>
                            You must be logged in to access this page. Please log in to continue.
                        </Card.Text>
                        <Link to="/login" className="btn btn-primary mt-3">
                            Go to Login
                        </Link>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (jobsLoading || automationsLoading) {
        return <Loading Header={<Header title={"Manage Automation Schedules"} />} />;
    }

    if (jobsError || automationsError) {
        return (
            <Container className="pt-3">
                <Alert variant="danger" className="mt-4">
                    <Alert.Heading>Something went wrong!</Alert.Heading>
                    <p>
                        We encountered an issue while loading the data. Please check your internet connection and try refreshing the page.
                    </p>
                    <hr />
                    <p className="mb-0">
                        <strong>Error Details:</strong> {jobsError || automationsError}
                    </p>
                </Alert>
            </Container>
        );
    }

    const successfulJob = jobs.find((j) => j.id === successfulJobId);
    return (
        <Container fluid className="pt-3">
            <Card border={'dark'}>
                <Card.Header>
                    <Header title={"Manage Automation Schedules"} />
                </Card.Header>
                <Card.Body>

                    {successfulJobId !== -1 && (
                        <div className="text-success text-center mb-3">
                            {successfulJob
                                ? `Job "${successfulJob.name}" updated successfully!`
                                : `Job was deleted successfully!`}
                        </div>
                    )}
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <React.Fragment key={job.id}>
                                <Card border={successfulJobId === job.id ? "success" : "secondary"}>
                                    <Card.Header as="h5">
                                        {job.name}
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            {/* Edit or View Component */}
                                            <Col md={10}>
                                                {currentlyEditingJobId === job.id ? (
                                                    <Edit
                                                        job={job}
                                                        onEdit={setEditedJob}
                                                    />
                                                ) : (
                                                    <View
                                                        job={job}
                                                        automation_name={getAutomationNameById(job.automation_id)}
                                                    />
                                                )}
                                            </Col>
                                            {/* Buttons */}
                                            <Col style={{ alignContent: 'center' }} md={2} className="border-start ps-3">
                                                <Row>
                                                    {currentlyEditingJobId === job.id ? (
                                                        <>
                                                            {/* TODO: Validate input data by using findErrorFields util */}
                                                            <SaveButton
                                                                job={editedJob}
                                                                automation_name={getAutomationNameById(job.automation_id)}
                                                                onSave={setSuccessfulJobId}
                                                            />
                                                            <CancelButton onClick={setCurrentlyEditingJobId} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditButton
                                                                job={job}
                                                                onClick={setCurrentlyEditingJobId}
                                                            />
                                                            <DeleteButton
                                                                job={job}
                                                                onDelete={(deletedJobId) => setSuccessfulJobId(deletedJobId)}
                                                            />
                                                        </>
                                                    )}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <br />
                            </React.Fragment>
                        ))
                    ) : (
                        <Card.Body className="text-center">
                            <h5 className="text-muted">No Automation Schedules Found</h5>
                            <p className="mt-2 text-muted">
                                It seems like there are no automation schedules available on your account.
                                <br />
                                Start by creating a new schedule or refreshing the page to see if there are any updates.
                            </p>
                            <Link to="/setup/schedule" aria-label="Go to Create Schedule Page">
                                <Button variant="primary">Create New Schedule</Button>
                            </Link>
                        </Card.Body>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export const Manage = () => {
    const user = useSelector((state: RootState) => state.user);

    if (user.id < 0) {
        return (
            <Container className="d-flex justify-content-center align-items-center mt-5">
                <Card className="text-center shadow" style={{ width: '24rem' }}>
                    <Card.Body>
                        <Card.Title>Access Denied</Card.Title>
                        <Card.Text>
                            You must be logged in to access this page. Please log in to continue.
                        </Card.Text>
                        <Link to="/home" aria-label="Go to Login Page">
                            <Button variant="primary">Go to Login</Button>
                        </Link>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return <ManageContent userId={user.id} />;
};