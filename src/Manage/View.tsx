import React from 'react';

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
    automation: { name: string, parameters: string };
};

export const View: React.FC<{ job: Job }> = ({ job }) => {
    return (
        <>
            <Card.Text>
                <strong>Automation:</strong> {job.automation.name} | <strong>From:</strong> {job.start_date} |{' '}
                <strong>To:</strong> {job.end_date} | <strong>Interval:</strong> {job.interval} |{' '}
                <strong>Time Unit:</strong> {job.time_unit} | <strong>Specific Time:</strong>{' '}
                {job.specific_time} | <strong>Continuous:</strong>{' '}
                {job.isContinuous ? 'true' : 'false'}
            </Card.Text>
            <Card.Text>
                <strong>Arguments:</strong>{' '}
                {Object.entries(JSON.parse(job.arguments)).map(([key, value], i) => (
                    <React.Fragment key={i}>
                        {key}: {String(value)}
                        {i < Object.entries(JSON.parse(job.arguments)).length - 1 ? ', ' : ''}
                    </React.Fragment>
                ))}
            </Card.Text>
        </>
    );
}