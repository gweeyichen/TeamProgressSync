import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DebtParameters {
  debtAmount: number;
  debtInterestRate: number;
  debtPaymentType: 'linear' | 'lumpSum';
  terminalGrowthRate: number;
}

interface DebtContextType {
  debtParameters: DebtParameters;
  setDebtParameters: (params: DebtParameters) => void;
}

const defaultDebtParams: DebtParameters = {
  debtAmount: 3000, // in thousands
  debtInterestRate: 7, // percentage
  debtPaymentType: 'linear',
  terminalGrowthRate: 3, // percentage
};

const DebtContext = createContext<DebtContextType | undefined>(undefined);

export function DebtProvider({ children }: { children: ReactNode }) {
  const [debtParameters, setDebtParameters] = useState<DebtParameters>(defaultDebtParams);

  return (
    <DebtContext.Provider value={{ debtParameters, setDebtParameters }}>
      {children}
    </DebtContext.Provider>
  );
}

export function useDebt() {
  const context = useContext(DebtContext);
  if (context === undefined) {
    throw new Error('useDebt must be used within a DebtProvider');
  }
  return context;
}