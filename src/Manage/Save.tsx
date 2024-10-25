import React, { Dispatch, SetStateAction } from 'react';

import Button from 'react-bootstrap/Button';
import { PencilSquare, Save } from 'react-bootstrap-icons'; // Import Save icon

export const SaveButton: React.FC<{ useEditState: [boolean, Dispatch<SetStateAction<boolean>>] }> = (props) => {
    const { useEditState } = props;
    const [edit, setEdit] = useEditState; // Destructure edit and setEdit from useEditState

    return (
        <>
            {edit ? (
                <Button onClick={() => setEdit(false)} variant="success mb-1" size="sm">
                    <Save /> Save
                </Button>
            ) : (
                <Button onClick={() => setEdit(true)} variant="warning mb-1" size="sm">
                    <PencilSquare /> Edit
                </Button>
            )}
        </>
    );
};
