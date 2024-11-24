import React from 'react';
import { Job } from "../constants/types";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';

type DeleteButtonProps = {
    job: Job;
    onDelete: React.Dispatch<React.SetStateAction<number>>;
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({ job, onDelete }) => {
    // TODO: Move Delete api call to hooks
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the job: ${job.name}?`)) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/delete-job`, {
                    params: { id: job.id }, // Pass job ID as a query parameter
                });
                onDelete(job.id); // Update the parent state on success
            } catch (error) {
                console.error("Failed to delete the job:", error);
                alert("An error occurred while deleting the job. Please try again.");
            }
        }
    };

    return (
        <Button
            variant="danger mb-1"
            size="sm"
            onClick={handleDelete}
        >
            <Trash /> Delete
        </Button>
    );
};
