import React, { useState, useMemo } from 'react';
import { Job, time_units } from "../constants/types";
import { findErrorFields, getLocalTodayDate, parseJobArguments, parseAutomationParameters } from '../constants/utils'; // Import utility functions
import { useFetchAutomations } from "../hooks/apiHooks";

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Edit: React.FC<{ job: Job; }> = ({ job }) => {
    // Parse the job arguments initially to ensure they are usable in the form.
    const initialArguments = useMemo(() => parseJobArguments(job.arguments), [job.arguments]);

    // Fetch available automations data and handle loading or errors.
    const { data: automations, loading, error } = useFetchAutomations();

    // Store the editable job state, initialized with parsed arguments.
    const [editedJob, setEditedJob] = useState<Job>({
        ...job,
        arguments: initialArguments,
    });

    // Memoized selected automation based on the `automation_id` of the edited job.
    const automation = useMemo(() => {
        if (!automations || editedJob.automation_id === undefined) {
            return { parameters: '{}' }; // Fallback to an object with an empty parameters property.
        }
        return automations.find((automation) => automation.id === editedJob.automation_id) || { parameters: '{}' };
    }, [automations, editedJob.automation_id]);

    // Parse the parameters of the selected automation to dynamically display input fields.
    const automationParameters = useMemo(() => parseAutomationParameters(automation.parameters), [automation.parameters]);

    const [errorFields, setErrorFields] = useState<Record<string, string>>({});

    // Handle form changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setEditedJob((prev) => {
            // Update arguments if the field exists in parsed parameters
            if (Object.keys(automationParameters).includes(name)) {
                const updatedArguments = { ...prev.arguments, [name]: value };
                return { ...prev, arguments: updatedArguments };
            }

            // Otherwise, update other job fields
            return {
                ...prev,
                [name]: name === "interval" || name === "automation_id" || name === "continuous"
                    ? parseInt(value, 10)
                    : value,
            };
        });
    }

    return (
        <Form>
            {/* Schedule Details */}
            <Row className="gy-3 gx-3 pb-3">
                {/* Start Date */}
                <Col md="auto" xs={12}>
                    <Form.Group>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={handleChange}
                            name="start_date"
                            isInvalid={!!errorFields.start_date}
                            value={editedJob.start_date}
                            min={getLocalTodayDate()}
                            onKeyDown={(e) => e.preventDefault()} // Prevent typing in the date input
                        />
                        {errorFields.start_date && (
                            <Form.Text className="text-danger">{errorFields.start_date}</Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* End Date */}
                <Col md="auto" xs={12}>
                    <Form.Group>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={handleChange}
                            name='end_date'
                            isInvalid={!!errorFields.end_date}
                            value={editedJob.end_date}
                            min={getLocalTodayDate()}
                            onKeyDown={(e) => e.preventDefault()} // Prevent typing in the date input
                        />
                        {errorFields.end_date && (
                            <Form.Text className="text-danger">{errorFields.end_date}</Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* Interval */}
                <Col md="auto" xs={12}>
                    <Form.Group>
                        <Form.Label>Every:</Form.Label>
                        <Form.Control
                            type="number"
                            onChange={handleChange}
                            name='interval'
                            isInvalid={!!errorFields.interval}
                            value={editedJob.interval || ''}
                            min={1}
                            onKeyDown={(e) => {
                                if (e.key === 'e' || e.key === 'E' || e.key === '.' || e.key === '-') {
                                    e.preventDefault();
                                }
                            }}
                        />
                        {errorFields.interval && (
                            <Form.Text className="text-danger">{errorFields.interval}</Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* Time Unit */}
                <Col md="auto" xs={12}>
                    <Form.Group>
                        <Form.Label>Time Unit:</Form.Label>
                        <Form.Select
                            style={{ textTransform: 'capitalize' }}
                            aria-label="Default select example"
                            name='time_unit'
                            isInvalid={!!errorFields.time_unit}
                            value={editedJob.time_unit}
                            onChange={handleChange}
                        >
                            {time_units.map((x) => (
                                <option key={x.unit} value={x.unit}>{x.unit}</option>
                            ))}
                        </Form.Select>
                        {errorFields.time_unit && (
                            <Form.Text className="text-danger">{errorFields.time_unit}</Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* At (Specific Time) */}
                <Col md="auto" xs={12}>
                    <Form.Group>
                        <Form.Label>At</Form.Label>
                        <Form.Control
                            placeholder={
                                time_units.find((time) => time.unit === editedJob.time_unit)?.time_str || 'Enter time'
                            }
                            onChange={handleChange}
                            name='specific_time'
                            isInvalid={!!errorFields.specific_time}
                            value={editedJob.specific_time}
                        />
                        {errorFields.specific_time && (
                            <Form.Text className="text-danger">{errorFields.specific_time}</Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* Automation */}
                <Col md="auto" xs={12}>
                    <Form.Group>
                        <Form.Label>Do</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            onChange={handleChange}
                            name='automation_id'
                            isInvalid={!!errorFields.automation_id}
                            value={editedJob.automation_id}
                            disabled={loading || automations.length === 0} // Disable until automations load
                        >
                            <option value={-1}>{loading ? 'Loading Automations...' : 'Select Automation...'}</option>
                            {automations.map((automation) => (
                                <option key={automation.id} value={automation.id}>
                                    {automation.name}
                                </option>
                            ))}
                        </Form.Select>
                        {error && <p className="text-danger">{error}</p>}
                        {errorFields.automation_id && (
                            <Form.Text className="text-danger">{errorFields.automation_id}</Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* Continuous */}
                <Col md="auto" xs={12}>
                    <Form.Group>
                        <Form.Label>Until:</Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            onChange={handleChange}
                            name='continuous'
                            isInvalid={!!errorFields.continuous}
                            value={editedJob.continuous}
                        >
                            <option value={0}>Criteria Met</option>
                            <option value={1}>End Date Reached</option>
                        </Form.Select>
                        {errorFields.continuous && (
                            <Form.Text className="text-danger">{errorFields.continuous}</Form.Text>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            <Row className="gy-3 pb-3">
                {Object.entries(automationParameters).map(([field, type]) => (
                    <Col key={field} xs={12} md="auto">
                        <Form.Group>
                            <Form.Label style={{ textTransform: 'capitalize' }}>{field}</Form.Label>
                            <Form.Control
                                placeholder={type === 'number' ? `Enter # of ${field}` : `Enter ${field}`}
                                name={field}
                                isInvalid={!!errorFields[field]} // Corrected validation check
                                onChange={handleChange}
                                type={type as "text" | "number" | "date"}
                                value={editedJob.arguments[field] || ''}
                                // Apply min={0} for 'number' and min={today's date} for 'date' in the correct format
                                {...(type === 'number' ? { min: 0 } : {})}
                                {...(type === 'date' ? { min: getLocalTodayDate(), onKeyDown: (e) => e.preventDefault() } : {})}
                                onKeyDown={(e) => {
                                    // Prevent invalid characters only for 'number' type
                                    if (
                                        type === 'number' &&
                                        (e.key === 'e' || e.key === 'E' || e.key === '.' || e.key === '-')
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            {errorFields[field] && (
                                <Form.Text className="text-danger">{errorFields[field]}</Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                ))}
            </Row>

        </Form>
    );
};
