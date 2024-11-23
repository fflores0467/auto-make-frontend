import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with customParseFormat for parsing specific date formats
dayjs.extend(customParseFormat);

// Helper function to get today's date in YYYY-MM-DD format
export const getLocalTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
};

// Function to check if a string is a valid date in one of the specified formats
function isDate(input: string): boolean {
    // List of date formats to check against
    const formats = [
        'YYYY-MM-DD',
        'DD/MM/YYYY',
        'MM/DD/YYYY',
        'MMMM D, YYYY',
        // Add more formats as needed
    ];

    // Check if the input matches any of the formats
    return formats.some(format => dayjs(input, format, true).isValid());
}

// Function to find error fields in an object
export const findErrorFields = (obj: Record<string, any>) => {
    const timeUnits = [
        { unit: "minutes", regex: /^:\d{2}$/ },
        { unit: "hours", regex: /^(?:\d{2}:\d{2}:\d{2}|:\d{2})$/ },
        { unit: "days", regex: /^(?:\d{2}:\d{2}:\d{2}|\d{2}:\d{2})$/ }
    ];

    const errors: { key: string; errorMessage: string }[] = [];

    Object.entries(obj).forEach(([key, value]) => {
        // Validate specific_time format based on the time unit
        if (key === "specific_time") {
            const timeUnit = timeUnits.find(time => time.unit === obj.time_unit);
            if (timeUnit && !timeUnit.regex.test(value)) {
                errors.push({ key, errorMessage: `Invalid format for ${obj.time_unit}.` });
            }
            return; // Skip further checks for specific_time
        }

        // Validate dropdown values (must be non-negative)
        if (key === 'time_unit' || key === 'automation_id' || key === 'continuous') {
            if (value < 0) {
                errors.push({ key, errorMessage: "A value must be selected" });
            }
            return;
        }

        // Check for null, undefined, empty string, or NaN
        if (value === null || value === undefined || value === "" || Number.isNaN(value)) {
            errors.push({ key, errorMessage: "This field is required and cannot be empty." });
            return;
        }

        // Check for negative numbers
        const numericValue = typeof value === "string" ? Number(value) : value;
        if (typeof numericValue === "number" && numericValue < 0) {
            errors.push({ key, errorMessage: "The value cannot be negative." });
            return;
        }

        // Validate date strings and check if the date is in the past
        if (isDate(value)) {
            const dateValue = new Date(value);
            const today = new Date(getLocalTodayDate());

            today.setHours(0, 0, 0, 0); // Set time to the start of the day

            if (dateValue < today) {
                errors.push({ key, errorMessage: "The date cannot be in the past." });
            }
        }
    });

    // Check that end_date is not before start_date (outside the loop)
    if (isDate(obj.start_date) && isDate(obj.end_date)) {
        const startDate = new Date(obj.start_date);
        const endDate = new Date(obj.end_date);

        if (endDate < startDate) {
            errors.push({ key: 'end_date', errorMessage: "The end date cannot be before the start date." });
        }
    }

    return errors;
};

// Parse job argument as Job type expects Record<string, string>, but the actual type from the api is a string
export const parseJobArguments = (argumentsData: string | Record<string, any>): Record<string, any> => {
    let parsedArguments: Record<string, any> = {};

    try {
        parsedArguments = typeof argumentsData === 'string' ? JSON.parse(argumentsData) : argumentsData;
        if (typeof parsedArguments !== 'object' || parsedArguments === null) {
            parsedArguments = {}; // Ensure it's an object
        }
    } catch (error) {
        console.error('Failed to parse job arguments:', error);
        parsedArguments = {}; // Fallback to an empty object
    }

    return parsedArguments;
};

export const parseAutomationParameters = (parameters: string | undefined): Record<string, any> => {
    if (!parameters) {
        return {}; // Return empty object if parameters are undefined or null.
    }

    try {
        return JSON.parse(parameters); // Safely parse JSON parameters.
    } catch (err) {
        console.error("Failed to parse automation parameters:", err);
        return {}; // Return empty object on error.
    }
}
