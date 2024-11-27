import { useState, useEffect, useCallback } from "react";
import { Job, Automation } from "../constants/types";
import axios from "axios";
const baseUrl = process.env.REACT_APP_API_BASE_URL;

// Generic data fetching hook
export const useFetchData = <T,>(url: string) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true); //TODO: Incorporate loading when deleting a job
    const [error, setError] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setData(response.data.data);
            setError("");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    "A server error occurred. Please try again later."
                );
            } else {
                setError("An unknown error occurred.");
            }
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

// Hook to delete a job
export const useDeleteJob = () => {
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    const deleteJob = async (jobId: number, onSuccess?: () => void): Promise<boolean> => {
        setLoading(true);
        setError(null); // Reset error state
        try {
            await axios.delete(`${baseUrl}/delete-job`, {
                params: { id: jobId },
            });
            if (onSuccess) {
                onSuccess(); // Execute the success callback
            }
            return true; // Indicate success
        } catch (err) {
            console.error("Failed to delete the job:", err);
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message || "An error occurred while deleting the job."
                );
            } else {
                setError("An unknown error occurred while deleting the job.");
            }
            return false; // Indicate failure
        } finally {
            setLoading(false);
        }
    };

    return { deleteJob, loading, error };
};

// Hook to create or update a job
export const useJobSubmission = () => {
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    const submitJob = async (
        mode: "create" | "edit",
        job: Job,
        userId: number,
        onSuccess?: (id: number) => void
    ) => {
        setLoading(true);
        setError(null); // Reset error state
        try {
            if (userId < 0) {
                setError("Please Sign In.");
                return false; // Indicate failure
            }

            const body = {
                name: job.name,
                start_date: job.start_date,
                end_date: job.end_date,
                active: true,
                continuous: job.continuous,
                interval: job.interval,
                time_unit: job.time_unit,
                specific_time: job.specific_time,
                automation_id: job.automation_id,
                user_id: userId,
                parameters: job.arguments,
            };

            if (mode === "create") {
                await axios.post(`${baseUrl}/create-job`, body, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                return true; // Indicate success
            } else if (mode === "edit") {
                await axios.put(`${baseUrl}/update-job/`, body, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: { id: job.id },
                });
                if (onSuccess) {
                    onSuccess(job.id);
                }
                return true; // Indicate success
            }
        } catch (err) {
            let errorMessage = "An unknown error occurred. Please try again."; // Default error message

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || "An axios error occurred.";
                console.error("Error response:", errorMessage);

                if (errorMessage.includes("SQLITE_CONSTRAINT: UNIQUE constraint failed")) {
                    errorMessage = `"${job.name}" is Already in Use`;
                }
            } else {
                console.error("An unknown error occurred:", err);
            }

            setError(errorMessage); // Set the error message in state
            return false; // Indicate failure
        }
        finally {
            setLoading(false);
        }
    };

    return { submitJob, loading, error };
};

// Specific hooks for automation and job fetching
export const useFetchAutomations = () => {
    return useFetchData<Automation>(`${baseUrl}/read-automation`);
};

export const useFetchJobs = () => {
    return useFetchData<Job>(`${baseUrl}/read-job`);
};
