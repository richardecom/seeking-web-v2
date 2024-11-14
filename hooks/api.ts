const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const apiRequest = async (endpoint, method, formData = null) => {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        } as any;
        if (formData) {
            options.body = JSON.stringify(formData);
        }
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            if(response.status === 401){
                return { status: response.status, message: 'Unauthorized' }
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result =  await response.json();
        return result;
    } catch (error) {
        console.error('API request error:', error);
        return null;
    }
};
