import { useFetchAutomations, useFetchJobs } from "../hooks/apiHooks";
import { Loading } from '../components/Loading'
import { Header } from '../components/BasicHeader'

import { View } from './View';
import { Edit } from './Edit';
import { SaveButton } from './SaveButton';
import { EditButton } from './EditButton';
import { CancelButton } from './CancelButton';
import { DeleteButton } from './DeleteButton';


import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const Manage = () => {
    const { data: jobs, loading: jobsLoading, error: jobsError } = useFetchJobs();
    const { data: automations, loading: automationsLoading, error: automationsError } = useFetchAutomations();

    const [jobEdit, setJobEdit] = useState<number>(-1);
    const [loading, setLoading] = useState(false);

    // Helper to get automation name from automation ID
    const getAutomationNameById = (automation_id: number): string => {
        const automation = automations?.find((a) => a.id === automation_id);
        return automation ? automation.name : 'Unknown Automation';
    };

    if (jobsLoading || automationsLoading) {
        return <Loading Header={<Header title={"Manage Automation Schedules"} />} />;
    }

    return (
        <Container fluid className="pt-3">
            <Card border={'dark'}>
                <Card.Header>
                    <Header title={"Manage Automation Schedules"} />
                </Card.Header>
                <Card.Body>
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <React.Fragment key={job.id}>
                                <Card border="secondary">
                                    <Card.Header as="h5">{job.name}</Card.Header>
                                    <Card.Body>
                                        <Row>
                                            {/* Edit or View Component */}
                                            <Col md={10}>
                                                {jobEdit === job.id ? (
                                                    <Edit
                                                        job={job}
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
                                                    {jobEdit === job.id ? (
                                                        <>
                                                            <SaveButton job={job} onClick={setJobEdit} />
                                                            <CancelButton onClick={setJobEdit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditButton job={job} onClick={setJobEdit} />
                                                            <DeleteButton job={job} />
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
                        <Card.Body>
                            <Card.Text>No Automation Schedules are Available!</Card.Text>
                        </Card.Body>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

