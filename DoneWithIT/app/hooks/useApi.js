import { useState } from "react";

export default useApi = (apiFunc) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);


    const request = async () => {
        // const request = async (...arg) => {
        setLoading(true);
        const respone = await apiFunc;
        // const respone = await apiFunc(...arg);

        if (!respone.ok) return setError(true)

        setLoading(false);
        setError(false);
        setData(respone.data)
    }


    return { request, data, loading }
}