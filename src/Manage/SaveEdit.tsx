import React, { useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import { PencilSquare, Save } from 'react-bootstrap-icons';

type Job = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    interval: number;
    time_unit: string;
    specific_time: string;
    automation_id: number;
    user_id: number;
    continuous: number;
    arguments: string;
    automation: { name: string, parameters: string };
};

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const SaveButton: React.FC<{
    job: Job;
    edit: number | undefined;
    setStates: [Dispatch<SetStateAction<string>>, Dispatch<SetStateAction<string>>, Dispatch<SetStateAction<number>>];
}> = ({ job, edit, setStates }) => {
    const job_id = job.id;
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
        user_id: number
        continuous: number;
        active: boolean,
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
                active: true,
                automation_id: job.automation_id,
                user_id: job.user_id,
                continuous: job.continuous,
                parameters: JSON.parse(job.arguments) // Or job.automation.parameters if you need the structure from `parameters`
            };

            const findMissingFields = (obj: Record<string, any>) =>
                Object.entries(obj)
                    .filter(([key, value]) => value === null || value === undefined || value === "" || value < 0)
                    .map(([key]) => key); // Return the keys of missing fields

            const missingFields = findMissingFields(updatePayload);
            const missingParameters = findMissingFields(updatePayload.parameters);

            if (job.user_id < 1) {
                setError('Your session has expired or your user ID is invalid. Please log in again.');
                return;
            }

            if (missingFields.length > 0) {
                setError(`Please fill in the following fields:\n${missingFields.join(', ')}`);
                return;
            }

            if (missingParameters.length > 0) {
                setError(`Please fill in the following arguments:\n${missingParameters.join(', ')}`);
                return;
            }

            await axios.put(`${baseUrl}/update-job`, updatePayload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { id: encodeURIComponent(job_id) } // If your backend expects this as a query parameter
            });

            setSuccess(`The Automation Schedule was updated successfully.`);
            setError('');
            setEdit(0);
        } catch (err) {
            console.error('Error updating job:', err);
            setError("Failed to save automation schedule.");
        } finally {
            setLoading(false);
        }
    };


    const isEditing = edit === job_id;

    return (
        <>
            {isEditing ? (
                <Button onClick={handleUpdate} variant="success mb-1" size="sm">
                    <Save /> {loading ? "Saving..." : "Save"}
                </Button>
            ) : (
                <Button onClick={() => setEdit(job_id)} variant="warning mb-1" size="sm">
                    <PencilSquare /> Edit
                </Button>
            )}
        </>
    );
};
