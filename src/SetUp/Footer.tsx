import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Footer = () => {
    const totalPages = 4;
    const currentPage = useLocation().pathname;

    // Function to determine the active step based on the current route
    const getActiveStep = () => {
        if (currentPage === '/setup/schedule') return 1;
        if (currentPage === '/setup/automation') return 2;
        if (currentPage === '/setup/review') return 3;
        if (currentPage === '/setup/confirmation') return 4;
        return 0; // Default or no active step
    };

    const activeStep = getActiveStep();

    // Calculate the new progress based on the active step
    let newProgress = ((activeStep - 1) / (totalPages - 1)) * 100;
    if (newProgress < 1 && activeStep > 0) newProgress = 1; // Ensure at least 1% progress

    const previousProgress = ((activeStep - 2) / (totalPages - 1)) * 100;

    // Initialize progress with the previous step's progress
    const [progress, setProgress] = useState(previousProgress);

    // Update progress with a smooth transition when activeStep changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(newProgress); // Update the progress smoothly
        }, 50); // Add a short delay for a smooth transition
        return () => clearTimeout(timer); // Cleanup timeout on component unmount or activeStep change
    }, [newProgress]); // Depend on newProgress to trigger the effect

    // Determine the variant for the progress bar
    const variant = progress === 100 ? 'success' : 'primary';

    return (
        <Container fluid>
            {/* Row for Labels */}
            <Row className="text-center mb-2">
                <Col xs={4}>Build Scheduler</Col>
                <Col xs={4}>Configure Automation Settings</Col>
                <Col xs={4}>Review Automation Schedule</Col>
                {/* <Col xs={3}>Confirmation</Col> */}
            </Row>

            {/* Single Progress Bar with Built-in Animation */}
            <ProgressBar now={progress} variant={variant} animated />
        </Container>
    );
};
