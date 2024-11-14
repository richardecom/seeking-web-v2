const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

export const login = async (params) => {
    try {
        const response = await fetch(`${API_BASE_URL}auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error logging in user:', error);
        return null;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error logggin out user:', error);
        return null;
    }
};

export const GetOneTimePin = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}auth/otp/send`, {
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

export const VerifyOTP = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}auth/otp/verify`, {
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

export const ResetPassword = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}auth/reset-password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating location:', error);
        return null;
    }
};