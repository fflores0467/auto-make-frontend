import React, { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import { useJobSubmission } from "../hooks/apiHooks";
import { Job } from "../constants/types";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

type SummaryProps = {
    show: boolean;
    setModalShow: (show: boolean) => void;
    job?: Job; // Parent-provided job data for Save
    automation_name?: string
    mode: 'create' | 'edit'; // Mode for Review (create) or Save (edit)
    onSuccess?: Dispatch<SetStateAction<number>>;
};

export const Summary: React.FC<SummaryProps> = ({
    show,
    setModalShow,
    job: parentJob,
    automation_name,
    mode,
    onSuccess,
}) => {
    const navigate = useNavigate();
    const { submitJob, loading, error } = useJobSubmission();
    const user = useSelector((state: RootState) => state.user);
    const reduxJob = useSelector((state: RootState) => state.job);
    const automation = useSelector((state: RootState) => state.automation);

    // Use parent-provided job or fallback to Redux job for Review
    const job = parentJob || reduxJob;

    // Handle form submission with dynamic API call based on mode
    const handleSubmit = async () => {
        const isSubmitted = await submitJob(mode, job, user.id, mode === "edit" ? (id) => {
            onSuccess?.(id);
            setModalShow(false);
        } : undefined);

        if (mode === "create" && isSubmitted) {
            navigate('/setup/confirmation');
            setModalShow(false)
        }
    };

    return (
        <Modal
            show={show}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={loading ? 'static' : true}
            keyboard={!loading}
        >
            {/* Modal Header */}
            <Modal.Header closeButton={!loading}>
                <Modal.Title>
                    {mode === 'create' ? 'Confirm Your Action' : 'Confirm Your Edits'}
                </Modal.Title>
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
                        <strong>Automation to Run:</strong> {automation.name || automation_name}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Execution:</strong>{' '}
                        {job.continuous ? 'Until criteria are met' : 'Until the end date'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Arguments:</strong>{' '}
                        {job.arguments && Object.keys(job.arguments).length > 0
                            ? JSON.stringify(job.arguments, null, 2)
                            : 'No arguments provided'}
                    </ListGroup.Item>
                    <ListGroup.Item />
                </ListGroup>
            </Modal.Body>

            {/* Modal Footer */}
            <Modal.Footer className="flex-column ">
                <p className="text-center">
                    Are you sure you want to{' '}
                    {mode === 'create' ? 'create this automation schedule' : 'save these edits'}?
                </p>
                <p className="text-center text-muted">
                    {mode === 'create'
                        ? 'Schedule will be active upon creation!'
                        : 'Your changes will take effect immediately.'}
                </p>
                <Row className="w-100">
                    <Col className="text-center">
                        <Button onClick={handleSubmit} disabled={loading} variant="primary">
                            {mode === 'create' ? 'Confirm & Create' : 'Confirm & Save'}
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
};
