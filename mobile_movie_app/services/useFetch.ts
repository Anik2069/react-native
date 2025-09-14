import { useEffect, useState } from "react";

const useFetch = <T>(fetchFunctions: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);


    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetchFunctions();
        
            setData(data);
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    };




    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    };

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, []);


    return {
        data,
        loading,
        error,
        refetch: fetchData,
        reset,
    };
};

export default useFetch;