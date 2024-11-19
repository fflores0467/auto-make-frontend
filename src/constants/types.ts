export type Automation = {
    id: number;
    name: string;
    parameters: string;
    criteria: string | null;
};

// Structure for Job items
export type Job = {
    name: string;
    start_date: string;
    end_date: string;
    interval: number | string;
    time_unit: string;
    specific_time: string;
    automation_id: number;
    user_id: number;
    continuous: number;
    active: number
    arguments: Record<string, string>
}