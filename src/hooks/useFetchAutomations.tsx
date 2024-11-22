import { useState, useEffect } from "react";
import axios from "axios";
import { Automation } from "../constants/types";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const useFetchAutomations = () => {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAutomations = async () => {
            try {
                const response = await axios.get(`${baseUrl}/read-automation`);
                setAutomations(response.data.data);
                setError("");
            } catch (err) {
                console.error("Error fetching automations:", err);
                setError("Failed to load automations.");
            } finally {
                setLoading(false);
            }
        };
        fetchAutomations();
    }, []);

    return { automations, loading, error };
};
