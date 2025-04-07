import { useState, useEffect } from 'react';
import { FinancialYear, FinancialData, ValidationError } from '@/lib/types';
import useIndustryData from '@/hooks/use-industry-data';
import ValidationSummary from '@/components/ui/ValidationSummary';
import FinancialTable from '@/components/ui/FinancialTable';
import IndustrySelector from '@/components/ui/industry-selector';
import { showNotification } from '@/components/ui/notification';
import { useUser } from '@/contexts/UserContext';

// Define initial financial data structure
const initialFinancialData = {
  incomeStatement: {
    '2022': { revenue: 5000, cogs: 1750 },
    '2023': { revenue: 6200, cogs: 2170 },
    '2024': { revenue: 7800, cogs: 2730 }
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
      equity: 2300
    },
    '2023': { 
      cash: 1300, 
      accountsReceivable: 1000, 
      inventory: 800, 
      fixedAssets: 2700,
      accountsPayable: 600,
      shortTermDebt: 900,
      longTermDebt: 1400,
      equity: 2900
    },
    '2024': { 
      cash: 1700, 
      accountsReceivable: 1200, 
      inventory: 900, 
      fixedAssets: 3400,
      accountsPayable: 700,
      shortTermDebt: 1100,
      longTermDebt: 1700,
      equity: 3700
    }
  },
  cashFlow: {
    '2022': { netIncome: 850, depreciation: 200, capitalExpenditures: 400 },
    '2023': { netIncome: 1050, depreciation: 270, capitalExpenditures: 500 },
    '2024': { netIncome: 1320, depreciation: 340, capitalExpenditures: 600 }
  }
};

export default function HistoricalFinancials() {
  const years: FinancialYear[] = ['2022', '2023', '2024'];
  
  const [financialData, setFinancialData] = useState(initialFinancialData);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const { getIndustryData } = useIndustryData();
  const { historicalFinancials, setHistoricalFinancials } = useUser();
  
  // Income Statement rows definition
  const incomeStatementRows = [
    { id: 'revenue', label: 'Revenue', editable: true, tooltip: 'Total revenue from sales', validateField: true },
    { id: 'cogs', label: 'Cost of Goods Sold', editable: true, tooltip: 'Direct costs attributable to goods sold', validateField: true },
    { id: 'grossProfit', label: 'Gross Profit', editable: false, type: 'total' },
    { id: 'operatingExpenses', label: 'Operating Expenses', type: 'header' },
    { id: 'researchDevelopment', label: 'Research & Development', editable: true, validateField: true },
    { id: 'salesMarketing', label: 'Sales & Marketing', editable: true, validateField: true },
    { id: 'generalAdmin', label: 'General & Administrative', editable: true, validateField: true },
    { id: 'totalOperatingExpenses', label: 'Total Operating Expenses', editable: false, type: 'total' },
    { id: 'operatingIncome', label: 'Operating Income', editable: false, type: 'total' },
    { id: 'interestExpense', label: 'Interest Expense', editable: true, validateField: true },
    { id: 'otherIncome', label: 'Other Income', editable: true, validateField: true },
    { id: 'incomeBeforeTax', label: 'Income Before Tax', editable: false, type: 'total' },
    { id: 'incomeTax', label: 'Income Tax', editable: true, validateField: true },
    { id: 'netIncome', label: 'Net Income', editable: false, type: 'total' }
  ];
  
  // Balance Sheet rows definition
  const balanceSheetRows = [
    { id: 'assets', label: 'Assets', type: 'header' },
    { id: 'cash', label: 'Cash & Cash Equivalents', editable: true, validateField: true },
    { id: 'accountsReceivable', label: 'Accounts Receivable', editable: true, validateField: true },
    { id: 'inventory', label: 'Inventory', editable: true, validateField: true },
    { id: 'fixedAssets', label: 'Property & Equipment', editable: true, validateField: true },
    { id: 'totalAssets', label: 'Total Assets', editable: false, type: 'total' },
    { id: 'liabilities', label: 'Liabilities', type: 'header' },
    { id: 'accountsPayable', label: 'Accounts Payable', editable: true, validateField: true },
    { id: 'shortTermDebt', label: 'Short-term Debt', editable: true, validateField: true },
    { id: 'longTermDebt', label: 'Long-term Debt', editable: true, validateField: true },
    { id: 'totalLiabilities', label: 'Total Liabilities', editable: false, type: 'total' },
    { id: 'equity', label: 'Total Equity', editable: true, type: 'total', validateField: true },
    { id: 'totalLiabilitiesEquity', label: 'Total Liabilities & Equity', editable: false, type: 'total' }
  ];
  
  // Cash Flow Statement rows definition
  const cashFlowRows = [
    { id: 'operatingActivities', label: 'Operating Activities', type: 'header' },
    { id: 'netIncome', label: 'Net Income', editable: true, validateField: true },
    { id: 'depreciation', label: 'Depreciation & Amortization', editable: true, validateField: true },
    { id: 'accountsReceivableChange', label: 'Change in Accounts Receivable', editable: true, validateField: true },
    { id: 'inventoryChange', label: 'Change in Inventory', editable: true, validateField: true },
    { id: 'accountsPayableChange', label: 'Change in Accounts Payable', editable: true, validateField: true },
    { id: 'netCashOperating', label: 'Net Cash from Operating Activities', editable: false, type: 'total' },
    { id: 'investingActivities', label: 'Investing Activities', type: 'header' },
    { id: 'capitalExpenditures', label: 'Capital Expenditures', editable: true, validateField: true },
    { id: 'netCashInvesting', label: 'Net Cash used in Investing Activities', editable: false, type: 'total' },
    { id: 'financingActivities', label: 'Financing Activities', type: 'header' },
    { id: 'debtChange', label: 'Change in Debt', editable: true, validateField: true },
    { id: 'dividendsPaid', label: 'Dividends Paid', editable: true, validateField: true },
    { id: 'netCashFinancing', label: 'Net Cash from Financing Activities', editable: false, type: 'total' },
    { id: 'netCashChange', label: 'Net Change in Cash', editable: false, type: 'total' }
  ];
  
  // Calculate derived values based on raw inputs
  useEffect(() => {
    const updatedIncomeStatement = { ...financialData.incomeStatement };
    const updatedBalanceSheet = { ...financialData.balanceSheet };
    const updatedCashFlow = { ...financialData.cashFlow };
    
    // Calculate for each year
    years.forEach(year => {
      // Income Statement calculations
      const income = updatedIncomeStatement[year] || {};
      const revenue = income.revenue || 0;
      const cogs = income.cogs || 0;
      const researchDevelopment = income.researchDevelopment || 0;
      const salesMarketing = income.salesMarketing || 0;
      const generalAdmin = income.generalAdmin || 0;
      const interestExpense = income.interestExpense || 0;
      const otherIncome = income.otherIncome || 0;
      const incomeTax = income.incomeTax || 0;
      
      // Calculate totals
      const grossProfit = revenue - cogs;
      const totalOperatingExpenses = researchDevelopment + salesMarketing + generalAdmin;
      const operatingIncome = grossProfit - totalOperatingExpenses;
      const incomeBeforeTax = operatingIncome - interestExpense + otherIncome;
      const netIncome = incomeBeforeTax - incomeTax;
      
      // Update derived values
      updatedIncomeStatement[year] = {
        ...income,
        grossProfit,
        totalOperatingExpenses,
        operatingIncome,
        incomeBeforeTax,
        netIncome
      };
      
      // Balance Sheet calculations
      const balanceSheet = updatedBalanceSheet[year] || {};
      const cash = balanceSheet.cash || 0;
      const accountsReceivable = balanceSheet.accountsReceivable || 0;
      const inventory = balanceSheet.inventory || 0;
      const fixedAssets = balanceSheet.fixedAssets || 0;
      const accountsPayable = balanceSheet.accountsPayable || 0;
      const shortTermDebt = balanceSheet.shortTermDebt || 0;
      const longTermDebt = balanceSheet.longTermDebt || 0;
      const equity = balanceSheet.equity || 0;
      
      // Calculate totals
      const totalAssets = cash + accountsReceivable + inventory + fixedAssets;
      const totalLiabilities = accountsPayable + shortTermDebt + longTermDebt;
      const totalLiabilitiesEquity = totalLiabilities + equity;
      
      // Update derived values
      updatedBalanceSheet[year] = {
        ...balanceSheet,
        totalAssets,
        totalLiabilities,
        totalLiabilitiesEquity
      };
      
      // Cash Flow calculations
      const cashFlow = updatedCashFlow[year] || {};
      cashFlow.netIncome = netIncome; // Link to income statement
      const depreciation = cashFlow.depreciation || 0;
      const accountsReceivableChange = cashFlow.accountsReceivableChange || 0;
      const inventoryChange = cashFlow.inventoryChange || 0;
      const accountsPayableChange = cashFlow.accountsPayableChange || 0;
      const capitalExpenditures = cashFlow.capitalExpenditures || 0;
      const debtChange = cashFlow.debtChange || 0;
      const dividendsPaid = cashFlow.dividendsPaid || 0;
      
      // Calculate totals
      const netCashOperating = netIncome + depreciation + accountsReceivableChange + inventoryChange + accountsPayableChange;
      const netCashInvesting = -capitalExpenditures;
      const netCashFinancing = debtChange - dividendsPaid;
      const netCashChange = netCashOperating + netCashInvesting + netCashFinancing;
      
      // Update derived values
      updatedCashFlow[year] = {
        ...cashFlow,
        netCashOperating,
        netCashInvesting,
        netCashFinancing,
        netCashChange
      };
    });
    
    // Use a flag to avoid infinite recursion
    const hasChanged = JSON.stringify(updatedIncomeStatement) !== JSON.stringify(financialData.incomeStatement) ||
                       JSON.stringify(updatedBalanceSheet) !== JSON.stringify(financialData.balanceSheet) ||
                       JSON.stringify(updatedCashFlow) !== JSON.stringify(financialData.cashFlow);
    
    if (hasChanged) {
      const updatedData = {
        incomeStatement: updatedIncomeStatement,
        balanceSheet: updatedBalanceSheet,
        cashFlow: updatedCashFlow
      };
      
      setFinancialData(updatedData);
      
      // Update the context with the latest historical financials
      setHistoricalFinancials(updatedData);
    }
  }, [years, financialData]);
  
  // Update financial data when a field changes
  const handleIncomeStatementChange = (field: string, year: FinancialYear, value: number) => {
    setFinancialData(prevData => ({
      ...prevData,
      incomeStatement: {
        ...prevData.incomeStatement,
        [year]: {
          ...prevData.incomeStatement[year],
          [field]: value
        }
      }
    }));
  };
  
  const handleBalanceSheetChange = (field: string, year: FinancialYear, value: number) => {
    setFinancialData(prevData => ({
      ...prevData,
      balanceSheet: {
        ...prevData.balanceSheet,
        [year]: {
          ...prevData.balanceSheet[year],
          [field]: value
        }
      }
    }));
  };
  
  const handleCashFlowChange = (field: string, year: FinancialYear, value: number) => {
    setFinancialData(prevData => ({
      ...prevData,
      cashFlow: {
        ...prevData.cashFlow,
        [year]: {
          ...prevData.cashFlow[year],
          [field]: value
        }
      }
    }));
  };
  
  // Handle industry selection
  const handleSelectIndustry = (industry: string) => {
    const data = getIndustryData(industry as any);
    
    // Map industry data to financial data structure
    const updatedFinancialData = {
      incomeStatement: {
        '2022': { 
          revenue: data.revenue[0], 
          cogs: data.cogs[0],
          researchDevelopment: data.expenses["Research & Development"][0],
          salesMarketing: data.expenses["Sales & Marketing"][0],
          generalAdmin: data.expenses["General & Administrative"][0],
        },
        '2023': { 
          revenue: data.revenue[1], 
          cogs: data.cogs[1],
          researchDevelopment: data.expenses["Research & Development"][1],
          salesMarketing: data.expenses["Sales & Marketing"][1],
          generalAdmin: data.expenses["General & Administrative"][1],
        },
        '2024': { 
          revenue: data.revenue[2], 
          cogs: data.cogs[2],
          researchDevelopment: data.expenses["Research & Development"][2],
          salesMarketing: data.expenses["Sales & Marketing"][2],
          generalAdmin: data.expenses["General & Administrative"][2],
        }
      },
      balanceSheet: {
        '2022': { 
          cash: data.assets["Cash & Equivalents"][0],
          accountsReceivable: data.assets["Accounts Receivable"] ? data.assets["Accounts Receivable"][0] : 0,
          inventory: data.assets["Inventory"] ? data.assets["Inventory"][0] : 0,
          fixedAssets: data.assets["Property & Equipment"][0],
          accountsPayable: data.liabilities["Accounts Payable"][0],
          shortTermDebt: data.liabilities["Short-term Debt"][0],
          longTermDebt: data.liabilities["Long-term Debt"][0],
          equity: 0 // Will be calculated
        },
        '2023': { 
          cash: data.assets["Cash & Equivalents"][1],
          accountsReceivable: data.assets["Accounts Receivable"] ? data.assets["Accounts Receivable"][1] : 0,
          inventory: data.assets["Inventory"] ? data.assets["Inventory"][1] : 0,
          fixedAssets: data.assets["Property & Equipment"][1],
          accountsPayable: data.liabilities["Accounts Payable"][1],
          shortTermDebt: data.liabilities["Short-term Debt"][1],
          longTermDebt: data.liabilities["Long-term Debt"][1],
          equity: 0 // Will be calculated
        },
        '2024': { 
          cash: data.assets["Cash & Equivalents"][2],
          accountsReceivable: data.assets["Accounts Receivable"] ? data.assets["Accounts Receivable"][2] : 0,
          inventory: data.assets["Inventory"] ? data.assets["Inventory"][2] : 0,
          fixedAssets: data.assets["Property & Equipment"][2],
          accountsPayable: data.liabilities["Accounts Payable"][2],
          shortTermDebt: data.liabilities["Short-term Debt"][2],
          longTermDebt: data.liabilities["Long-term Debt"][2],
          equity: 0 // Will be calculated
        }
      },
      cashFlow: { ...financialData.cashFlow } // Keep existing cash flow data for now
    };
    
    // Calculate and set equity to balance the balance sheet
    years.forEach(year => {
      const assets = 
        updatedFinancialData.balanceSheet[year].cash + 
        (updatedFinancialData.balanceSheet[year].accountsReceivable || 0) + 
        (updatedFinancialData.balanceSheet[year].inventory || 0) + 
        updatedFinancialData.balanceSheet[year].fixedAssets;
      
      const liabilities = 
        updatedFinancialData.balanceSheet[year].accountsPayable + 
        updatedFinancialData.balanceSheet[year].shortTermDebt + 
        updatedFinancialData.balanceSheet[year].longTermDebt;
      
      updatedFinancialData.balanceSheet[year].equity = assets - liabilities;
    });
    
    setFinancialData(updatedFinancialData);
    setShowValidation(false);
  };
  
  // Validate financial data
  const validateFinancialData = () => {
    const errors: ValidationError[] = [];
    const newFieldErrors: Record<string, string[]> = {};
    
    // Check if balance sheet balances
    years.forEach(year => {
      const balanceSheet = financialData.balanceSheet[year];
      const totalAssets = balanceSheet.totalAssets || 0;
      const totalLiabilitiesEquity = balanceSheet.totalLiabilitiesEquity || 0;
      
      if (Math.abs(totalAssets - totalLiabilitiesEquity) > 0.01) {
        errors.push({
          message: `Balance sheet doesn't balance for ${year}: Assets ($${totalAssets.toLocaleString()}) ≠ Liabilities + Equity ($${totalLiabilitiesEquity.toLocaleString()})`,
          fields: [`totalAssets_${year}`, `totalLiabilitiesEquity_${year}`]
        });
        
        newFieldErrors[`totalAssets_${year}`] = ['Balance sheet must balance'];
        newFieldErrors[`totalLiabilitiesEquity_${year}`] = ['Balance sheet must balance'];
      }
    });
    
    // Check if net income matches between income statement and cash flow
    years.forEach(year => {
      const incomeStatementNetIncome = financialData.incomeStatement[year]?.netIncome || 0;
      const cashFlowNetIncome = financialData.cashFlow[year]?.netIncome || 0;
      
      if (Math.abs(incomeStatementNetIncome - cashFlowNetIncome) > 0.01) {
        errors.push({
          message: `Net income doesn't match between income statement and cash flow for ${year}`,
          fields: [`incomeStatement.netIncome_${year}`, `cashFlow.netIncome_${year}`]
        });
      }
    });
    
    // Add more validation as needed
    
    setValidationErrors(errors);
    setFieldErrors(newFieldErrors);
    setShowValidation(true);
    
    if (errors.length === 0) {
      showNotification('Validation successful! No errors found.', 'success');
    } else {
      showNotification(`Validation complete. Found ${errors.length} issues.`, 'warning');
    }
    
    return errors.length === 0;
  };
  
  // Reset validation state
  const resetValidation = () => {
    setValidationErrors([]);
    setFieldErrors({});
    setShowValidation(false);
    showNotification('All fields have been reset', 'info');
  };
  
  // Save historical data
  const saveHistoricalData = () => {
    // In a real app, we would save the data to a database or API
    if (validateFinancialData()) {
      // Update the context with the latest historical financials
      setHistoricalFinancials(financialData);
      showNotification('Historical data saved successfully!', 'success');
    } else {
      showNotification('Please fix validation errors before saving.', 'error');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-800 mb-3 md:mb-0">Historical Financial Data (2022-2024)</h2>
        <IndustrySelector onSelectIndustry={handleSelectIndustry} />
      </div>
      
      <ValidationSummary errors={validationErrors} visible={showValidation} />
      
      <FinancialTable
        title="Income Statement ($000s)"
        years={years}
        rows={incomeStatementRows}
        data={financialData.incomeStatement}
        onDataChange={handleIncomeStatementChange}
        errors={fieldErrors}
      />
      
      <FinancialTable
        title="Balance Sheet ($000s)"
        years={years}
        rows={balanceSheetRows}
        data={financialData.balanceSheet}
        onDataChange={handleBalanceSheetChange}
        errors={fieldErrors}
      />
      
      <FinancialTable
        title="Cash Flow Statement ($000s)"
        years={years}
        rows={cashFlowRows}
        data={financialData.cashFlow}
        onDataChange={handleCashFlowChange}
        errors={fieldErrors}
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-neutral-200">
        <div className="mb-3 sm:mb-0">
          <button 
            id="validate-data" 
            onClick={validateFinancialData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <i className="ri-check-line mr-1"></i>
            Validate Data
          </button>
          <button 
            id="reset-data" 
            onClick={resetValidation}
            className="ml-2 inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <i className="ri-refresh-line mr-1"></i>
            Reset
          </button>
        </div>
        <div>
          <button 
            id="save-historical" 
            onClick={saveHistoricalData}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            <i className="ri-save-line mr-1"></i>
            Save Historical Data
          </button>
        </div>
      </div>
    </div>
  );
}
