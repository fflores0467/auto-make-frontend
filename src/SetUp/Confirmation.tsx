import { findMissingFields } from '../constants/utils'; // Import the utility function
import { Header } from "./Header";
import { Footer } from './Footer';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { clearJob } from '../features/setup/jobSlice';
import { clearAutomation } from '../features/setup/automationSlice';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export const Confirmation = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const job = useSelector((state: RootState) => state.job);

    useEffect(() => {
        const missingScheduleFields = findMissingFields(job);
        const missingArgumentsFields = findMissingFields(job.arguments);
        if (missingScheduleFields.length > 0 || missingArgumentsFields.length > 0) {
            navigate('/setup/automation'); // Redirect to the schedule page if arguments are empty
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]); // Do not re-render if job changes, as job will be deleted upon arrival in next useEffect

    useEffect(() => {
        dispatch(clearJob());
        dispatch(clearAutomation());
    }, [dispatch]);

    return (
        <Container fluid className='pt-3'>
            <Card border='dark'>
                <Card.Header>
                    <Header />
                </Card.Header>
                <Card.Body className="text-center mb-4">
                    <h4>Your Automation Schedule Has Been Submitted!</h4>
                    <p className="mt-3">What would you like to do next?</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/setup/schedule" aria-label="Go Back to Start">
                            <Button variant="secondary">Go Back to Start</Button>
                        </Link>
                        <Link to="/manage" aria-label="Go to Manage Page">
                            <Button variant="primary">Go to Manage Page</Button>
                        </Link>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Footer />
                </Card.Footer>
            </Card>
        </Container>
    );
};
