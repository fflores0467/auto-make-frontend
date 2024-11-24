import React, { Dispatch, SetStateAction, useState } from 'react';
import { Summary } from '../components/Summary';
import { Job } from "../constants/types";

import Button from 'react-bootstrap/Button';
import { Save } from 'react-bootstrap-icons';

export const SaveButton: React.FC<{
    job: Job | undefined;
    automation_name: string;
    onSave: Dispatch<SetStateAction<number>>;
}> = ({ job, automation_name, onSave }) => {
    const handleSave = () => {
        setModalShow(true);
    };

    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <Button
                variant="success mb-1"
                size="sm"
                onClick={handleSave}
            >
                <Save /> Save

            </Button>
            <Summary show={modalShow} setModalShow={setModalShow} job={job} automation_name={automation_name} mode='edit' onSuccess={onSave} />
        </>
    );
};
