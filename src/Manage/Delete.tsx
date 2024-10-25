import React, { useState, Dispatch, SetStateAction } from 'react';

import axios from 'axios';

import Button from 'react-bootstrap/Button';
import { Trash, XCircle } from 'react-bootstrap-icons';

export const DeleteButton: React.FC<{ useEditState: [boolean, Dispatch<SetStateAction<boolean>>], job_name: string, setStates: Dispatch<SetStateAction<string>>[] }> = (props) => {
    const { useEditState, job_name, setStates } = props;
    
    const [edit, setEdit] = useEditState; // Destructure edit and setEdit from useEditState
    const [setSuccess, setError] = setStates;
    const [loading, setLoading] = useState(false);

    const handleDelete = async() => {
        try {
            setLoading(true)
            await axios.delete(`http://localhost:8080/delete-job`, {
                params: { name: encodeURIComponent(job_name)},
            });
            setSuccess(`The Automation Schedule "${job_name}" was Deleted.\n
                Feel Free to Set Up a New Automation Schedule!`);
            setError('')
        } catch (err) {
            console.error('Error deleting job:', err);
            setError("Failed to Delete Automation Schedule.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {edit ? (
                <Button onClick={() => setEdit(false)} disabled={loading} variant="secondary" size="sm">
                    <XCircle /> Cancel
                </Button>
            ) : (
                <Button onClick={handleDelete} disabled={loading || edit} variant="danger" size="sm">
                    <Trash /> {loading ? "Deleting..." : "Delete"}
                </Button>
            )}
        </>
    );
};
