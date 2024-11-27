import React from 'react';
import { Job } from "../constants/types";
import { useDeleteJob } from "../hooks/apiHooks";
import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';

type DeleteButtonProps = {
    job: Job;
    onDelete: React.Dispatch<React.SetStateAction<number>>;
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({ job, onDelete }) => {
    const { deleteJob, loading, error } = useDeleteJob();

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the job: ${job.name}?`)) {
            await deleteJob(job.id, () => {
                onDelete(job.id); // Update the parent state on success
            });
        }
    };


    return (
        <>
            <Button
                variant="danger mb-1"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
            >
                <Trash /> {loading ? "Deleting..." : "Delete"}
            </Button>
            {error && (
                <p className="text-danger mt-1 small">
                    Failed to delete the job: {error}
                </p>
            )}
        </>
    );
};
