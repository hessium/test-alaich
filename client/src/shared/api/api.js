
const BASE_URL = 'http://localhost:3001'
export const apiRequest = async (
    method = 'GET',
    endpoint,
    body = null,
    headers = {},
    signal = null
) => {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        signal
    };

    if (method !== 'GET' && method !== 'HEAD') {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.status !== 204 ? await response.json() : null;
    } catch (error) {
        if (error.name !== 'AbortError') {

            console.error('API request failed:', error);
        }
        throw error;
    }
};