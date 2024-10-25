import React, { useState, Dispatch, SetStateAction } from 'react';

import Button from 'react-bootstrap/Button';
import { PencilSquare } from 'react-bootstrap-icons'; // Import edit and delete icons

export const Edit: React.FC<{job_name: string, setStates: Dispatch<SetStateAction<string>>[]}> = (props) => {
    const {job_name, setStates} = props;
    const [setSuccess, setError] = setStates;
    const [loading, setLoading] = useState(false);

    return (
        <Button variant="warning mb-1" size="sm">
            <PencilSquare /> Edit
        </Button>
    )
}