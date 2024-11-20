import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const Summary = ({ show, setModalShow }: { show: boolean; setModalShow: (show: boolean) => void }) => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const user = useSelector((state: RootState) => state.user);
    const job = useSelector((state: RootState) => state.job);
    const automation = useSelector((state: RootState) => state.automation);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setError('')
        setLoading(false)
        setModalShow(false);
    };

    // Handle form submission with validation
    const handleSubmit = async () => {
        setError("");
        setLoading(true)
        try {
            if (user.id < 0) {
                setError('Please Sign In.');
                return;
            }
            const body = {
                name: job.name,
                start_date: job.start_date,
                end_date: job.end_date,
                active: true,
                continuous: job.continuous,
                interval: job.interval,
                time_unit: job.time_unit,
                specific_time: job.specific_time,
                automation_id: job.automation_id,
                user_id: user.id,
                parameters: job.arguments
            }
            await axios.post(`${baseUrl}/create-job`, body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            handleClose()
            navigate('/setup/confirmation'); // Redirect to the schedule page if arguments are empty

            return;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'An axios error occurred. Please try again.';
                console.error('Error response:', errorMessage);
                setError(errorMessage.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed") ? `"${job.name}" is Already in Use` : `${errorMessage}`)
                return;
            }
            console.error('An unknown error occurred:', (error as Error).message || error);
            setError('An unknown error occurred. Please try again later.');
            return
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose} // Only allow closing when not loading
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={loading ? "static" : true}
            keyboard={!loading}
        >
            {/* Modal Header */}
            <Modal.Header closeButton={!loading}>
                <Modal.Title>Confirm Your Action</Modal.Title>
            </Modal.Header>

            {/* Modal Body */}
            <Modal.Body>
                <h5>Automation Schedule Details</h5>
                <ListGroup variant="flush">
                    <ListGroup.Item />
                    <ListGroup.Item>
                        <strong>Start Date:</strong> {job.start_date}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>End Date:</strong> {job.end_date}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Interval:</strong> {job.interval} {job.time_unit}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Specific Time:</strong> {job.specific_time}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Automation to Run:</strong> {automation.name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Execution:</strong>{" "}
                        {job.continuous ? "Until criteria are met" : "Until the end date"}
                    </ListGroup.Item>
                    <ListGroup.Item />
                </ListGroup>
            </Modal.Body>

            {/* Modal Footer */}
            <Modal.Footer className="flex-column ">
                <p className="text-center">Are you sure you want to create this automation schedule?</p>
                <p className="text-center text-muted">Schedule will be active upon creation!</p>
                <Row className="w-100">
                    <Col className="text-center">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            variant="primary"
                        >
                            Confirm & Create
                        </Button>
                    </Col>
                </Row>
                {error && (
                    <Row className="w-100">
                        <Col className="text-danger text-center">{error}</Col>
                    </Row>
                )}
            </Modal.Footer>
        </Modal>
    );
}