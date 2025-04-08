import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
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
  
  // Default historical financials for initialization
  useEffect(() => {
    // If there are no historical financials, initialize with default values
    if (!historicalFinancials) {
      // These values match the default ones from HistoricalFinancials.tsx initialFinancialData
      setHistoricalFinancials({
        incomeStatement: {
          '2022': { 
            revenue: 5000, 
            cogs: 1750,
            researchDevelopment: 500,
            salesMarketing: 700,
            generalAdmin: 400,
            interestExpense: 120,
            otherIncome: 30,
            incomeTax: 360,
            grossProfit: 3250,
            totalOperatingExpenses: 1600,
            operatingIncome: 1650,
            incomeBeforeTax: 1560,
            netIncome: 1200
          },
          '2023': { 
            revenue: 6200, 
            cogs: 2170,
            researchDevelopment: 620,
            salesMarketing: 870,
            generalAdmin: 500,
            interestExpense: 150,
            otherIncome: 40,
            incomeTax: 450,
            grossProfit: 4030,
            totalOperatingExpenses: 1990,
            operatingIncome: 2040,
            incomeBeforeTax: 1930,
            netIncome: 1480
          },
          '2024': { 
            revenue: 7800, 
            cogs: 2730,
            researchDevelopment: 780,
            salesMarketing: 1090,
            generalAdmin: 620,
            interestExpense: 180,
            otherIncome: 50,
            incomeTax: 560,
            grossProfit: 5070,
            totalOperatingExpenses: 2490,
            operatingIncome: 2580,
            incomeBeforeTax: 2450,
            netIncome: 1890
          }
        },
        balanceSheet: {
          '2022': { 
            cash: 1000, 
            accountsReceivable: 800, 
            inventory: 700, 
            fixedAssets: 2000,
            accountsPayable: 500,
            shortTermDebt: 700,
            longTermDebt: 1000,
            equity: 2300,
            totalAssets: 4500,
            totalLiabilities: 2200,
            totalLiabilitiesEquity: 4500
          },
          '2023': { 
            cash: 1300, 
            accountsReceivable: 1000, 
            inventory: 800, 
            fixedAssets: 2700,
            accountsPayable: 600,
            shortTermDebt: 900,
            longTermDebt: 1400,
            equity: 2900,
            totalAssets: 5800,
            totalLiabilities: 2900,
            totalLiabilitiesEquity: 5800
          },
          '2024': { 
            cash: 1700, 
            accountsReceivable: 1200, 
            inventory: 900, 
            fixedAssets: 3400,
            accountsPayable: 700,
            shortTermDebt: 1100,
            longTermDebt: 1700,
            equity: 3700,
            totalAssets: 7200,
            totalLiabilities: 3500,
            totalLiabilitiesEquity: 7200
          }
        },
        cashFlow: {
          '2022': { 
            netIncome: 850, 
            depreciation: 200, 
            accountsReceivableChange: -80, 
            inventoryChange: -105, 
            accountsPayableChange: 25, 
            netCashOperating: 990, 
            capitalExpenditures: 400, 
            netCashInvesting: -400, 
            debtChange: 300, 
            dividendsPaid: 100, 
            netCashFinancing: 200, 
            netCashChange: 790 
          },
          '2023': { 
            netIncome: 1050, 
            depreciation: 270, 
            accountsReceivableChange: -200, 
            inventoryChange: -100, 
            accountsPayableChange: 100, 
            netCashOperating: 1120, 
            capitalExpenditures: 500, 
            netCashInvesting: -500, 
            debtChange: 600, 
            dividendsPaid: 120, 
            netCashFinancing: 480, 
            netCashChange: 1100 
          },
          '2024': { 
            netIncome: 1320, 
            depreciation: 340, 
            accountsReceivableChange: -200, 
            inventoryChange: -100, 
            accountsPayableChange: 100, 
            netCashOperating: 1460, 
            capitalExpenditures: 600, 
            netCashInvesting: -600, 
            debtChange: 500, 
            dividendsPaid: 156, 
            netCashFinancing: 344, 
            netCashChange: 1204 
          }
        }
      });
    }
  }, []);

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