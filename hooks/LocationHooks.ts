import { apiRequest } from "./api";

export const GetAllLocationRecords = async (params) => {
    const { limit, page, searchKey , status} = params;
    const queryString = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        searchKey: searchKey.toString(),
        status: status.toString(),
    }).toString();
    const result = await apiRequest(`location?${queryString}`, 'GET');
    
    if(!result){  return []; }
    return result;
};

export const CreateLocation = async (formData) => {
    const result = await apiRequest('location', 'POST', formData);
    return result;
};

export const UpdateLocation = async (formData) => {
    const result = await apiRequest('location', 'PATCH', formData);
    return result;
};

export const ArchivedLocation = async (formData) => {
    const result = await apiRequest('location/status', 'PATCH', formData);
    return result;
};

export const DownloadCsvFile = async (params) => {
    const { limit, page, searchKey, status, excludeIds } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
            excludeIds: excludeIds.toString(),
        }).toString();
    const result = await apiRequest(`location/export?${queryString}`, 'GET');
    
    if(!result){  return []; }
    return result;
};

export const GetRecordsByUserID = async (user_id, params) => {
    const { limit, page, searchKey, status, excludeIds } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
        }).toString();
    const result = await apiRequest(`location/user/${user_id}?${queryString}`, 'GET');
    
    if(!result){  return []; }
    return result;
};
