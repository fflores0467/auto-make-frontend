import { Header } from "./Header";
import { Footer } from './Footer';

import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { clearJob } from '../features/setup/jobSlice';
import { clearAutomation } from '../features/setup/automationSlice';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export const Confirmation = () => {
    const dispatch = useDispatch<AppDispatch>();

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
                <Card.Footer className="mb-4"> {/* Added mb-4 for extra space below the footer */}
                    <Footer />
                </Card.Footer>
            </Card>
        </Container>
    );
};
