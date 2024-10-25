import Button from 'react-bootstrap/Button';
import { PencilSquare } from 'react-bootstrap-icons'; // Import edit and delete icons
import React from 'react';

export const Edit: React.FC<{job_name: string}> = (props) => {
    const { job_name } = props;
    return (
        <Button variant="warning mb-1" size="sm">
            <PencilSquare /> Edit
        </Button>
    )
}