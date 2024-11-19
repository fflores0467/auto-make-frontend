import { Container, ProgressBar, Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const Footer = ({ validate }: { validate?: (setError: React.Dispatch<React.SetStateAction<boolean>>) => void }) => {
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

    // Calulate the previous step to ensure smooth progess. E.g 33% -> 66% instead of 0% to 66%
    const previousProgress = ((activeStep - 2) / (totalPages - 1)) * 100;

    // Initialize progress with the previous step's progress
    const [progress, setProgress] = useState(previousProgress);

    // Smooth transition for progress bar
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(newProgress); // Update the progress smoothly
        }, 50); // Add a short delay for a smooth transition
        return () => clearTimeout(timer); // Cleanup timeout on component unmount or newProgress change
    }, [newProgress]); // Depend on newProgress to trigger the effect

    // Stop Navigation if error
    const [error, setError] = useState(false);
    const [stepToNavigate, setStepToNavigate] = useState<number | null>(null);

    // Function to handle navigation
    const handleNavigate = (step: number) => {
        if (validate) {
            // Call validate and pass setError to update the error state
            validate(setError);
        }
        setStepToNavigate(step); // Store the step to navigate to
    };

    // UseEffect to handle navigation after error state updates
    useEffect(() => {
        if (stepToNavigate !== null && !error) {
            // Only navigate if there is no error
            if (stepToNavigate === 1) navigate('/setup/schedule');
            if (stepToNavigate === 2) navigate('/setup/automation');
            if (stepToNavigate === 3) navigate('/setup/review');
            if (stepToNavigate === 4) navigate('/setup/confirmation');

            setStepToNavigate(null); // Reset stepToNavigate after navigation
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, stepToNavigate]);

    // Determine the variant for the progress bar
    const variant = progress === 100 ? 'success' : 'primary';

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
                                variant="secondary"
                                size="lg"
                                className="rounded-start"
                            >
                                Go Back
                            </Button>
                        )}
                        {activeStep < totalPages && (
                            <Button
                                onClick={() => handleNavigate(activeStep + 1)}
                                variant="primary"
                                size="lg"
                                className={activeStep < totalPages - 1 ? "rounded-end" : "rounded"}
                            >
                                {activeStep < totalPages - 1 ? "Continue" : "Submit"}
                            </Button>
                        )}
                        {activeStep === totalPages && (
                            <Button
                                onClick={() => handleNavigate(1)}
                                variant="primary"
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
