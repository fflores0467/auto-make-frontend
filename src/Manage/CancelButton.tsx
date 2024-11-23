import React, { Dispatch, SetStateAction } from 'react';
import Button from 'react-bootstrap/Button';
import { XCircle } from 'react-bootstrap-icons';

export const CancelButton: React.FC<{ onClick: Dispatch<SetStateAction<number>> }> = ({ onClick }) => {
    const handleCancel = () => {
        onClick(-1);
    };

    return (
        <Button
            variant="secondary mb-1"
            size="sm"
            onClick={handleCancel}
        >
            <XCircle /> Cancel
        </Button>
    );
};
