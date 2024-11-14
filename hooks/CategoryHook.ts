const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

export const GetAllCategories = async (params) => {
    
    try {
        const { limit, page, searchKey, status } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
        }).toString();
        const data = await fetch(`${API_BASE_URL}category?${queryString}`);
        return await data.json()
    } catch (error) {
      console.error('Error fetching location data:', error);
      return [];
    }
  };

  export const DownloadCsvFile = async (params) => {
    try {
        const { limit, page, searchKey, status, excludeIds } = params;
        const queryString = new URLSearchParams({
            limit: limit.toString(),
            page: page.toString(),
            searchKey: searchKey.toString(),
            status: status.toString(),
            excludeIds: excludeIds.toString(),
        }).toString();
        const data = await fetch(`${API_BASE_URL}category/export?${queryString}`);
        return await data.json()
    } catch (error) {
      console.error('Error fetching location data:', error);
      return [];
    }
};

export const CreateCategory = async (formData) => {
  try {
      const response = await fetch(`${API_BASE_URL}category`, {
          method: 'POST',
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
      console.error('Error creating category:', error);
      return null;
  }
};

export const UpdateCategory = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}category`, {
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
        console.error('Error updating category:', error);
        return null;
    }
};

export const DeleteCategory = async (category_id) => {
    try {
        const response = await fetch(`${API_BASE_URL}category/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({category_id:category_id}),
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
    