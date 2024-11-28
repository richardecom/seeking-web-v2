'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
const FilterContext = createContext<any>(null);

export const LSFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState({
    page: 1,
    searchKey: '',
    status: '',
    userRole: '0',
    userType: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sf = sessionStorage.getItem('userFilters');
      const initialFilters = sf ? JSON.parse(sf) : {};
      setFilters(initialFilters);
      setIsLoading(false); // Once the filters are set, set loading to false
    }
  }, []);

  // Only render children if loading is complete
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a LSFilterProvider');
  }
  return context;
};