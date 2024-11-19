import { Container, ProgressBar, Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Footer = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
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

    // Function to handle navigation
    const handleNavigate = (step: number) => {
        if (step === 1) navigate('/setup/schedule');
        if (step === 2) navigate('/setup/automation');
        if (step === 3) navigate('/setup/review');
        if (step === 4) navigate('/setup/confirmation');
    };

    return (
        <Container fluid>
            {/* Row for Labels */}
            <Row className="text-center mb-2">
                <Col xs={4}>Build Scheduler</Col>
                <Col xs={4}>Configure Automation Settings</Col>
                <Col xs={4}>Review Automation Schedule</Col>
            </Row>

            {/* Single Progress Bar with Built-in Animation */}
            <ProgressBar now={progress} variant={variant} animated />

            <Row className="justify-content-center mt-3 mb-2">
                <Col xs="auto">
                    <ButtonGroup className="d-flex">
                        {activeStep > 1 && activeStep < totalPages && (
                            <Button
                                onClick={() => handleNavigate(activeStep - 1)}
                                variant="secondary" // Style for the "Go Back" button
                                size="lg"
                                className="rounded-start"
                            >
                                Go Back
                            </Button>
                        )}
                        {activeStep < totalPages - 1 && (
                            <Button
                                onClick={() => handleNavigate(activeStep + 1)}
                                variant="primary" // Style for the "Continue" button
                                size="lg"
                                className="rounded-end"
                            >
                                Continue
                            </Button>
                        )}
                        {activeStep === totalPages - 1 && (
                            <Button
                                onClick={() => handleNavigate(activeStep + 1)}
                                variant="primary" // Style for the "Submit" button
                                size="lg"
                                className="rounded-end"
                            >
                                Submit
                            </Button>
                        )}
                        {activeStep === totalPages && (
                            <Button
                                onClick={() => handleNavigate(1)}
                                variant="primary" // Style for the "Go Back to Start" button
                                size="lg"
                                className="rounded"
                            >
                                Go Back to Start
                            </Button>
                        )}
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    );
};
