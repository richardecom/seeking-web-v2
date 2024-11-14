const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT
console.log('API_BASE_URL: ', API_BASE_URL)


export const GetAllMobileUser = async (params) => {
    try {
        const { limit, page, searchKey } = params;

        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
        }).toString();

        const result = await fetch(`${API_BASE_URL}user?${queryString}`);
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        const response = await result.json();
        if (response && response.data) {
            return response.data;
        } else {
            console.error('Unexpected response structure:', response);
            return [];
        }
    } catch (error) {
      console.error('Error fetching mobile users data:', error);
      return [];
    }
  };
  export const GetAllUserLocations = async (params) => {
    try {
        console.log('PARAMS: ', params)
        const { limit, page, searchKey, user_id } = params;
        console.log('PARAMS user_id: ', user_id)
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            user_id: user_id.toString(),
        }).toString();

        console.log('queryString', queryString)

        const result = await fetch(`${API_BASE_URL}user/location?${queryString}`);
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        const response = await result.json();
        if (response && response.data) {
            return response.data;
        } else {
            console.error('Unexpected response structure:', response);
            return [];
        }
    } catch (error) {
      console.error('Error fetching users location data:', error);
      return [];
    }
  };

  

  export const GetAllUsers = async (params) => {
    
    try {
        const { limit, page, searchKey, status, userRole, userType  } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
            userRole: userRole.toString(),
            userType: userType.toString(),
        }).toString();
        const data = await fetch(`${API_BASE_URL}user?${queryString}`);
        return await data.json()
    } catch (error) {
      console.error('Error fetching user data:', error);
      return [];
    }
  };

  export const DownloadCsvFile = async (params) => {
    try {
        const { limit, page, searchKey, status, userRole, userType, excludeIds } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
            userRole: userRole.toString(),
            userType: userType.toString(),
            excludeIds: excludeIds.toString(),
        }).toString();
        const data = await fetch(`${API_BASE_URL}user/export?${queryString}`);
        return await data.json()
    } catch (error) {
      console.error('Error fetching location data:', error);
      return [];
    }
};

export const CreateUser = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}user`, {
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

export const UpdateUser = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}user`, {
            method: 'PATCH',
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

export const DeleteUserAccount = async (user_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}user/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user_id:user_id}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting category:', error);
        return null;
    }
};

export const GetUserByID = async (user_id) => {
    try {
        const result = await fetch(`${API_BASE_URL}user/${user_id}`);
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        const response = await result.json();
        if (response && response.data) {
            return response.data;
        } else {
            console.error('Unexpected response structure:', response);
            return [];
        }
    } catch (error) {
      console.error('Error fetching mobile users data:', error);
      return [];
    }
  };