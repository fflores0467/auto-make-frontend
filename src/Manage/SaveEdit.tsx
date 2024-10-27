import React, { useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import { PencilSquare, Save } from 'react-bootstrap-icons';

type Job = {
    name: string;
    start_date: string;
    end_date: string;
    interval: number;
    time_unit: string;
    specific_time: string;
    automation_id: number;
    isContinuous: number;
    arguments: string;
    automation: { name: string, parameters: string };
};

export const SaveButton: React.FC<{ job: Job, edit: string | null, setStates: Dispatch<SetStateAction<string>>[] }> = ({ job, edit, setStates }) => {
    const job_name = job.name;

    const [setSuccess, setError, setEdit] = setStates;
    const [loading, setLoading] = useState(false);

    type updateJob = {
        name: string;
        start_date: string;
        end_date: string;
        interval: number;
        time_unit: string;
        specific_time: string;
        automation_id: number;
        isContinuous: number;
        isActive: boolean,
        parameters: Record<string, string>;    
    }

    const handleUpdate = async () => {
        try {
            setLoading(true);

            const updatePayload: updateJob = {
                name: job.name,
                start_date: job.start_date,
                end_date: job.end_date,
                interval: job.interval,
                time_unit: job.time_unit,
                specific_time: job.specific_time,
                isActive: true,
                automation_id: job.automation_id,
                isContinuous: job.isContinuous,
                parameters: JSON.parse(job.arguments) // Or job.automation.parameters if you need the structure from `parameters`
            };
            
            const findMissingFields = (obj: Record<string, any>) =>
                Object.entries(obj)
                    .filter(([key, value]) => value === null || value === undefined || value === "" || value < 0)
                    .map(([key]) => key); // Return the keys of missing fields

            const missingFields = findMissingFields(updatePayload);
            const missingParameters = findMissingFields(updatePayload.parameters);

            if (missingFields.length > 0) {
                setError(`Please fill in the following fields:\n${missingFields.join(', ')}`);
                return;
            }

            if (missingParameters.length > 0) {
                setError(`Please fill in the following arguments:\n${missingParameters.join(', ')}`);
                return;
            }

            await axios.put(`http://localhost:8080/update-job`, updatePayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { name: encodeURIComponent(job_name) } // If your backend expects this as a query parameter
            });
    
            setSuccess(`The Automation Schedule "${job_name}" was updated successfully.`);
            setError('');
            setEdit('');
        } catch (err) {
            console.error('Error updating job:', err);
            setError("Failed to save automation schedule.");
        } finally {
            setLoading(false);
        }
    };
    

    const isEditing = edit === job_name;

    return (
        <>
            {isEditing ? (
                <Button onClick={handleUpdate} variant="success mb-1" size="sm">
                    <Save /> {loading ? "Saving..." : "Save"}
                </Button>
            ) : (
                <Button onClick={() => setEdit(job_name)} variant="warning mb-1" size="sm">
                    <PencilSquare /> Edit
                </Button>
            )}
        </>
    );
};
