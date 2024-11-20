export const getLocalTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
};

export const findErrorFields = (obj: Record<string, any>) => {
    const timeUnits = [
        { unit: "minutes", regex: /^:\d{2}$/ },
        { unit: "hours", regex: /^(?:\d{2}:\d{2}:\d{2}|:\d{2})$/ },
        { unit: "days", regex: /^(?:\d{2}:\d{2}:\d{2}|\d{2}:\d{2})$/ }
    ];

    const errors: { key: string; errorMessage: string }[] = [];

    Object.entries(obj).forEach(([key, value]) => {
        if (key === "specific_time") {
            const timeUnit = timeUnits.find(time => time.unit === obj.time_unit);
            if (timeUnit && !timeUnit.regex.test(value)) {
                errors.push({ key, errorMessage: `Invalid format for ${obj.time_unit}.` });
            }
            return; // Skip further checks for specific_time
        }

        // Dropdown values
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

        // Convert value to number if it is a string representing a number
        const numericValue = typeof value === "string" ? Number(value) : value;
        if (typeof numericValue === "number" && numericValue < 0) {
            errors.push({ key, errorMessage: "The value cannot be negative." });
            return;
        }

        // Check for valid date strings only (ignore numeric strings like "0")
        if (typeof value === "string" && isNaN(Number(value)) && !isNaN(Date.parse(value))) {
            const dateValue = new Date(value);

            // Get today's date in YYYY-MM-DD format using your local date function
            const todayString = getLocalTodayDate();
            const today = new Date(todayString);

            today.setHours(0, 0, 0, 0); // Set time to the start of the day

            if (dateValue < today) {
                errors.push({ key, errorMessage: "The date cannot be in the past." });
            }
        }

    });

    return errors;
};
