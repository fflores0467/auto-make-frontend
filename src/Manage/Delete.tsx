import React, { useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Trash, XCircle } from 'react-bootstrap-icons';

export const DeleteButton: React.FC<{ job_name: string, editRow: string | null, setEditRow: Dispatch<SetStateAction<string | null>>, setStates: Dispatch<SetStateAction<string>>[] }> = ({ job_name, editRow, setEditRow, setStates }) => {
    const [setSuccess, setError] = setStates;
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/delete-job`, {
                params: { name: encodeURIComponent(job_name) },
            });
            setSuccess(`The Automation Schedule "${job_name}" was Deleted.\nFeel Free to Set Up a New Automation Schedule!`);
            setError('');
        } catch (err) {
            console.error('Error deleting job:', err);
            setError("Failed to Delete Automation Schedule.");
        } finally {
            setLoading(false);
        }
    };

    const isEditing = editRow === job_name;

    return (
        <>
            {isEditing ? (
                <Button onClick={() => setEditRow(null)} disabled={loading} variant="secondary" size="sm">
                    <XCircle /> Cancel
                </Button>
            ) : (
                <Button onClick={handleDelete} disabled={loading || isEditing} variant="danger" size="sm">
                    <Trash /> {loading ? "Deleting..." : "Delete"}
                </Button>
            )}
        </>
    );
};
