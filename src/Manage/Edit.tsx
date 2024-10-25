import React, { useState, Dispatch, SetStateAction } from 'react';
import Card from 'react-bootstrap/Card';

type Job = {
    name: string;
    start_date: string;
    end_date: string;
    interval: number;
    time_unit: string;
    specific_time: string;
    automation_id: number;
    isContinuous: number;
    arguments: string;
    automation: { name: string; parameters: string };
};

type JobDetails = {
    name: string;
    start_date: string;
    end_date: string;
    interval: number;
    time_unit: string;
    specific_time: string;
    isContinuous: number;
};

type ArgumentsType = Record<string, string>;

export const Edit: React.FC<{ edit: boolean; job: Job; setStates: Dispatch<SetStateAction<string>>[] }> = ({
    edit,
    job,
    setStates,
}) => {
    const [setSuccess, setError] = setStates;
    const [loading, setLoading] = useState(false);

    const parameters = JSON.parse(job.automation.parameters);
    const parsedArguments = JSON.parse(job.arguments as string);

    const [jobDetails, setJobDetails] = useState<JobDetails>({
        name: job.name,
        start_date: job.start_date,
        end_date: job.end_date,
        interval: job.interval,
        time_unit: job.time_unit,
        specific_time: job.specific_time,
        isContinuous: job.isContinuous,
    });

    const [editedArguments, setEditedArguments] = useState<ArgumentsType>(parsedArguments);

    const handleDetailsChange = (key: keyof JobDetails, value: string | number) => {
        setJobDetails((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleArgumentChange = (key: string, value: string) => {
        setEditedArguments((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    if (edit) {
        return (
            <>
                <Card.Text as="div">
                    <strong>Automation:</strong>
                    <input value={job.automation.name} readOnly />{' '}
                    | <strong>From:</strong>
                    <input
                        type="date"
                        value={jobDetails.start_date}
                        onChange={(e) => handleDetailsChange('start_date', e.target.value)}
                    />{' '}
                    | <strong>To:</strong>
                    <input
                        type="date"
                        value={jobDetails.end_date}
                        onChange={(e) => handleDetailsChange('end_date', e.target.value)}
                    />{' '}
                    | <strong>Interval:</strong>
                    <input
                        type="number"
                        value={jobDetails.interval}
                        onChange={(e) => handleDetailsChange('interval', Number(e.target.value))}
                    />{' '}
                    | <strong>Time Unit:</strong>
                    <input
                        type="text"
                        value={jobDetails.time_unit}
                        onChange={(e) => handleDetailsChange('time_unit', e.target.value)}
                    />{' '}
                    | <strong>Specific Time:</strong>
                    <input
                        type="time"
                        value={jobDetails.specific_time}
                        onChange={(e) => handleDetailsChange('specific_time', e.target.value)}
                    />{' '}
                    | <strong>Continuous:</strong>
                    <input
                        type="checkbox"
                        checked={!!jobDetails.isContinuous}
                        onChange={(e) => handleDetailsChange('isContinuous', e.target.checked ? 1 : 0)}
                    />
                </Card.Text>

                <Card.Text as="div">
                    <strong>Arguments:</strong>
                    {Object.entries(parameters).map(([key, type], i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>
                            <label>
                                <strong>{key}</strong>:
                                <input
                                    type={type as string}
                                    value={editedArguments[key] || ''}
                                    onChange={(e) => handleArgumentChange(key, e.target.value)}
                                />
                            </label>
                        </div>
                    ))}
                </Card.Text>
            </>
        );
    }

    return (
        <>
            <Card.Text>
                <strong>Automation:</strong> {job.automation.name} | <strong>From:</strong> {jobDetails.start_date} |{' '}
                <strong>To:</strong> {jobDetails.end_date} | <strong>Interval:</strong> {jobDetails.interval} |{' '}
                <strong>Time Unit:</strong> {jobDetails.time_unit} | <strong>Specific Time:</strong>{' '}
                {jobDetails.specific_time} | <strong>Continuous:</strong>{' '}
                {jobDetails.isContinuous ? 'true' : 'false'}
            </Card.Text>

            <Card.Text>
                <strong>Arguments:</strong>
                {Object.entries(parsedArguments).map(([key, value], i) => (
                    <React.Fragment key={i}>
                        {key}: {String(value)}
                        {i < Object.entries(parsedArguments).length - 1 ? ', ' : ''}
                    </React.Fragment>
                ))}
            </Card.Text>
        </>
    );
};
