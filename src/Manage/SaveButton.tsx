import React, { Dispatch, SetStateAction, useState } from 'react';
import { Summary } from '../components/Summary';
import { Job } from "../constants/types";
import { findErrorFields } from '../constants/utils'; // Import the utility function

import Button from 'react-bootstrap/Button';
import { Save } from 'react-bootstrap-icons';

export const SaveButton: React.FC<{
    job: Job | undefined;
    automation_name: string;
    onSave: Dispatch<SetStateAction<number>>;
    setErrorFields: Dispatch<SetStateAction<Record<string, string>>>
}> = ({ job, automation_name, onSave, setErrorFields }) => {
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!job) {
            console.error("Unable to proceed: Automation Schedule does not exist.");
            return;
        }

        // Find missing fields (returns an array of objects: { key, errorMessage })
        const missingScheduleFields = findErrorFields(job);
        const missingArgumentsFields = findErrorFields(job.arguments || {});

        // Consolidate missing fields into a single error object
        const allMissingFields: Record<string, string> = {
            ...missingScheduleFields.reduce((acc, field) => {
                acc[field.key] = field.errorMessage; // Use the key property as the index
                return acc;
            }, {} as Record<string, string>),
            ...missingArgumentsFields.reduce((acc, field) => {
                acc[field.key] = field.errorMessage; // Use the key property as the index
                return acc;
            }, {} as Record<string, string>),
        };

        // Prevent continuation if there are errors
        if (Object.keys(allMissingFields).length > 0) {
            setError("Please fill in all the required fields.");
            setErrorFields(allMissingFields);
            return;
        }

        // Clear errors and proceed
        setError("");
        setErrorFields({});
        setModalShow(true);
    };

    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <Button
                variant="success mb-1"
                size="sm"
                onClick={handleSave}
            >
                <Save /> Save

            </Button>
            {error && (
                <p className="text-danger mt-1 small">
                    Failed to save the job: {error}
                </p>
            )}
            <Summary show={modalShow} setModalShow={setModalShow} job={job} automation_name={automation_name} mode='edit' onSuccess={onSave} />
        </>
    );
};
