import { apiRequest } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

export const GetAllItemRecords = async (params) => {
    
    try {
        const { limit, page, searchKey, status } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
        }).toString();
        const data = await fetch(`${API_BASE_URL}item?${queryString}`);
        return await data.json()
    } catch (error) {
      console.error('Error fetching location data:', error);
      return [];
    }
  };

//   export const CreateItem = async (formData) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}item`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log(result);
//         return result;
//     } catch (error) {
//         console.error('Error creating location:', error);
//         return null;
//     }
// };

export const CreateItem = async (formData) => {
    const result = await apiRequest('item', 'POST', formData);
    return result;
};

export const UpdateItem = async (formData) => {
    const result = await apiRequest('item', 'PATCH', formData);
    return result;
};

export const ArchivedItem = async (formData) => {
    const result = await apiRequest('item/status', 'PATCH', formData);
    return result;
};
// export const UpdateItem = async (formData) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}item`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log(result);
//         return result;
//     } catch (error) {
//         console.error('Error creating location:', error);
//         return null;
//     }
// };

// export const ArchivedItem = async (item_id) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}item/status`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({item_id:item_id}),
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         console.log(result);
//         return result;
//     } catch (error) {
//         console.error('Error creating location:', error);
//         return null;
//     }
// };

export const DownloadCsvFile = async (params) => {
    const { limit, page, searchKey, status, excludeIds } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
            excludeIds: excludeIds.toString(),
        }).toString();
    const result = await apiRequest(`item/export?${queryString}`, 'GET');
    
    if(!result){  return []; }
    return result;
};

// export const DownloadCsvFile = async (params) => {
//     try {
//         const { limit, page, searchKey, status, excludeIds } = params;
//         const queryString = new URLSearchParams({
//             limit: limit.toString(),
//             page: page.toString(),
//             searchKey: searchKey.toString(),
//             status: status.toString(),
//             excludeIds: excludeIds.toString(),
//         }).toString();
//         const data = await fetch(`${API_BASE_URL}item/export?${queryString}`);
//         return await data.json()
//     } catch (error) {
//       console.error('Error fetching location data:', error);
//       return [];
//     }
// };

export const GetRecordsByLocationID = async (location_id, params) => {
    const { limit, page, searchKey , status} = params;
    const queryString = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        searchKey: searchKey.toString(),
        status: status.toString(),
    }).toString();
    const result = await apiRequest(`item/location/${location_id}?${queryString}`, 'GET');
    
    if(!result){  return []; }
    return result;
};

// export const GetRecordsByLocationID = async (location_id, params) => {
    
//     try {
//         const { limit, page, searchKey , status} = params;
//         const queryString = new URLSearchParams({
//             limit: limit.toString(),
//             page: page.toString(),
//             searchKey: searchKey.toString(),
//             status: status.toString(),
//         }).toString();
//         const data = await fetch(`${API_BASE_URL}item/location/${location_id}?${queryString}`);
//         const result = await data.json()
//         return result
//     } catch (error) {
//       console.error('Error fetching location data:', error);
//       return [];
//     }
//   };
