import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { FinancialYear } from '@/lib/types';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';
const MONTHS: Month[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Get current date (April 2025)
const CURRENT_DATE = new Date(2025, 3, 8); // April 8, 2025
const CURRENT_MONTH_INDEX = CURRENT_DATE.getMonth();
const CURRENT_MONTH = MONTHS[CURRENT_MONTH_INDEX];
const CURRENT_YEAR = CURRENT_DATE.getFullYear();

// Generate the next 12 months from April 2025
const FORECAST_MONTHS = [...Array(12)].map((_, i) => {
  const futureDate = new Date(CURRENT_DATE);
  futureDate.setMonth(CURRENT_MONTH_INDEX + i);
  const monthIndex = futureDate.getMonth();
  const year = futureDate.getFullYear();
  return {
    month: MONTHS[monthIndex],
    year: year,
    label: `${MONTHS[monthIndex]}${year !== CURRENT_YEAR ? ' ' + year : ''}`
  };
});

// Interfaces for data structures
interface MonthlyCashFlowData {
  operatingActivities: {
    revenue: number[];
    depreciation: number[];
    receivablesChange: number[];
    inventoryChange: number[];
    payablesChange: number[];
    netOperatingCashFlow: number[];
  };
  investingActivities: {
    capitalExpenditures: number[];
    netInvestingCashFlow: number[];
  };
  financingActivities: {
    dividendsPaid: number[];
    debtRepayment: number[];
    netFinancingCashFlow: number[];
  };
  cashBalance: {
    netChange: number[];
    beginningBalance: number[];
    endingBalance: number[];
  };
}

interface AnnualCashFlowSummary {
  revenue: number;
  depreciation: number;
  receivablesChange: number;
  inventoryChange: number;
  payablesChange: number;
  netOperatingCashFlow: number;
  capitalExpenditures: number;
  netInvestingCashFlow: number;
  dividendsPaid: number;
  debtRepayment: number;
  netFinancingCashFlow: number;
  netChange: number;
  beginningBalance: number;
  endingBalance: number;
}

export default function MonthlyCashFlow() {
  const { historicalFinancials } = useUser();
  const [historicalSummary, setHistoricalSummary] = useState<Record<FinancialYear, AnnualCashFlowSummary>>({
    '2022': createEmptyAnnualSummary(),
    '2023': createEmptyAnnualSummary(),
    '2024': createEmptyAnnualSummary(),
  });
  const [futureCashFlow, setFutureCashFlow] = useState<MonthlyCashFlowData>(createEmptyMonthlyCashFlowData());

  // Create empty data structures
  function createEmptyMonthlyCashFlowData(): MonthlyCashFlowData {
    const emptyMonthArray = Array(12).fill(0);
    return {
      operatingActivities: {
        revenue: [...emptyMonthArray],
        depreciation: [...emptyMonthArray],
        receivablesChange: [...emptyMonthArray],
        inventoryChange: [...emptyMonthArray],
        payablesChange: [...emptyMonthArray],
        netOperatingCashFlow: [...emptyMonthArray],
      },
      investingActivities: {
        capitalExpenditures: [...emptyMonthArray],
        netInvestingCashFlow: [...emptyMonthArray],
      },
      financingActivities: {
        dividendsPaid: [...emptyMonthArray],
        debtRepayment: [...emptyMonthArray],
        netFinancingCashFlow: [...emptyMonthArray],
      },
      cashBalance: {
        netChange: [...emptyMonthArray],
        beginningBalance: [...emptyMonthArray],
        endingBalance: [...emptyMonthArray],
      }
    };
  }

  function createEmptyAnnualSummary(): AnnualCashFlowSummary {
    return {
      revenue: 0,
      depreciation: 0,
      receivablesChange: 0,
      inventoryChange: 0,
      payablesChange: 0,
      netOperatingCashFlow: 0,
      capitalExpenditures: 0,
      netInvestingCashFlow: 0,
      dividendsPaid: 0,
      debtRepayment: 0,
      netFinancingCashFlow: 0,
      netChange: 0,
      beginningBalance: 0,
      endingBalance: 0
    };
  }

  // Consolidated data for calculation
  const financialData = useMemo(() => {
    if (!historicalFinancials) return null;

    return {
      '2022': {
        revenue: historicalFinancials.incomeStatement['2022'].revenue || 0,
        cogs: historicalFinancials.incomeStatement['2022'].cogs || 0,
        accountsReceivable: historicalFinancials.balanceSheet['2022'].accountsReceivable || 0,
        inventory: historicalFinancials.balanceSheet['2022'].inventory || 0,
        accountsPayable: historicalFinancials.balanceSheet['2022'].accountsPayable || 0,
        fixedAssets: historicalFinancials.balanceSheet['2022'].fixedAssets || 0,
        cash: historicalFinancials.balanceSheet['2022'].cash || 0,
        shortTermDebt: historicalFinancials.balanceSheet['2022'].shortTermDebt || 0,
        longTermDebt: historicalFinancials.balanceSheet['2022'].longTermDebt || 0,
      },
      '2023': {
        revenue: historicalFinancials.incomeStatement['2023'].revenue || 0,
        cogs: historicalFinancials.incomeStatement['2023'].cogs || 0,
        accountsReceivable: historicalFinancials.balanceSheet['2023'].accountsReceivable || 0,
        inventory: historicalFinancials.balanceSheet['2023'].inventory || 0,
        accountsPayable: historicalFinancials.balanceSheet['2023'].accountsPayable || 0,
        fixedAssets: historicalFinancials.balanceSheet['2023'].fixedAssets || 0,
        cash: historicalFinancials.balanceSheet['2023'].cash || 0,
        shortTermDebt: historicalFinancials.balanceSheet['2023'].shortTermDebt || 0,
        longTermDebt: historicalFinancials.balanceSheet['2023'].longTermDebt || 0,
      },
      '2024': {
        revenue: historicalFinancials.incomeStatement['2024'].revenue || 0,
        cogs: historicalFinancials.incomeStatement['2024'].cogs || 0,
        accountsReceivable: historicalFinancials.balanceSheet['2024'].accountsReceivable || 0,
        inventory: historicalFinancials.balanceSheet['2024'].inventory || 0,
        accountsPayable: historicalFinancials.balanceSheet['2024'].accountsPayable || 0,
        fixedAssets: historicalFinancials.balanceSheet['2024'].fixedAssets || 0,
        cash: historicalFinancials.balanceSheet['2024'].cash || 0,
        shortTermDebt: historicalFinancials.balanceSheet['2024'].shortTermDebt || 0,
        longTermDebt: historicalFinancials.balanceSheet['2024'].longTermDebt || 0,
      }
    };
  }, [historicalFinancials]);

  // Calculate historical annual summary
  useEffect(() => {
    if (!financialData) return;

    const years: FinancialYear[] = ['2022', '2023', '2024'];
    const newHistoricalSummary = {...historicalSummary};

    years.forEach(year => {
      const data = financialData[year];
      let prevYear = year === '2022' ? null : years[years.indexOf(year) - 1];
      
      // Annual figures calculation
      const annualDepreciation = data.fixedAssets * 0.1; // Assume 10% depreciation rate
      
      // Balance sheet changes from previous year
      let receivablesChange = 0;
      let inventoryChange = 0;
      let payablesChange = 0;
      
      if (year === '2022') {
        // For 2022, we don't have previous year data, so we'll approximate
        receivablesChange = -data.accountsReceivable * 0.1; // Assume 10% reduction
        inventoryChange = -data.inventory * 0.15; // Assume 15% reduction
        payablesChange = data.accountsPayable * 0.05; // Assume 5% increase
      } else if (prevYear) {
        receivablesChange = data.accountsReceivable - financialData[prevYear].accountsReceivable;
        inventoryChange = data.inventory - financialData[prevYear].inventory;
        payablesChange = data.accountsPayable - financialData[prevYear].accountsPayable;
      }
      
      // Capital expenditures
      let annualCapEx = 0;
      if (year === '2022') {
        annualCapEx = data.fixedAssets * 0.15; // Assume 15% of fixed assets
      } else if (prevYear) {
        annualCapEx = Math.max(0, data.fixedAssets - financialData[prevYear].fixedAssets + annualDepreciation);
      }
      
      // Debt and dividends
      const totalDebt = data.shortTermDebt + data.longTermDebt;
      const annualDebtRepayment = totalDebt * 0.1; // Assume 10% of debt is repaid annually
      const annualDividends = data.revenue * 0.02; // 2% of revenue as dividends
      
      // Operating cash flow
      const annualOperatingCashFlow = data.revenue - data.cogs - data.revenue * 0.2 + annualDepreciation - 
                                      receivablesChange - inventoryChange + payablesChange;
      
      // Net investing cash flow
      const annualInvestingCashFlow = -annualCapEx;
      
      // Net financing cash flow
      const annualFinancingCashFlow = -annualDividends - annualDebtRepayment;
      
      // Net change in cash
      const annualNetChange = annualOperatingCashFlow + annualInvestingCashFlow + annualFinancingCashFlow;
      
      // Beginning and ending cash balances
      const beginningBalance = data.cash - annualNetChange;
      const endingBalance = data.cash;
      
      // Set the annual summary
      newHistoricalSummary[year] = {
        revenue: data.revenue,
        depreciation: annualDepreciation,
        receivablesChange: receivablesChange,
        inventoryChange: inventoryChange,
        payablesChange: payablesChange,
        netOperatingCashFlow: annualOperatingCashFlow,
        capitalExpenditures: annualCapEx,
        netInvestingCashFlow: annualInvestingCashFlow,
        dividendsPaid: annualDividends,
        debtRepayment: annualDebtRepayment,
        netFinancingCashFlow: annualFinancingCashFlow,
        netChange: annualNetChange,
        beginningBalance: beginningBalance,
        endingBalance: endingBalance
      };
    });
    
    setHistoricalSummary(newHistoricalSummary);
  }, [financialData]);

  // Calculate future cash flow (12 months from April 2025)
  useEffect(() => {
    if (!financialData || !historicalSummary['2024']) return;

    // Base future projections on 2024 data
    const latestYear: FinancialYear = '2024';
    const latestData = financialData[latestYear];
    const latestSummary = historicalSummary[latestYear];
    
    // Create forecast data structure
    const newFutureCashFlow = createEmptyMonthlyCashFlowData();
    
    // Growth rates and assumptions
    const annualRevenueGrowthRate = 0.08; // 8% annual growth
    const monthlyRevenueGrowthRate = Math.pow(1 + annualRevenueGrowthRate, 1/12) - 1;
    const cogsRatio = latestData.cogs / latestData.revenue;
    const depreciationRatio = latestSummary.depreciation / latestData.revenue;
    const capexRatio = latestSummary.capitalExpenditures / latestData.revenue;
    const dividendRatio = latestSummary.dividendsPaid / latestData.revenue;
    const debtRepaymentMonthly = latestSummary.debtRepayment / 12;
    
    // Working capital ratios in days
    const receivablesDays = 45; // Example: 45 days of sales in receivables
    const inventoryDays = 60; // Example: 60 days of COGS in inventory
    const payablesDays = 30; // Example: 30 days of COGS in payables
    
    // Seasonal factors (optional)
    const seasonality = [1.0, 0.95, 1.05, 1.1, 1.08, 1.12, 1.15, 1.1, 1.05, 1.08, 1.15, 1.2];
    
    // Monthly revenue projection
    // First month is April 2025, starting with 2024 December monthly revenue * growth
    const december2024MonthlyRevenue = latestData.revenue / 12; // Simplified
    let prevMonthRevenue = december2024MonthlyRevenue * (1 + monthlyRevenueGrowthRate) * 3; // Grow for 3 months
    
    // Calculate each month
    for (let i = 0; i < 12; i++) {
      // Apply growth and seasonality
      const currentSeasonality = seasonality[i % 12];
      const prevSeasonality = seasonality[(i - 1) % 12] || 1;
      
      // Revenue
      if (i === 0) {
        newFutureCashFlow.operatingActivities.revenue[i] = prevMonthRevenue * currentSeasonality;
      } else {
        newFutureCashFlow.operatingActivities.revenue[i] = newFutureCashFlow.operatingActivities.revenue[i-1] * 
                                                           (1 + monthlyRevenueGrowthRate) * 
                                                           (currentSeasonality / prevSeasonality);
      }
      
      // Depreciation (steady, based on revenue)
      newFutureCashFlow.operatingActivities.depreciation[i] = newFutureCashFlow.operatingActivities.revenue[i] * depreciationRatio;
      
      // Working capital changes
      // For the first month, compare to assumed Dec 2024 values
      if (i === 0) {
        // Receivables change - increase in receivables is a cash outflow
        newFutureCashFlow.operatingActivities.receivablesChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] / 30 * receivablesDays) - 
          (prevMonthRevenue / 30 * receivablesDays);
        
        // Inventory change - increase in inventory is a cash outflow
        newFutureCashFlow.operatingActivities.inventoryChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] * cogsRatio / 30 * inventoryDays) - 
          (prevMonthRevenue * cogsRatio / 30 * inventoryDays);
        
        // Payables change - increase in payables is a cash inflow
        newFutureCashFlow.operatingActivities.payablesChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] * cogsRatio / 30 * payablesDays) - 
          (prevMonthRevenue * cogsRatio / 30 * payablesDays);
      } else {
        // For subsequent months, compare to previous month
        newFutureCashFlow.operatingActivities.receivablesChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] / 30 * receivablesDays) - 
          (newFutureCashFlow.operatingActivities.revenue[i-1] / 30 * receivablesDays);
        
        newFutureCashFlow.operatingActivities.inventoryChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] * cogsRatio / 30 * inventoryDays) - 
          (newFutureCashFlow.operatingActivities.revenue[i-1] * cogsRatio / 30 * inventoryDays);
        
        newFutureCashFlow.operatingActivities.payablesChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] * cogsRatio / 30 * payablesDays) - 
          (newFutureCashFlow.operatingActivities.revenue[i-1] * cogsRatio / 30 * payablesDays);
      }
      
      // Net operating cash flow
      newFutureCashFlow.operatingActivities.netOperatingCashFlow[i] = 
        newFutureCashFlow.operatingActivities.revenue[i] * (1 - cogsRatio - 0.2) + // Revenue - COGS - SG&A
        newFutureCashFlow.operatingActivities.depreciation[i] -                     // Add back non-cash depreciation
        newFutureCashFlow.operatingActivities.receivablesChange[i] -                // Subtract increase in receivables
        newFutureCashFlow.operatingActivities.inventoryChange[i] +                  // Subtract increase in inventory
        newFutureCashFlow.operatingActivities.payablesChange[i];                    // Add increase in payables
      
      // Capital expenditures (as % of revenue with seasonal pattern)
      const capExSeasonality = [0.5, 0.2, 0.6, 0.3, 0.2, 1.5, 0.4, 0.3, 2.0, 0.2, 0.3, 1.5]; // Lumpy capex
      newFutureCashFlow.investingActivities.capitalExpenditures[i] = 
        newFutureCashFlow.operatingActivities.revenue[i] * capexRatio * capExSeasonality[i % 12];
      
      // Net investing cash flow
      newFutureCashFlow.investingActivities.netInvestingCashFlow[i] = 
        -newFutureCashFlow.investingActivities.capitalExpenditures[i];
      
      // Dividends (quarterly pattern)
      newFutureCashFlow.financingActivities.dividendsPaid[i] = 
        (i % 3 === 0) ? newFutureCashFlow.operatingActivities.revenue[i] * dividendRatio * 3 : 0;
      
      // Debt repayment (monthly)
      newFutureCashFlow.financingActivities.debtRepayment[i] = debtRepaymentMonthly;
      
      // Net financing cash flow
      newFutureCashFlow.financingActivities.netFinancingCashFlow[i] = 
        -newFutureCashFlow.financingActivities.dividendsPaid[i] - 
        newFutureCashFlow.financingActivities.debtRepayment[i];
      
      // Net change in cash
      newFutureCashFlow.cashBalance.netChange[i] = 
        newFutureCashFlow.operatingActivities.netOperatingCashFlow[i] + 
        newFutureCashFlow.investingActivities.netInvestingCashFlow[i] + 
        newFutureCashFlow.financingActivities.netFinancingCashFlow[i];
      
      // Beginning and ending balances
      if (i === 0) {
        // First month (April 2025) starting balance is Dec 2024 ending balance + growth
        newFutureCashFlow.cashBalance.beginningBalance[i] = latestSummary.endingBalance * 1.05;
      } else {
        newFutureCashFlow.cashBalance.beginningBalance[i] = newFutureCashFlow.cashBalance.endingBalance[i-1];
      }
      
      newFutureCashFlow.cashBalance.endingBalance[i] = 
        newFutureCashFlow.cashBalance.beginningBalance[i] + newFutureCashFlow.cashBalance.netChange[i];
    }
    
    setFutureCashFlow(newFutureCashFlow);
  }, [financialData, historicalSummary]);

  // Formatting function
  const formatCurrency = (amount: number) => {
    return isNaN(amount) || !isFinite(amount) 
      ? '-' 
      : '$' + Math.round(amount).toLocaleString();
  };

  // Color coding for positive/negative values
  const getValueColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return '';
  };

  if (!historicalFinancials) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Monthly Cash Flow Forecast</h3>
        <p className="text-neutral-500">Please enter historical financial data first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-800">Monthly Cash Flow Forecast</h2>
      </div>
      
      {/* Cash Flow Summary Card */}
      <Card className="p-5 bg-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Cash Flow Summary (Apr 2025 - Mar 2026)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm text-neutral-500 mb-1">Beginning Cash (Apr 2025)</h4>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(futureCashFlow.cashBalance.beginningBalance[0])}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm text-neutral-500 mb-1">Total Net Cash Flow (12mo)</h4>
            <p className={`text-2xl font-bold ${getValueColor(
              futureCashFlow.cashBalance.netChange.reduce((a, b) => a + b, 0)
            )}`}>
              {formatCurrency(futureCashFlow.cashBalance.netChange.reduce((a, b) => a + b, 0))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm text-neutral-500 mb-1">Ending Cash (Mar 2026)</h4>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(futureCashFlow.cashBalance.endingBalance[11])}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm text-neutral-500 mb-1">Cash Growth</h4>
            <p className={`text-2xl font-bold ${getValueColor(
              futureCashFlow.cashBalance.endingBalance[11] - futureCashFlow.cashBalance.beginningBalance[0]
            )}`}>
              {formatCurrency(futureCashFlow.cashBalance.endingBalance[11] - futureCashFlow.cashBalance.beginningBalance[0])}
              &nbsp;
              {futureCashFlow.cashBalance.beginningBalance[0] > 0 && 
                `(${((futureCashFlow.cashBalance.endingBalance[11] / futureCashFlow.cashBalance.beginningBalance[0] - 1) * 100).toFixed(1)}%)`
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Monthly Cash Flow Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-neutral-200">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Historical Annual Data and 12-Month Forward Projection</TableCaption>
            <TableHeader>
              <TableRow className="bg-neutral-100">
                <TableHead className="w-[220px]">Cash Flow Component</TableHead>
                <TableHead className="bg-blue-50/80">2022</TableHead>
                <TableHead className="bg-blue-50/80">2023</TableHead>
                <TableHead className="bg-blue-50/80">2024</TableHead>
                {FORECAST_MONTHS.map((period, i) => (
                  <TableHead 
                    key={i} 
                    className={i === 0 ? "bg-green-50/80" : (i % 3 === 0 ? "bg-green-50/50" : "")}
                  >
                    {period.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Operating Activities */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={16} className="font-bold text-neutral-700">
                  Cash from operating activities:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Revenue</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2022'].revenue)}</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2023'].revenue)}</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2024'].revenue)}</TableCell>
                {futureCashFlow.operatingActivities.revenue.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Depreciation</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2022'].depreciation)}</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2023'].depreciation)}</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2024'].depreciation)}</TableCell>
                {futureCashFlow.operatingActivities.depreciation.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Receivables Changes</TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2022'].receivablesChange)}`}>
                  {formatCurrency(-historicalSummary['2022'].receivablesChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2023'].receivablesChange)}`}>
                  {formatCurrency(-historicalSummary['2023'].receivablesChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2024'].receivablesChange)}`}>
                  {formatCurrency(-historicalSummary['2024'].receivablesChange)}
                </TableCell>
                {futureCashFlow.operatingActivities.receivablesChange.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")} ${getValueColor(-value)}`}
                  >
                    {formatCurrency(-value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Inventory Changes</TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2022'].inventoryChange)}`}>
                  {formatCurrency(-historicalSummary['2022'].inventoryChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2023'].inventoryChange)}`}>
                  {formatCurrency(-historicalSummary['2023'].inventoryChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2024'].inventoryChange)}`}>
                  {formatCurrency(-historicalSummary['2024'].inventoryChange)}
                </TableCell>
                {futureCashFlow.operatingActivities.inventoryChange.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")} ${getValueColor(-value)}`}
                  >
                    {formatCurrency(-value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Payables Changes</TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(historicalSummary['2022'].payablesChange)}`}>
                  {formatCurrency(historicalSummary['2022'].payablesChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(historicalSummary['2023'].payablesChange)}`}>
                  {formatCurrency(historicalSummary['2023'].payablesChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(historicalSummary['2024'].payablesChange)}`}>
                  {formatCurrency(historicalSummary['2024'].payablesChange)}
                </TableCell>
                {futureCashFlow.operatingActivities.payablesChange.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")} ${getValueColor(value)}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold">Net Cash from Operations</TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2022'].netOperatingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2022'].netOperatingCashFlow)}
                </TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2023'].netOperatingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2023'].netOperatingCashFlow)}
                </TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2024'].netOperatingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2024'].netOperatingCashFlow)}
                </TableCell>
                {futureCashFlow.operatingActivities.netOperatingCashFlow.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/80" : (i % 3 === 0 ? "bg-green-50/50" : "")} ${getValueColor(value)}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Investing Activities */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={16} className="font-bold text-neutral-700">
                  Cash from investing activities:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Capital Expenditures</TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2022'].capitalExpenditures)}`}>
                  {formatCurrency(-historicalSummary['2022'].capitalExpenditures)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2023'].capitalExpenditures)}`}>
                  {formatCurrency(-historicalSummary['2023'].capitalExpenditures)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2024'].capitalExpenditures)}`}>
                  {formatCurrency(-historicalSummary['2024'].capitalExpenditures)}
                </TableCell>
                {futureCashFlow.investingActivities.capitalExpenditures.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")} ${getValueColor(-value)}`}
                  >
                    {formatCurrency(-value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold">Net Cash from Investing</TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2022'].netInvestingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2022'].netInvestingCashFlow)}
                </TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2023'].netInvestingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2023'].netInvestingCashFlow)}
                </TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2024'].netInvestingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2024'].netInvestingCashFlow)}
                </TableCell>
                {futureCashFlow.investingActivities.netInvestingCashFlow.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/80" : (i % 3 === 0 ? "bg-green-50/50" : "")} ${getValueColor(value)}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Financing Activities */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={16} className="font-bold text-neutral-700">
                  Cash from financing activities:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividends Paid</TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2022'].dividendsPaid)}`}>
                  {formatCurrency(-historicalSummary['2022'].dividendsPaid)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2023'].dividendsPaid)}`}>
                  {formatCurrency(-historicalSummary['2023'].dividendsPaid)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2024'].dividendsPaid)}`}>
                  {formatCurrency(-historicalSummary['2024'].dividendsPaid)}
                </TableCell>
                {futureCashFlow.financingActivities.dividendsPaid.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")} ${getValueColor(-value)}`}
                  >
                    {formatCurrency(-value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Debt Repayment</TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2022'].debtRepayment)}`}>
                  {formatCurrency(-historicalSummary['2022'].debtRepayment)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2023'].debtRepayment)}`}>
                  {formatCurrency(-historicalSummary['2023'].debtRepayment)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 ${getValueColor(-historicalSummary['2024'].debtRepayment)}`}>
                  {formatCurrency(-historicalSummary['2024'].debtRepayment)}
                </TableCell>
                {futureCashFlow.financingActivities.debtRepayment.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")} ${getValueColor(-value)}`}
                  >
                    {formatCurrency(-value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold">Net Cash from Financing</TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2022'].netFinancingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2022'].netFinancingCashFlow)}
                </TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2023'].netFinancingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2023'].netFinancingCashFlow)}
                </TableCell>
                <TableCell className={`font-bold ${getValueColor(historicalSummary['2024'].netFinancingCashFlow)}`}>
                  {formatCurrency(historicalSummary['2024'].netFinancingCashFlow)}
                </TableCell>
                {futureCashFlow.financingActivities.netFinancingCashFlow.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/80" : (i % 3 === 0 ? "bg-green-50/50" : "")} ${getValueColor(value)}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>

              {/* Cash Balance Section */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={16} className="font-bold text-neutral-700">
                  Cash Balance:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net Change in Cash</TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold ${getValueColor(historicalSummary['2022'].netChange)}`}>
                  {formatCurrency(historicalSummary['2022'].netChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold ${getValueColor(historicalSummary['2023'].netChange)}`}>
                  {formatCurrency(historicalSummary['2023'].netChange)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold ${getValueColor(historicalSummary['2024'].netChange)}`}>
                  {formatCurrency(historicalSummary['2024'].netChange)}
                </TableCell>
                {futureCashFlow.cashBalance.netChange.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/80" : (i % 3 === 0 ? "bg-green-50/50" : "")} ${getValueColor(value)}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Beginning Balance</TableCell>
                <TableCell className="bg-blue-50/30 font-semibold">
                  {formatCurrency(historicalSummary['2022'].beginningBalance)}
                </TableCell>
                <TableCell className="bg-blue-50/30 font-semibold">
                  {formatCurrency(historicalSummary['2023'].beginningBalance)}
                </TableCell>
                <TableCell className="bg-blue-50/30 font-semibold">
                  {formatCurrency(historicalSummary['2024'].beginningBalance)}
                </TableCell>
                {futureCashFlow.cashBalance.beginningBalance.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow className="bg-green-50">
                <TableCell className="font-bold">Ending Cash Balance</TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(historicalSummary['2022'].endingBalance)}
                </TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(historicalSummary['2023'].endingBalance)}
                </TableCell>
                <TableCell className="font-bold">
                  {formatCurrency(historicalSummary['2024'].endingBalance)}
                </TableCell>
                {futureCashFlow.cashBalance.endingBalance.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-bold ${i === 0 ? "bg-green-50/80" : (i % 3 === 0 ? "bg-green-50/60" : "")}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Methodology Card */}
      <Card className="p-5 bg-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Forecast Methodology</h3>
        <div className="space-y-3 text-sm">
          <p><strong>Historical Annual Figures:</strong> The first 3 columns show annual totals for 2022, 2023, and 2024.</p>
          <p><strong>Forward Projection:</strong> Shows 12 months forecast from April 2025 through March 2026.</p>
          <p><strong>Revenue Growth:</strong> Calculated at 8% annual growth rate (approximately 0.64% monthly compound growth).</p>
          <p><strong>Working Capital:</strong> Based on days outstanding metrics - receivables (45 days), inventory (60 days), and payables (30 days).</p>
          <p><strong>Investment Schedule:</strong> Capital expenditures are distributed with seasonal patterns to reflect typical investment cycles.</p>
          <p><strong>Financing:</strong> Includes quarterly dividend payments and monthly debt repayments based on historical patterns.</p>
          <p className="text-xs text-neutral-500 italic mt-2">Note: This forecast model projects from the latest historical data (2024). The cash flow patterns can be adjusted to match your specific business seasonality and operational cycles.</p>
        </div>
      </Card>
    </div>
  );
}