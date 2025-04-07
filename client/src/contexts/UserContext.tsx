import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { FinancialYear, FinancialData } from '@/lib/types';

// Define the context interface
interface UserContextType {
  userId: number | null;
  setUserId: (id: number | null) => void;
  historicalFinancials: {
    incomeStatement: Record<FinancialYear, FinancialData>;
    balanceSheet: Record<FinancialYear, FinancialData>;
    cashFlow: Record<FinancialYear, FinancialData>;
  } | null;
  setHistoricalFinancials: (data: {
    incomeStatement: Record<FinancialYear, FinancialData>;
    balanceSheet: Record<FinancialYear, FinancialData>;
    cashFlow: Record<FinancialYear, FinancialData>;
  }) => void;
  saveFinancialData: (data: any) => Promise<any>;
  loadFinancialData: () => Promise<any>;
  saveValuationParameters: (params: any) => Promise<any>;
  loadValuationParameters: () => Promise<any>;
  saveInvestmentModel: (model: any) => Promise<any>;
  loadInvestmentModel: () => Promise<any>;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  userId: 1, // Default user ID 
  setUserId: () => {},
  historicalFinancials: null,
  setHistoricalFinancials: () => {},
  saveFinancialData: async () => null,
  loadFinancialData: async () => null,
  saveValuationParameters: async () => null,
  loadValuationParameters: async () => null,
  saveInvestmentModel: async () => null,
  loadInvestmentModel: async () => null,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(1); // Default user ID for now
  
  // Historical financials state to share between components
  const [historicalFinancials, setHistoricalFinancials] = useState<{
    incomeStatement: Record<FinancialYear, FinancialData>;
    balanceSheet: Record<FinancialYear, FinancialData>;
    cashFlow: Record<FinancialYear, FinancialData>;
  } | null>(null);

  // Mutation to save financial data
  const financialDataMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/financial-data', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          dataJson: JSON.stringify(data),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/financial-data', userId] });
    },
  });

  // Mutation to save valuation parameters
  const valuationParamsMutation = useMutation({
    mutationFn: async (params: any) => {
      return apiRequest('/api/valuation-parameters', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          paramsJson: JSON.stringify(params),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/valuation-parameters', userId] });
    },
  });

  // Mutation to save investment model
  const investmentModelMutation = useMutation({
    mutationFn: async (model: any) => {
      return apiRequest('/api/investment-models', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          modelJson: JSON.stringify(model),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investment-models', userId] });
    },
  });

  // Function to save financial data
  const saveFinancialData = async (data: any) => {
    if (!userId) return null;
    try {
      const result = await financialDataMutation.mutateAsync(data);
      return result;
    } catch (error) {
      console.error('Error saving financial data:', error);
      throw error;
    }
  };

  // Function to load financial data
  const loadFinancialData = async () => {
    if (!userId) return null;
    try {
      const response = await apiRequest(`/api/financial-data/${userId}`, {
        method: 'GET',
      });
      
      if (response && response.dataJson) {
        try {
          // Parse the JSON string back into an object
          const data = JSON.parse(response.dataJson);
          return data;
        } catch (parseError) {
          console.error('Error parsing financial data JSON:', parseError);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading financial data:', error);
      return null;
    }
  };

  // Function to save valuation parameters
  const saveValuationParameters = async (params: any) => {
    if (!userId) return null;
    try {
      const result = await valuationParamsMutation.mutateAsync(params);
      return result;
    } catch (error) {
      console.error('Error saving valuation parameters:', error);
      throw error;
    }
  };

  // Function to load valuation parameters
  const loadValuationParameters = async () => {
    if (!userId) return null;
    try {
      const response = await apiRequest(`/api/valuation-parameters/${userId}`, {
        method: 'GET',
      });
      
      if (response && response.paramsJson) {
        try {
          // Parse the JSON string back into an object
          const params = JSON.parse(response.paramsJson);
          return params;
        } catch (parseError) {
          console.error('Error parsing valuation parameters JSON:', parseError);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading valuation parameters:', error);
      return null;
    }
  };

  // Function to save investment model
  const saveInvestmentModel = async (model: any) => {
    if (!userId) return null;
    try {
      const result = await investmentModelMutation.mutateAsync(model);
      return result;
    } catch (error) {
      console.error('Error saving investment model:', error);
      throw error;
    }
  };

  // Function to load investment model
  const loadInvestmentModel = async () => {
    if (!userId) return null;
    try {
      const response = await apiRequest(`/api/investment-models/${userId}`, {
        method: 'GET',
      });
      
      if (response && response.modelJson) {
        try {
          // Parse the JSON string back into an object
          const model = JSON.parse(response.modelJson);
          return model;
        } catch (parseError) {
          console.error('Error parsing investment model JSON:', parseError);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error loading investment model:', error);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        historicalFinancials,
        setHistoricalFinancials,
        saveFinancialData,
        loadFinancialData,
        saveValuationParameters,
        loadValuationParameters,
        saveInvestmentModel,
        loadInvestmentModel,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);