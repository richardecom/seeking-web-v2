const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT

export const GetCounts = async () => {
    try {
        const data = await fetch(`${API_BASE_URL}dashboard/counts`);
        return await data.json()
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return [];
    }
  };
export const GetRecentAddedItems = async () => {
    try {
        const data = await fetch(`${API_BASE_URL}dashboard/lists/item`);
        return await data.json()
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return [];
    }
};
export const GetRecentAddedLocation = async () => {
  try {
      const data = await fetch(`${API_BASE_URL}dashboard/lists/location`);
      return await data.json()
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }
};
  