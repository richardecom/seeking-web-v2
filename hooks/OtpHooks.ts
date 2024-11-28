import { apiRequest } from "./api";

export const GetOneTimePin = async (formData) => {
    const result = await apiRequest('otp/send', 'POST', formData);
    return result;
};