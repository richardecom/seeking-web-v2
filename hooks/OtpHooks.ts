const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

export const GetOneTimePin = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}otp/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error creating location:', error);
        return null;
    }
};