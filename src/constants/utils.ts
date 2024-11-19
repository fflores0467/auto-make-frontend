export const findMissingFields = (obj: Record<string, any>) =>
    Object.entries(obj)
        .filter(([_, value]) =>
            value === null || value === undefined || value === "" || (typeof value === "number" && value < 0)
        )
        .map(([key]) => key);