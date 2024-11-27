'use client'
import { GetUserByID } from '@/hooks/UserHooks';
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// Create a context to store the user data
const MobileUserContext = createContext<any>(null);

// Create the provider to fetch and provide user data
export const MobileUserProvider = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
  const [user, setUser] = useState<any>(null); // User state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  // Function to fetch user data
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const response = await GetUserByID(userId);
      console.log('RESPONSE', response)
      if (response) {
        setUser(response); // Set the fetched user data
      }
    } catch (err) {
      setError(err); // Set error if there's any issue
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false); // Set loading to false after the data is fetched
    }
  }, []);

  // Fetch the user data when the component mounts
  useEffect(() => { // You can replace this with params.user_id or any dynamic value
    fetchUserData(userId);
  }, [fetchUserData, userId]);

  return (
    <MobileUserContext.Provider value={{ user, loading, error }}>
      {children}
    </MobileUserContext.Provider>
  );
};

// Custom hook to use the user context
export const useMobileUser = () => {
  const context = useContext(MobileUserContext);
  if (!context) {
    throw new Error('useUser must be used within a MobileUserProvider');
  }
  return context;
};
