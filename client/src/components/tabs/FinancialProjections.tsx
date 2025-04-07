import { useState, useEffect } from 'react';
import { ProjectionYear, FinancialData, ProjectionParams } from '@/lib/types';
import FinancialTable from '@/components/ui/FinancialTable';
import { useUser } from '@/contexts/UserContext';
import { showNotification } from '@/components/ui/notification';

// Initial projection parameters
const initialProjectionParams: ProjectionParams = {
  revenueGrowth: 10,
  grossMargin: 65,
  sgaPercent: 25,
  rdPercent: 10,
  capexPercent: 8,
  taxRate: 25,
  wcPercent: 15
};

export default function FinancialProjections() {
  const projectionYears: ProjectionYear[] = ['2025', '2026', '2027', '2028', '2029'];
  const { historicalFinancials } = useUser();
  
  const [params, setParams] = useState<ProjectionParams>(initialProjectionParams);
  const [projectedData, setProjectedData] = useState<{
    incomeStatement: Record<ProjectionYear, FinancialData>;
    balanceSheet: Record<ProjectionYear, FinancialData>;
    cashFlow: Record<ProjectionYear, FinancialData>;
  }>({
    incomeStatement: {
      '2025': {},
      '2026': {},
      '2027': {},
      '2028': {},
      '2029': {}
    },
    balanceSheet: {
      '2025': {},
      '2026': {},
      '2027': {},
      '2028': {},
      '2029': {}
    },
    cashFlow: {
      '2025': {},
      '2026': {},
      '2027': {},
      '2028': {},
      '2029': {}
    }
  });
  
  // Base values for projections - using data from historical financials when available
  const baseValues = historicalFinancials ? {
    revenue: historicalFinancials.incomeStatement['2024']?.revenue || 7800,
    cogs: historicalFinancials.incomeStatement['2024']?.cogs || 2730,
    cash: historicalFinancials.balanceSheet['2024']?.cash || 1700,
    accountsReceivable: historicalFinancials.balanceSheet['2024']?.accountsReceivable || 1200,
    inventory: historicalFinancials.balanceSheet['2024']?.inventory || 900,
    fixedAssets: historicalFinancials.balanceSheet['2024']?.fixedAssets || 3400,
    accountsPayable: historicalFinancials.balanceSheet['2024']?.accountsPayable || 700,
    shortTermDebt: historicalFinancials.balanceSheet['2024']?.shortTermDebt || 1100,
    longTermDebt: historicalFinancials.balanceSheet['2024']?.longTermDebt || 1700,
    equity: historicalFinancials.balanceSheet['2024']?.equity || 3700
  } : {
    revenue: 7800, // from 2024
    cogs: 2730,
    cash: 1700,
    accountsReceivable: 1200,
    inventory: 900,
    fixedAssets: 3400,
    accountsPayable: 700,
    shortTermDebt: 1100,
    longTermDebt: 1700,
    equity: 3700
  };
  
  // Display notification when historical data is loaded
  useEffect(() => {
    if (historicalFinancials) {
      showNotification("Projections updated with historical data from previous tab", "info");
    }
  }, [historicalFinancials]);

  // Update projection parameters
  const handleParamChange = (param: keyof ProjectionParams, value: number) => {
    setParams(prevParams => ({
      ...prevParams,
      [param]: value
    }));
  };
  
  // Generate financial projections based on parameters
  useEffect(() => {
    const newProjectedData = {
      incomeStatement: {} as Record<ProjectionYear, FinancialData>,
      balanceSheet: {} as Record<ProjectionYear, FinancialData>,
      cashFlow: {} as Record<ProjectionYear, FinancialData>
    };
    
    // Temporary storage for values that span across statements
    const tempValues: Record<ProjectionYear, Record<string, number>> = {
      '2025': {},
      '2026': {},
      '2027': {},
      '2028': {},
      '2029': {}
    };
    
    // Generate projections for each year
    let prevYearRevenue = baseValues.revenue;
    let prevYearAssets = baseValues.fixedAssets;
    let prevYearCash = baseValues.cash;
    
    projectionYears.forEach((year, index) => {
      // Income Statement Projections
      const revenue = index === 0 
        ? prevYearRevenue * (1 + params.revenueGrowth / 100)
        : newProjectedData.incomeStatement[projectionYears[index - 1]].revenue * (1 + params.revenueGrowth / 100);
      
      const cogs = revenue * (1 - params.grossMargin / 100);
      const grossProfit = revenue - cogs;
      
      const researchDevelopment = revenue * (params.rdPercent / 100);
      const salesMarketing = revenue * (params.sgaPercent / 100) * 0.6; // Assuming 60% of SG&A is sales & marketing
      const generalAdmin = revenue * (params.sgaPercent / 100) * 0.4; // Assuming 40% of SG&A is G&A
      
      const totalOperatingExpenses = researchDevelopment + salesMarketing + generalAdmin;
      const operatingIncome = grossProfit - totalOperatingExpenses;
      
      // Assume interest expense based on debt levels (simplified)
      const interestExpense = (baseValues.longTermDebt + baseValues.shortTermDebt) * 0.05; // Assuming 5% interest rate
      const otherIncome = revenue * 0.01; // Assuming other income is 1% of revenue
      
      const incomeBeforeTax = operatingIncome - interestExpense + otherIncome;
      const incomeTax = incomeBeforeTax * (params.taxRate / 100);
      const netIncome = incomeBeforeTax - incomeTax;
      
      tempValues[year].netIncome = netIncome;
      
      newProjectedData.incomeStatement[year] = {
        revenue,
        cogs,
        grossProfit,
        researchDevelopment,
        salesMarketing,
        generalAdmin,
        totalOperatingExpenses,
        operatingIncome,
        interestExpense,
        otherIncome,
        incomeBeforeTax,
        incomeTax,
        netIncome
      };
      
      // Balance Sheet Projections
      // Working capital assumptions
      const accountsReceivable = revenue * (params.wcPercent / 100) * 0.4; // Assuming 40% of working capital is A/R
      const inventory = revenue * (params.wcPercent / 100) * 0.3; // Assuming 30% of working capital is inventory
      const accountsPayable = revenue * (params.wcPercent / 100) * 0.2; // Assuming 20% of working capital is A/P
      
      // Capital expenditures
      const capex = revenue * (params.capexPercent / 100);
      tempValues[year].capex = capex;
      
      // Fixed assets grow by capex less depreciation
      const depreciation = prevYearAssets * 0.1; // Assuming 10% depreciation rate
      tempValues[year].depreciation = depreciation;
      const fixedAssets = prevYearAssets + capex - depreciation;
      prevYearAssets = fixedAssets;
      
      // Debt levels (simplified)
      const shortTermDebt = baseValues.shortTermDebt * (1 + params.revenueGrowth / 200); // Debt grows at half the rate of revenue
      const longTermDebt = baseValues.longTermDebt * (1 + params.revenueGrowth / 300); // Long-term debt grows more slowly
      
      // Calculate cash (simplified) - in a real model this would be linked to the cash flow statement
      const cash = prevYearCash + netIncome * 0.6; // Assuming 60% of net income converts to cash
      prevYearCash = cash;
      
      const totalAssets = cash + accountsReceivable + inventory + fixedAssets;
      const totalLiabilities = accountsPayable + shortTermDebt + longTermDebt;
      
      // Equity grows by retained earnings
      const retainedEarnings = netIncome * 0.8; // Assuming 80% of net income is retained
      const equity = baseValues.equity + retainedEarnings;
      
      const totalLiabilitiesEquity = totalLiabilities + equity;
      
      newProjectedData.balanceSheet[year] = {
        cash,
        accountsReceivable,
        inventory,
        fixedAssets,
        totalAssets,
        accountsPayable,
        shortTermDebt,
        longTermDebt,
        totalLiabilities,
        equity,
        totalLiabilitiesEquity
      };
      
      // Cash Flow Statement Projections
      const netCashOperating = netIncome + depreciation - (accountsReceivable - baseValues.accountsReceivable) - 
                              (inventory - baseValues.inventory) + (accountsPayable - baseValues.accountsPayable);
                              
      const netCashInvesting = -capex;
      
      const debtChange = (shortTermDebt - baseValues.shortTermDebt) + (longTermDebt - baseValues.longTermDebt);
      const dividendsPaid = netIncome * 0.2; // Assuming 20% of net income is paid as dividends
      
      const netCashFinancing = debtChange - dividendsPaid;
      const netCashChange = netCashOperating + netCashInvesting + netCashFinancing;
      
      newProjectedData.cashFlow[year] = {
        netIncome,
        depreciation,
        accountsReceivableChange: -(accountsReceivable - baseValues.accountsReceivable),
        inventoryChange: -(inventory - baseValues.inventory),
        accountsPayableChange: accountsPayable - baseValues.accountsPayable,
        netCashOperating,
        capitalExpenditures: capex,
        netCashInvesting,
        debtChange,
        dividendsPaid,
        netCashFinancing,
        netCashChange
      };
    });
    
    setProjectedData(newProjectedData);
  }, [params, projectionYears, historicalFinancials]);
  
  // Income Statement rows definition
  const incomeStatementRows = [
    { id: 'revenue', label: 'Revenue', editable: false },
    { id: 'cogs', label: 'Cost of Goods Sold', editable: false },
    { id: 'grossProfit', label: 'Gross Profit', editable: false, type: 'total' },
    { id: 'operatingExpenses', label: 'Operating Expenses', type: 'header' },
    { id: 'researchDevelopment', label: 'Research & Development', editable: false },
    { id: 'salesMarketing', label: 'Sales & Marketing', editable: false },
    { id: 'generalAdmin', label: 'General & Administrative', editable: false },
    { id: 'totalOperatingExpenses', label: 'Total Operating Expenses', editable: false, type: 'total' },
    { id: 'operatingIncome', label: 'Operating Income', editable: false, type: 'total' },
    { id: 'interestExpense', label: 'Interest Expense', editable: false },
    { id: 'otherIncome', label: 'Other Income', editable: false },
    { id: 'incomeBeforeTax', label: 'Income Before Tax', editable: false, type: 'total' },
    { id: 'incomeTax', label: 'Income Tax', editable: false },
    { id: 'netIncome', label: 'Net Income', editable: false, type: 'total' }
  ];
  
  // Balance Sheet rows definition
  const balanceSheetRows = [
    { id: 'assets', label: 'Assets', type: 'header' },
    { id: 'cash', label: 'Cash & Cash Equivalents', editable: false },
    { id: 'accountsReceivable', label: 'Accounts Receivable', editable: false },
    { id: 'inventory', label: 'Inventory', editable: false },
    { id: 'fixedAssets', label: 'Property & Equipment', editable: false },
    { id: 'totalAssets', label: 'Total Assets', editable: false, type: 'total' },
    { id: 'liabilities', label: 'Liabilities', type: 'header' },
    { id: 'accountsPayable', label: 'Accounts Payable', editable: false },
    { id: 'shortTermDebt', label: 'Short-term Debt', editable: false },
    { id: 'longTermDebt', label: 'Long-term Debt', editable: false },
    { id: 'totalLiabilities', label: 'Total Liabilities', editable: false, type: 'total' },
    { id: 'equity', label: 'Total Equity', editable: false, type: 'total' },
    { id: 'totalLiabilitiesEquity', label: 'Total Liabilities & Equity', editable: false, type: 'total' }
  ];
  
  // Cash Flow Statement rows definition
  const cashFlowRows = [
    { id: 'operatingActivities', label: 'Operating Activities', type: 'header' },
    { id: 'netIncome', label: 'Net Income', editable: false },
    { id: 'depreciation', label: 'Depreciation & Amortization', editable: false },
    { id: 'accountsReceivableChange', label: 'Change in Accounts Receivable', editable: false },
    { id: 'inventoryChange', label: 'Change in Inventory', editable: false },
    { id: 'accountsPayableChange', label: 'Change in Accounts Payable', editable: false },
    { id: 'netCashOperating', label: 'Net Cash from Operating Activities', editable: false, type: 'total' },
    { id: 'investingActivities', label: 'Investing Activities', type: 'header' },
    { id: 'capitalExpenditures', label: 'Capital Expenditures', editable: false },
    { id: 'netCashInvesting', label: 'Net Cash used in Investing Activities', editable: false, type: 'total' },
    { id: 'financingActivities', label: 'Financing Activities', type: 'header' },
    { id: 'debtChange', label: 'Change in Debt', editable: false },
    { id: 'dividendsPaid', label: 'Dividends Paid', editable: false },
    { id: 'netCashFinancing', label: 'Net Cash from Financing Activities', editable: false, type: 'total' },
    { id: 'netCashChange', label: 'Net Change in Cash', editable: false, type: 'total' }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Financial Projections (2025-2029)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Projection Parameters</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Revenue Growth Rate</span>
              <span id="revenue-growth-value">{params.revenueGrowth}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={params.revenueGrowth} 
              step="0.5" 
              onChange={(e) => handleParamChange('revenueGrowth', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Gross Margin</span>
              <span id="gross-margin-value">{params.grossMargin}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="90" 
              value={params.grossMargin} 
              step="0.5" 
              onChange={(e) => handleParamChange('grossMargin', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>SG&A (% of Revenue)</span>
              <span id="sga-percent-value">{params.sgaPercent}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="50" 
              value={params.sgaPercent} 
              step="0.5" 
              onChange={(e) => handleParamChange('sgaPercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>R&D (% of Revenue)</span>
              <span id="rd-percent-value">{params.rdPercent}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={params.rdPercent} 
              step="0.5" 
              onChange={(e) => handleParamChange('rdPercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>CapEx (% of Revenue)</span>
              <span id="capex-percent-value">{params.capexPercent}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={params.capexPercent} 
              step="0.5" 
              onChange={(e) => handleParamChange('capexPercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Tax Rate</span>
              <span id="tax-rate-value">{params.taxRate}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="40" 
              value={params.taxRate} 
              step="0.5" 
              onChange={(e) => handleParamChange('taxRate', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Working Capital (% of Revenue)</span>
              <span id="wc-percent-value">{params.wcPercent}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={params.wcPercent} 
              step="0.5" 
              onChange={(e) => handleParamChange('wcPercent', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      <FinancialTable
        title="Projected Income Statement ($000s)"
        years={projectionYears}
        rows={incomeStatementRows}
        data={projectedData.incomeStatement}
      />
      
      <FinancialTable
        title="Projected Balance Sheet ($000s)"
        years={projectionYears}
        rows={balanceSheetRows}
        data={projectedData.balanceSheet}
      />
      
      <FinancialTable
        title="Projected Cash Flow Statement ($000s)"
        years={projectionYears}
        rows={cashFlowRows}
        data={projectedData.cashFlow}
      />
    </div>
  );
}
