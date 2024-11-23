import React, { Dispatch, SetStateAction } from 'react';
import { Job } from "../constants/types";
import Button from 'react-bootstrap/Button';
import { PencilSquare } from 'react-bootstrap-icons';

export const EditButton: React.FC<{ job: Job; onClick: Dispatch<SetStateAction<number>> }> = ({ job, onClick }) => {
    const handleEdit = () => {
        onClick(job.id);
    };

    return (
        <Button
            variant="warning mb-1"
            size="sm"
            onClick={handleEdit}
        >
            <PencilSquare /> Edit
        </Button>
    );
};
