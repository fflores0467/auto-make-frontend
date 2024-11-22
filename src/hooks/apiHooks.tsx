import { useState, useEffect } from "react";
import { Job, Automation } from "../constants/types";
import axios from "axios";

export const useFetchData = <T,>(url: string) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
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
        };
        fetchData();
    }, [url]);

    return { data, loading, error };
};

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const useFetchAutomations = () => {
    return useFetchData<Automation>(`${baseUrl}/read-automation`);
};

export const useFetchJobs = () => {
    return useFetchData<Job>(`${baseUrl}/read-job`);
};

