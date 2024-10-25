import React, { Dispatch, SetStateAction } from 'react';
import Button from 'react-bootstrap/Button';
import { PencilSquare, Save } from 'react-bootstrap-icons';

export const SaveButton: React.FC<{ job_name: string, editRow: string | null, setEditRow: Dispatch<SetStateAction<string | null>> }> = ({ job_name, editRow, setEditRow }) => {
    const isEditing = editRow === job_name;

    return (
        <>
            {isEditing ? (
                <Button onClick={() => setEditRow(null)} variant="success mb-1" size="sm">
                    <Save /> Save
                </Button>
            ) : (
                <Button onClick={() => setEditRow(job_name)} variant="warning mb-1" size="sm">
                    <PencilSquare /> Edit
                </Button>
            )}
        </>
    );
};
