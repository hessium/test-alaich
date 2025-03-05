import {useEffect, useState} from "react";
import {apiRequest} from "../shared/api/api.js";
import {useDocumentTitle} from "../shared/hooks/use-document-title.js";

export default  function About() {
    useDocumentTitle('About us')

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(  () => {
        const fetchData = async () => {
            try {
                const response = await apiRequest('GET', '/info');
                if(!response.success) return setError(response.data)

                setData(response.data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    return (
        <h1>
            {data?.info}
        </h1>
    )
}