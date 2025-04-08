import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { FinancialYear, ProjectionParams } from '@/lib/types';
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
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';
const MONTHS: Month[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Default projection parameters if we can't get them from FinancialProjections
const DEFAULT_PROJECTION_PARAMS: ProjectionParams = {
  revenueGrowth: 10,
  grossMargin: 65,
  sgaPercent: 25,
  rdPercent: 10,
  capexPercent: 8,
  taxRate: 25,
  wcPercent: 15
};

// Generate the next 12 months from April 2025
const FORECAST_MONTHS = [...Array(12)].map((_, i) => {
  const futureDate = new Date(2025, 3 + i, 1); // Start from April 2025
  const monthIndex = futureDate.getMonth();
  const year = futureDate.getFullYear();
  return {
    month: MONTHS[monthIndex],
    year: year,
    label: `${MONTHS[monthIndex]}${year !== 2025 ? ' ' + year : ''}`
  };
});

// Interfaces for data structures
interface MonthlyCashFlowData {
  operatingActivities: {
    revenue: number[];
    cogs: number[];
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
  metrics: {
    freeCashFlow: number[];
    debtCoverageRatio: number[];
    cashToDebtRatio: number[];
  };
}

interface AnnualCashFlowSummary {
  revenue: number;
  cogs: number;
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
  metrics: {
    freeCashFlow: number;
    debtCoverageRatio: number;
    cashToDebtRatio: number;
  };
}

export default function MonthlyCashFlow() {
  const { historicalFinancials } = useUser();
  const [historicalSummary, setHistoricalSummary] = useState<Record<FinancialYear, AnnualCashFlowSummary>>({
    '2022': createEmptyAnnualSummary(),
    '2023': createEmptyAnnualSummary(),
    '2024': createEmptyAnnualSummary(),
  });
  const [futureCashFlow, setFutureCashFlow] = useState<MonthlyCashFlowData>(createEmptyMonthlyCashFlowData());
  const [projectionParams, setProjectionParams] = useState<ProjectionParams>(DEFAULT_PROJECTION_PARAMS);

  // Create empty data structures
  function createEmptyMonthlyCashFlowData(): MonthlyCashFlowData {
    const emptyMonthArray = Array(12).fill(0);
    return {
      operatingActivities: {
        revenue: [...emptyMonthArray],
        cogs: [...emptyMonthArray],
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
      },
      metrics: {
        freeCashFlow: [...emptyMonthArray],
        debtCoverageRatio: [...emptyMonthArray],
        cashToDebtRatio: [...emptyMonthArray]
      }
    };
  }

  function createEmptyAnnualSummary(): AnnualCashFlowSummary {
    return {
      revenue: 0,
      cogs: 0,
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
      endingBalance: 0,
      metrics: {
        freeCashFlow: 0,
        debtCoverageRatio: 0,
        cashToDebtRatio: 0
      }
    };
  }

  // Set projection parameters - could be used from a UI control or from FinancialProjections
  useEffect(() => {
    // If you had access to the FinancialProjections params, you would use them here
    setProjectionParams(DEFAULT_PROJECTION_PARAMS);
  }, []);

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
      
      // Advanced metrics
      const freeCashFlow = annualOperatingCashFlow - annualCapEx;
      const debtCoverageRatio = totalDebt > 0 ? annualOperatingCashFlow / annualDebtRepayment : 0;
      const cashToDebtRatio = totalDebt > 0 ? endingBalance / totalDebt : 0;
      
      // Set the annual summary
      newHistoricalSummary[year] = {
        revenue: data.revenue,
        cogs: data.cogs,
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
        endingBalance: endingBalance,
        metrics: {
          freeCashFlow,
          debtCoverageRatio,
          cashToDebtRatio
        }
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
    
    // Monthly growth rates derived from annual rates in projection parameters
    const monthlyRevenueGrowthRate = Math.pow(1 + projectionParams.revenueGrowth / 100, 1/12) - 1;
    
    // Important ratios from historical data
    const cogsRatio = 1 - (projectionParams.grossMargin / 100); // COGS as percentage of revenue
    const opExRatio = (projectionParams.sgaPercent + projectionParams.rdPercent) / 100; // Operating expenses ratio
    
    // Starting with last month of 2024 (divide annual figures by 12)
    const monthlyRevenue2024 = latestData.revenue / 12;
    const monthlyCogs2024 = latestData.cogs / 12;
    const monthlyDepreciation2024 = latestSummary.depreciation / 12;
    const monthlyCapEx2024 = latestSummary.capitalExpenditures / 12;
    const monthlyDebtRepayment2024 = latestSummary.debtRepayment / 12;
    const monthlyDividends2024 = latestSummary.dividendsPaid / 12;
    
    // Working capital assumptions (as days of sales/COGS)
    const receivablesDays = 45;
    const inventoryDays = 60;
    const payablesDays = 30;
    
    // Seasonal factors (optional)
    const seasonality = [1.0, 0.95, 1.05, 1.1, 1.08, 1.12, 1.15, 1.1, 1.05, 1.08, 1.15, 1.2];
    
    // Initialize prev month values
    let prevMonthRevenue = monthlyRevenue2024 * (1 + monthlyRevenueGrowthRate) * 3; // Grow for Jan-Mar 2025
    let prevMonthCogs = monthlyCogs2024 * (1 + monthlyRevenueGrowthRate) * 3;
    let totalDebt = latestData.shortTermDebt + latestData.longTermDebt;
    
    // Calculate each month (April 2025 through March 2026)
    for (let i = 0; i < 12; i++) {
      // Apply growth and seasonality for current month
      const currentSeasonality = seasonality[i % 12];
      const prevSeasonality = seasonality[(i - 1) % 12] || 1;
      
      // Revenue
      if (i === 0) {
        newFutureCashFlow.operatingActivities.revenue[i] = prevMonthRevenue * currentSeasonality;
      } else {
        newFutureCashFlow.operatingActivities.revenue[i] = 
          newFutureCashFlow.operatingActivities.revenue[i-1] * 
          (1 + monthlyRevenueGrowthRate) * 
          (currentSeasonality / prevSeasonality);
      }
      
      // COGS
      newFutureCashFlow.operatingActivities.cogs[i] = 
        newFutureCashFlow.operatingActivities.revenue[i] * cogsRatio;
      
      // Depreciation (steady monthly amount based on fixed assets)
      newFutureCashFlow.operatingActivities.depreciation[i] = monthlyDepreciation2024 * 
        (1 + (i * monthlyRevenueGrowthRate / 2)); // Grows slightly as assets grow
      
      // Working capital changes (monthly changes based on revenue changes)
      // For the first month, compare to assumed Dec 2024 values
      if (i === 0) {
        // Receivables change - increase in receivables is a cash outflow
        newFutureCashFlow.operatingActivities.receivablesChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] / 30 * receivablesDays) - 
          (prevMonthRevenue / 30 * receivablesDays);
        
        // Inventory change - increase in inventory is a cash outflow
        newFutureCashFlow.operatingActivities.inventoryChange[i] = 
          (newFutureCashFlow.operatingActivities.cogs[i] / 30 * inventoryDays) - 
          (prevMonthCogs / 30 * inventoryDays);
        
        // Payables change - increase in payables is a cash inflow
        newFutureCashFlow.operatingActivities.payablesChange[i] = 
          (newFutureCashFlow.operatingActivities.cogs[i] / 30 * payablesDays) - 
          (prevMonthCogs / 30 * payablesDays);
      } else {
        // For subsequent months, compare to previous month
        newFutureCashFlow.operatingActivities.receivablesChange[i] = 
          (newFutureCashFlow.operatingActivities.revenue[i] / 30 * receivablesDays) - 
          (newFutureCashFlow.operatingActivities.revenue[i-1] / 30 * receivablesDays);
        
        newFutureCashFlow.operatingActivities.inventoryChange[i] = 
          (newFutureCashFlow.operatingActivities.cogs[i] / 30 * inventoryDays) - 
          (newFutureCashFlow.operatingActivities.cogs[i-1] / 30 * inventoryDays);
        
        newFutureCashFlow.operatingActivities.payablesChange[i] = 
          (newFutureCashFlow.operatingActivities.cogs[i] / 30 * payablesDays) - 
          (newFutureCashFlow.operatingActivities.cogs[i-1] / 30 * payablesDays);
      }
      
      // Net operating cash flow
      newFutureCashFlow.operatingActivities.netOperatingCashFlow[i] = 
        newFutureCashFlow.operatingActivities.revenue[i] - 
        newFutureCashFlow.operatingActivities.cogs[i] - 
        (newFutureCashFlow.operatingActivities.revenue[i] * opExRatio) + // SG&A and R&D
        newFutureCashFlow.operatingActivities.depreciation[i] -           // Add back non-cash depreciation
        newFutureCashFlow.operatingActivities.receivablesChange[i] -      // Subtract increase in receivables
        newFutureCashFlow.operatingActivities.inventoryChange[i] +        // Subtract increase in inventory
        newFutureCashFlow.operatingActivities.payablesChange[i];          // Add increase in payables
      
      // Capital expenditures (monthly with seasonality)
      const capExSeasonality = [0.5, 0.2, 0.6, 0.3, 0.2, 1.5, 0.4, 0.3, 2.0, 0.2, 0.3, 1.5]; // Lumpy capex
      newFutureCashFlow.investingActivities.capitalExpenditures[i] = 
        (newFutureCashFlow.operatingActivities.revenue[i] * (projectionParams.capexPercent / 100)) * 
        capExSeasonality[i % 12] / 
        (capExSeasonality.reduce((a, b) => a + b, 0) / 12); // Normalize seasonality
      
      // Net investing cash flow
      newFutureCashFlow.investingActivities.netInvestingCashFlow[i] = 
        -newFutureCashFlow.investingActivities.capitalExpenditures[i];
      
      // Dividends (quarterly pattern)
      newFutureCashFlow.financingActivities.dividendsPaid[i] = 
        ((i + 1) % 3 === 0) ? (newFutureCashFlow.operatingActivities.revenue[i] * 0.02) * 3 : 0;
      
      // Debt repayment (monthly)
      newFutureCashFlow.financingActivities.debtRepayment[i] = monthlyDebtRepayment2024 * 
        (1 + (i * monthlyRevenueGrowthRate / 4)); // Gradually increases
      
      // Update total debt (decreased by repayments)
      totalDebt -= newFutureCashFlow.financingActivities.debtRepayment[i];
      
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
        // First month starting balance is Dec 2024 ending balance
        newFutureCashFlow.cashBalance.beginningBalance[i] = latestSummary.endingBalance;
      } else {
        newFutureCashFlow.cashBalance.beginningBalance[i] = newFutureCashFlow.cashBalance.endingBalance[i-1];
      }
      
      newFutureCashFlow.cashBalance.endingBalance[i] = 
        newFutureCashFlow.cashBalance.beginningBalance[i] + 
        newFutureCashFlow.cashBalance.netChange[i];
      
      // Calculate metrics
      newFutureCashFlow.metrics.freeCashFlow[i] = 
        newFutureCashFlow.operatingActivities.netOperatingCashFlow[i] - 
        newFutureCashFlow.investingActivities.capitalExpenditures[i];
      
      // Debt coverage ratio (operating cash flow / debt repayment)
      newFutureCashFlow.metrics.debtCoverageRatio[i] = 
        newFutureCashFlow.financingActivities.debtRepayment[i] > 0 
          ? newFutureCashFlow.operatingActivities.netOperatingCashFlow[i] / 
            newFutureCashFlow.financingActivities.debtRepayment[i] 
          : 0;
      
      // Cash to debt ratio
      newFutureCashFlow.metrics.cashToDebtRatio[i] = 
        totalDebt > 0 
          ? newFutureCashFlow.cashBalance.endingBalance[i] / totalDebt 
          : 0;
      
      // Update previous month values for next iteration
      prevMonthRevenue = newFutureCashFlow.operatingActivities.revenue[i];
      prevMonthCogs = newFutureCashFlow.operatingActivities.cogs[i];
    }
    
    setFutureCashFlow(newFutureCashFlow);
  }, [financialData, historicalSummary, projectionParams]);
  
  // Chart data preparation
  const cashFlowChartData = useMemo(() => {
    return {
      labels: FORECAST_MONTHS.map(m => m.label),
      datasets: [
        {
          label: 'Operating Cash Flow',
          data: futureCashFlow.operatingActivities.netOperatingCashFlow,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Investing Cash Flow',
          data: futureCashFlow.investingActivities.netInvestingCashFlow,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Financing Cash Flow',
          data: futureCashFlow.financingActivities.netFinancingCashFlow,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1
        },
        {
          label: 'Net Change in Cash',
          data: futureCashFlow.cashBalance.netChange,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          borderWidth: 3,
          fill: false,
          tension: 0.1
        }
      ]
    };
  }, [futureCashFlow]);
  
  const cashBalanceChartData = useMemo(() => {
    return {
      labels: FORECAST_MONTHS.map(m => m.label),
      datasets: [
        {
          label: 'Ending Cash Balance',
          data: futureCashFlow.cashBalance.endingBalance,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.1
        }
      ]
    };
  }, [futureCashFlow]);
  
  const metricsChartData = useMemo(() => {
    return {
      labels: FORECAST_MONTHS.map(m => m.label),
      datasets: [
        {
          label: 'Free Cash Flow',
          data: futureCashFlow.metrics.freeCashFlow,
          borderColor: 'rgb(46, 204, 113)',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: 'Debt Coverage Ratio',
          data: futureCashFlow.metrics.debtCoverageRatio,
          borderColor: 'rgb(155, 89, 182)',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    };
  }, [futureCashFlow]);

  // Formatting function
  const formatCurrency = (amount: number) => {
    return isNaN(amount) || !isFinite(amount) 
      ? '-' 
      : '$' + Math.round(amount).toLocaleString();
  };
  
  // Format ratio with 2 decimal places
  const formatRatio = (value: number) => {
    return isNaN(value) || !isFinite(value)
      ? '-'
      : value.toFixed(2) + 'x';
  };

  // Format percentage
  const formatPercent = (value: number) => {
    return isNaN(value) || !isFinite(value)
      ? '-'
      : (value * 100).toFixed(1) + '%';
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
            <h4 className="text-sm text-neutral-500 mb-1">Avg. Free Cash Flow</h4>
            <p className={`text-2xl font-bold ${getValueColor(
              futureCashFlow.metrics.freeCashFlow.reduce((a, b) => a + b, 0) / 12
            )}`}>
              {formatCurrency(futureCashFlow.metrics.freeCashFlow.reduce((a, b) => a + b, 0) / 12)}
              <span className="text-sm font-normal text-neutral-500 ml-1">/ month</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Cash Flow Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Cash Flows</h3>
          <div className="h-80">
            <Line
              data={cashFlowChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Amount ($)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.dataset.label + ': ' + formatCurrency(context.raw as number);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Cash Balance Projection</h3>
          <div className="h-80">
            <Line
              data={cashBalanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Amount ($)'
                    },
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.dataset.label + ': ' + formatCurrency(context.raw as number);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Key Financial Metrics</h3>
          <div className="h-80">
            <Line
              data={metricsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false
                    }
                  },
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Free Cash Flow ($)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Debt Coverage Ratio (x)'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        if (context.dataset.label === 'Free Cash Flow') {
                          return context.dataset.label + ': ' + formatCurrency(context.raw as number);
                        } else {
                          return context.dataset.label + ': ' + formatRatio(context.raw as number);
                        }
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      </div>

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
                <TableCell className="font-medium">COGS</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2022'].cogs)}</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2023'].cogs)}</TableCell>
                <TableCell className="bg-blue-50/30">{formatCurrency(historicalSummary['2024'].cogs)}</TableCell>
                {futureCashFlow.operatingActivities.cogs.map((value, i) => (
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
              
              {/* Financial Metrics Section */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={16} className="font-bold text-neutral-700">
                  Financial Metrics:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Free Cash Flow</TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold ${getValueColor(historicalSummary['2022'].metrics.freeCashFlow)}`}>
                  {formatCurrency(historicalSummary['2022'].metrics.freeCashFlow)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold ${getValueColor(historicalSummary['2023'].metrics.freeCashFlow)}`}>
                  {formatCurrency(historicalSummary['2023'].metrics.freeCashFlow)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold ${getValueColor(historicalSummary['2024'].metrics.freeCashFlow)}`}>
                  {formatCurrency(historicalSummary['2024'].metrics.freeCashFlow)}
                </TableCell>
                {futureCashFlow.metrics.freeCashFlow.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")} ${getValueColor(value)}`}
                  >
                    {formatCurrency(value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Debt Coverage Ratio</TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold`}>
                  {formatRatio(historicalSummary['2022'].metrics.debtCoverageRatio)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold`}>
                  {formatRatio(historicalSummary['2023'].metrics.debtCoverageRatio)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold`}>
                  {formatRatio(historicalSummary['2024'].metrics.debtCoverageRatio)}
                </TableCell>
                {futureCashFlow.metrics.debtCoverageRatio.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")}`}
                  >
                    {formatRatio(value)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cash to Debt Ratio</TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold`}>
                  {formatRatio(historicalSummary['2022'].metrics.cashToDebtRatio)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold`}>
                  {formatRatio(historicalSummary['2023'].metrics.cashToDebtRatio)}
                </TableCell>
                <TableCell className={`bg-blue-50/30 font-semibold`}>
                  {formatRatio(historicalSummary['2024'].metrics.cashToDebtRatio)}
                </TableCell>
                {futureCashFlow.metrics.cashToDebtRatio.map((value, i) => (
                  <TableCell 
                    key={i} 
                    className={`font-semibold ${i === 0 ? "bg-green-50/30" : (i % 3 === 0 ? "bg-green-50/20" : "")}`}
                  >
                    {formatRatio(value)}
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
          <p><strong>Historical Annual Figures:</strong> First 3 columns show annual totals for 2022, 2023, and 2024.</p>
          <p><strong>Monthly Distribution:</strong> Annual figures have been divided by 12 and adjusted for seasonality to create monthly projections.</p>
          <p><strong>Forward Projections:</strong> Calculated with growth rates from the financial projections parameters.</p>
          <p><strong>Working Capital:</strong> Based on receivable days (45), inventory days (60), and payable days (30) industry standards.</p>
          <p><strong>Key Metrics:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Free Cash Flow:</strong> Operating cash flow minus capital expenditures</li>
            <li><strong>Debt Coverage Ratio:</strong> Operating cash flow divided by debt repayment amount</li>
            <li><strong>Cash to Debt Ratio:</strong> Ending cash balance divided by total debt</li>
          </ul>
          <p className="text-xs text-neutral-500 italic mt-2">Note: The forecast reflects monthly splits of annual data with seasonality applied. Monthly patterns can be further refined based on specific business cycles.</p>
        </div>
      </Card>
    </div>
  );
}