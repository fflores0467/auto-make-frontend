import React, { useMemo } from 'react';
import { Job } from "../constants/types";
import { parseJobArguments } from '../constants/utils'; // Import utility functions

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const View: React.FC<{ job: Job; automation_name: string }> = ({ job, automation_name }) => {
    const job_arguments = useMemo(() => parseJobArguments(job.arguments), [job.arguments]);

    return (
        <>
            {/* Full Details (Visible on Medium and Larger Screens) */}
            <Row className="mb-3 d-none d-md-flex">
                <Col md="auto" className="border-end pe-3">
                    <strong>Automation:</strong> {automation_name}
                </Col>
                <Col md="auto" className="border-end pe-3">
                    <strong>From:</strong> {job.start_date}
                </Col>
                <Col md="auto" className="border-end pe-3">
                    <strong>To:</strong> {job.end_date}
                </Col>
                <Col md="auto" className="border-end pe-3">
                    <strong>Interval:</strong> {job.interval}
                </Col>
                <Col md="auto" className="border-end pe-3">
                    <strong>Time Unit:</strong> {job.time_unit}
                </Col>
                <Col md="auto" className="border-end pe-3">
                    <strong>Specific Time:</strong> {job.specific_time}
                </Col>
                <Col md="auto" className="border-end pe-3">
                    <strong>Continuous:</strong> {job.continuous ? 'true' : 'false'}
                </Col>
                <Col md="auto">
                    <strong>Active:</strong> {job.active ? 'true' : 'false'}
                </Col>
            </Row>

            {/* Automation Arguments (Full Details on Medium and Larger Screens) */}
            <Row className="d-none d-md-flex">
                {Object.entries(job_arguments).length > 0 && (
                    Object.entries(job_arguments).map(([key, value], i) => (
                        <Col key={i} md="auto" className={i < Object.entries(job_arguments).length - 1 ? 'border-end pe-3' : ''}>
                            <strong>{key}:</strong> {String(value)}
                        </Col>
                    ))
                )}
            </Row>

            {/* Minimal Details (Visible on Small Screens) */}
            <Row className="d-flex d-md-none">
                <Col xs={12} className="border-bottom pb-2">
                    <strong>Automation:</strong> {automation_name}
                </Col>
                <Col xs={12} className="border-bottom pb-2">
                    <strong>From:</strong> {job.start_date}
                </Col>
                <Col xs={12} className="border-bottom pb-2">
                    <strong>To:</strong> {job.end_date}
                </Col>
                <Col xs={12} className="border-bottom pb-2">
                    <strong>Active:</strong> {job.active ? 'true' : 'false'}
                </Col>
            </Row>

            {/* Minimal Arguments (Visible on Small Screens) */}
            <Row className="border-bottom d-flex d-md-none pb-3">
                {Object.entries(job_arguments).length > 0 && (
                    <>
                        {Object.entries(job_arguments).map(([key, value], i) => (
                            <Col key={key} xs={12} className="border-bottom  pb-2">
                                <strong>{key}:</strong> {String(value)}
                            </Col>
                        ))}
                    </>
                )}
            </Row>

        </>
    );
};
