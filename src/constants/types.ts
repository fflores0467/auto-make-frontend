// Structure for Automation items, this is what came from the DB for displaying in the automation set up page
export type Automation = {
    id: number;
    name: string;
    parameters: string;
    criteria: string | null;
};

// Structure for Job items, this is what is going to the DB
export type Job = {
    id: number
    name: string;
    start_date: string;
    end_date: string;
    interval: number;
    time_unit: string;
    specific_time: string;
    automation_id: number;
    continuous: number;
    active: number
    arguments: Record<string, string>
}

// type Criteria = {
//     field: {
//         name: string;
//         type: string;
//         options: string[];
//     };
// };

type TimeUnit = {
    unit: string,
    time_str: string
}

// Time unit options
export const time_units: TimeUnit[] = [
    { unit: "minutes", time_str: ":SS" },
    { unit: "hours", time_str: "MM:SS || :MM" },
    { unit: "days", time_str: "HH:MM:SS || HH:MM" }
];
