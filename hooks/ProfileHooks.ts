const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT
export const UpdateProfile = async (formData, option) => {
    try {
        const response = await fetch(`${API_BASE_URL}profile/${option}`, {
            method: 'PATCH',
            body: option === 'basic' ? formData: JSON.stringify(formData) ,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        return null;
    }
};