import React, { Dispatch, SetStateAction } from 'react';
import { Job } from "../constants/types";

import Button from 'react-bootstrap/Button';
import { Trash } from 'react-bootstrap-icons';

export const DeleteButton: React.FC<{ job: Job; }> = ({ job }) => {
    const handleDelete = () => {

    };

    return (
        <>
            <Button
                variant="danger mb-1"
                size="sm"
                onClick={handleDelete}
            >
                <Trash /> Delete
            </Button>
        </>
    );
};
