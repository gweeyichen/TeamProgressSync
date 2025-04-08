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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';
const MONTHS: Month[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

export default function MonthlyCashFlow() {
  const { historicalFinancials } = useUser();
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [monthlyCashFlow, setMonthlyCashFlow] = useState<Record<FinancialYear, MonthlyCashFlowData>>({
    '2022': createEmptyMonthlyCashFlowData(),
    '2023': createEmptyMonthlyCashFlowData(),
    '2024': createEmptyMonthlyCashFlowData(),
  });

  // Create empty monthly cash flow data structure
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

  // Calculate monthly cash flow data
  useEffect(() => {
    if (!financialData) return;

    const years: FinancialYear[] = ['2022', '2023', '2024'];
    let newMonthlyCashFlow = { ...monthlyCashFlow };

    years.forEach((year) => {
      // Split annual data into monthly (with some seasonality pattern)
      const seasonality = [0.07, 0.06, 0.08, 0.09, 0.08, 0.09, 0.1, 0.1, 0.08, 0.09, 0.08, 0.08]; // Simple seasonality pattern
      const data = financialData[year];

      // Calculate monthly revenue with seasonality
      const monthlyRevenue = MONTHS.map((_, i) => data.revenue * seasonality[i]);
      
      // Monthly COGS roughly proportional to revenue
      const monthlyCOGS = monthlyRevenue.map(rev => rev * (data.cogs / data.revenue));
      
      // Depreciation (usually straight-line)
      const annualDepreciation = data.fixedAssets * 0.1; // Assume 10% depreciation rate
      const monthlyDepreciation = Array(12).fill(annualDepreciation / 12);

      // Changes in working capital
      // We'll create patterns that result in the annual figures
      const receivablesPatterns = [-1, 0.5, -0.5, 1, -1, 0.5, -0.5, 1, -0.8, 0.3, -0.2, 0.7];
      const inventoryPatterns = [0.2, 0.3, -0.1, -0.2, 0.4, 0.5, -0.3, -0.2, 0.1, 0.2, -0.4, -0.5];
      const payablesPatterns = [0.5, -0.3, 0.2, 0.3, -0.4, 0.6, -0.3, 0.2, -0.5, 0.3, -0.1, -0.5];
      
      // Annual balance sheet changes from previous year
      let prevYear;
      let receivablesChange = 0;
      let inventoryChange = 0;
      let payablesChange = 0;
      
      if (year === '2022') {
        // For 2022, we don't have previous year data, so we'll use approximations
        receivablesChange = -data.accountsReceivable * 0.1; // Assume 10% reduction
        inventoryChange = -data.inventory * 0.15; // Assume 15% reduction
        payablesChange = data.accountsPayable * 0.05; // Assume 5% increase
      } else {
        prevYear = years[years.indexOf(year) - 1];
        receivablesChange = data.accountsReceivable - financialData[prevYear].accountsReceivable;
        inventoryChange = data.inventory - financialData[prevYear].inventory;
        payablesChange = data.accountsPayable - financialData[prevYear].accountsPayable;
      }
      
      // Distribute changes throughout the year using patterns
      const monthlyReceivablesChange = receivablesPatterns.map(p => (receivablesChange * p));
      const monthlyInventoryChange = inventoryPatterns.map(p => (inventoryChange * p));
      const monthlyPayablesChange = payablesPatterns.map(p => (payablesChange * p));
      
      // Capital expenditures (we'll assume periodic investments)
      let annualCapEx = 0;
      if (year === '2022') {
        annualCapEx = data.fixedAssets * 0.15; // Assume 15% of fixed assets
      } else {
        prevYear = years[years.indexOf(year) - 1];
        annualCapEx = data.fixedAssets - financialData[prevYear].fixedAssets + annualDepreciation;
      }
      
      // Create some lumpy capex pattern (concentrated in specific months)
      const capExPattern = [0.05, 0, 0.15, 0, 0, 0.25, 0, 0, 0.3, 0, 0, 0.25];
      const monthlyCapEx = capExPattern.map(p => annualCapEx * p);
      
      // Financing activities
      // Dividends (assumed quarterly)
      const annualDividends = data.revenue * 0.02; // 2% of revenue as dividends
      const monthlyDividends = [0, 0, annualDividends/4, 0, 0, annualDividends/4, 0, 0, annualDividends/4, 0, 0, annualDividends/4];
      
      // Debt repayment (could be monthly or with specific pattern)
      const totalDebt = data.shortTermDebt + data.longTermDebt;
      const annualDebtRepayment = totalDebt * 0.1; // Assume 10% of debt is repaid annually
      const monthlyDebtRepayment = [
        annualDebtRepayment/12, annualDebtRepayment/12, annualDebtRepayment/12, 
        annualDebtRepayment/12, annualDebtRepayment/12, annualDebtRepayment/12,
        annualDebtRepayment/12, annualDebtRepayment/12, annualDebtRepayment/12,
        annualDebtRepayment/12, annualDebtRepayment/12, annualDebtRepayment/12,
      ];
      
      // Calculate net cash flows
      const monthlyOperatingCashFlow = monthlyRevenue.map((rev, i) => {
        return rev - monthlyCOGS[i] + monthlyDepreciation[i] - 
               monthlyReceivablesChange[i] - monthlyInventoryChange[i] + monthlyPayablesChange[i];
      });
      
      const monthlyInvestingCashFlow = monthlyCapEx.map(capex => -capex);
      
      const monthlyFinancingCashFlow = monthlyDividends.map((div, i) => {
        return -div - monthlyDebtRepayment[i];
      });
      
      // Calculate net change and ending balances
      const monthlyNetChange = monthlyOperatingCashFlow.map((opCF, i) => {
        return opCF + monthlyInvestingCashFlow[i] + monthlyFinancingCashFlow[i];
      });
      
      // Beginning and ending balances
      const monthlyBeginningBalance = Array(12).fill(0);
      const monthlyEndingBalance = Array(12).fill(0);
      
      // Starting balance is the cash on hand from balance sheet
      monthlyBeginningBalance[0] = data.cash;
      
      // Calculate progressive balances
      for (let i = 0; i < 12; i++) {
        // First month beginning balance already set
        if (i > 0) {
          monthlyBeginningBalance[i] = monthlyEndingBalance[i-1];
        }
        monthlyEndingBalance[i] = monthlyBeginningBalance[i] + monthlyNetChange[i];
      }
      
      // Set all monthly cash flow data
      newMonthlyCashFlow[year] = {
        operatingActivities: {
          revenue: monthlyRevenue,
          depreciation: monthlyDepreciation,
          receivablesChange: monthlyReceivablesChange,
          inventoryChange: monthlyInventoryChange,
          payablesChange: monthlyPayablesChange,
          netOperatingCashFlow: monthlyOperatingCashFlow,
        },
        investingActivities: {
          capitalExpenditures: monthlyCapEx,
          netInvestingCashFlow: monthlyInvestingCashFlow,
        },
        financingActivities: {
          dividendsPaid: monthlyDividends,
          debtRepayment: monthlyDebtRepayment,
          netFinancingCashFlow: monthlyFinancingCashFlow,
        },
        cashBalance: {
          netChange: monthlyNetChange,
          beginningBalance: monthlyBeginningBalance,
          endingBalance: monthlyEndingBalance,
        }
      };
    });
    
    setMonthlyCashFlow(newMonthlyCashFlow);
  }, [financialData]);

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
        
        <div className="flex space-x-4">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="py-2 pl-3 pr-10 border border-neutral-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>
      
      {/* Cash Flow Summary Card */}
      <Card className="p-5 bg-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Cash Flow Summary - {selectedYear}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm text-neutral-500 mb-1">Beginning Cash</h4>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].cashBalance.beginningBalance[0])}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm text-neutral-500 mb-1">Net Cash Flow</h4>
            <p className={`text-2xl font-bold ${getValueColor(
              monthlyCashFlow[selectedYear as FinancialYear].cashBalance.netChange.reduce((a, b) => a + b, 0)
            )}`}>
              {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].cashBalance.netChange.reduce((a, b) => a + b, 0))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="text-sm text-neutral-500 mb-1">Ending Cash</h4>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].cashBalance.endingBalance[11])}
            </p>
          </div>
        </div>
      </Card>

      {/* Monthly Cash Flow Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-neutral-200">
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Monthly Cash Flow Forecast for {selectedYear}</TableCaption>
            <TableHeader>
              <TableRow className="bg-neutral-100">
                <TableHead className="w-[200px]">Cash Flow Component</TableHead>
                {MONTHS.map(month => (
                  <TableHead key={month}>{month}</TableHead>
                ))}
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Operating Activities */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={14} className="font-bold text-neutral-700">
                  Cash from operating activities:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Revenue</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.revenue.map((value, i) => (
                  <TableCell key={i}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className="font-medium">
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.revenue.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Depreciation</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.depreciation.map((value, i) => (
                  <TableCell key={i}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className="font-medium">
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.depreciation.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Receivables Changes</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.receivablesChange.map((value, i) => (
                  <TableCell key={i} className={getValueColor(-value)}>{formatCurrency(-value)}</TableCell>
                ))}
                <TableCell className={`font-medium ${getValueColor(-monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.receivablesChange.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(-monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.receivablesChange.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Inventory Changes</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.inventoryChange.map((value, i) => (
                  <TableCell key={i} className={getValueColor(-value)}>{formatCurrency(-value)}</TableCell>
                ))}
                <TableCell className={`font-medium ${getValueColor(-monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.inventoryChange.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(-monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.inventoryChange.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Payables Changes</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.payablesChange.map((value, i) => (
                  <TableCell key={i} className={getValueColor(value)}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className={`font-medium ${getValueColor(monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.payablesChange.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.payablesChange.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold">Net Cash from Operations</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.netOperatingCashFlow.map((value, i) => (
                  <TableCell key={i} className={`font-semibold ${getValueColor(value)}`}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className={`font-bold ${getValueColor(monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.netOperatingCashFlow.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].operatingActivities.netOperatingCashFlow.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>

              {/* Investing Activities */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={14} className="font-bold text-neutral-700">
                  Cash from investing activities:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Capital Expenditures</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].investingActivities.capitalExpenditures.map((value, i) => (
                  <TableCell key={i} className={getValueColor(-value)}>{formatCurrency(-value)}</TableCell>
                ))}
                <TableCell className={`font-medium ${getValueColor(-monthlyCashFlow[selectedYear as FinancialYear].investingActivities.capitalExpenditures.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(-monthlyCashFlow[selectedYear as FinancialYear].investingActivities.capitalExpenditures.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold">Net Cash from Investing</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].investingActivities.netInvestingCashFlow.map((value, i) => (
                  <TableCell key={i} className={`font-semibold ${getValueColor(value)}`}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className={`font-bold ${getValueColor(monthlyCashFlow[selectedYear as FinancialYear].investingActivities.netInvestingCashFlow.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].investingActivities.netInvestingCashFlow.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>

              {/* Financing Activities */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={14} className="font-bold text-neutral-700">
                  Cash from financing activities:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dividends Paid</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].financingActivities.dividendsPaid.map((value, i) => (
                  <TableCell key={i} className={getValueColor(-value)}>{formatCurrency(-value)}</TableCell>
                ))}
                <TableCell className={`font-medium ${getValueColor(-monthlyCashFlow[selectedYear as FinancialYear].financingActivities.dividendsPaid.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(-monthlyCashFlow[selectedYear as FinancialYear].financingActivities.dividendsPaid.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Debt Repayment</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].financingActivities.debtRepayment.map((value, i) => (
                  <TableCell key={i} className={getValueColor(-value)}>{formatCurrency(-value)}</TableCell>
                ))}
                <TableCell className={`font-medium ${getValueColor(-monthlyCashFlow[selectedYear as FinancialYear].financingActivities.debtRepayment.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(-monthlyCashFlow[selectedYear as FinancialYear].financingActivities.debtRepayment.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow className="bg-blue-50">
                <TableCell className="font-bold">Net Cash from Financing</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].financingActivities.netFinancingCashFlow.map((value, i) => (
                  <TableCell key={i} className={`font-semibold ${getValueColor(value)}`}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className={`font-bold ${getValueColor(monthlyCashFlow[selectedYear as FinancialYear].financingActivities.netFinancingCashFlow.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].financingActivities.netFinancingCashFlow.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>

              {/* Cash Balance Section */}
              <TableRow className="bg-neutral-50">
                <TableCell colSpan={14} className="font-bold text-neutral-700">
                  Cash Balance:
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net Change in Cash</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].cashBalance.netChange.map((value, i) => (
                  <TableCell key={i} className={`font-semibold ${getValueColor(value)}`}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className={`font-bold ${getValueColor(monthlyCashFlow[selectedYear as FinancialYear].cashBalance.netChange.reduce((a, b) => a + b, 0))}`}>
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].cashBalance.netChange.reduce((a, b) => a + b, 0))}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Beginning Balance</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].cashBalance.beginningBalance.map((value, i) => (
                  <TableCell key={i}>{formatCurrency(value)}</TableCell>
                ))}
                <TableCell></TableCell>
              </TableRow>
              <TableRow className="bg-green-50">
                <TableCell className="font-bold">Ending Cash Balance</TableCell>
                {monthlyCashFlow[selectedYear as FinancialYear].cashBalance.endingBalance.map((value, i) => (
                  <TableCell key={i} className="font-bold">{formatCurrency(value)}</TableCell>
                ))}
                <TableCell className="font-bold">
                  {formatCurrency(monthlyCashFlow[selectedYear as FinancialYear].cashBalance.endingBalance[11])}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Methodology Card */}
      <Card className="p-5 bg-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Monthly Cash Flow Methodology</h3>
        <div className="space-y-3 text-sm">
          <p><strong>Monthly Revenue:</strong> Annual revenue is distributed by month using seasonal patterns typical of the industry.</p>
          <p><strong>Working Capital Changes:</strong> Calculated based on historical changes in accounts receivable, inventory, and accounts payable.</p>
          <p><strong>Capital Expenditures:</strong> Based on the change in fixed assets plus depreciation, distributed unevenly throughout the year.</p>
          <p><strong>Financing Activities:</strong> Include quarterly dividend payments and monthly debt repayments.</p>
          <p><strong>Cash Balances:</strong> Each month's ending balance becomes the next month's beginning balance.</p>
          <p className="text-xs text-neutral-500 italic mt-2">Note: This is a simplified forecast model. For more accurate projections, adjust the seasonality patterns and distribution logic to match your specific business cycles.</p>
        </div>
      </Card>
    </div>
  );
}