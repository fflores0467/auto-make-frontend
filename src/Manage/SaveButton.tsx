import React, { Dispatch, SetStateAction } from 'react';
import { Job } from "../constants/types";

import Button from 'react-bootstrap/Button';
import { Save } from 'react-bootstrap-icons';

export const SaveButton: React.FC<{ job: Job; onClick: Dispatch<SetStateAction<number>> }> = ({ job, onClick }) => {
    const handleSave = () => {
        onClick(-1);
    };

    return (
        <>
            <Button
                variant="success mb-1"
                size="sm"
                onClick={handleSave}
            >
                <Save /> Save
            </Button>
        </>
    );
};
