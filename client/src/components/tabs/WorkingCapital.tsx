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

export default function WorkingCapital() {
  const { historicalFinancials } = useUser();
  const [workingCapitalMetrics, setWorkingCapitalMetrics] = useState<Record<FinancialYear, {
    receivableDays: number;
    payableDays: number;
    inventoryDays: number;
    cashConversionCycle: number;
    monthlyReceivables: number;
    monthlyPayables: number;
    monthlyInventory: number;
    workingCapitalNeed: number;
  }>>({
    '2022': { receivableDays: 0, payableDays: 0, inventoryDays: 0, cashConversionCycle: 0, monthlyReceivables: 0, monthlyPayables: 0, monthlyInventory: 0, workingCapitalNeed: 0 },
    '2023': { receivableDays: 0, payableDays: 0, inventoryDays: 0, cashConversionCycle: 0, monthlyReceivables: 0, monthlyPayables: 0, monthlyInventory: 0, workingCapitalNeed: 0 },
    '2024': { receivableDays: 0, payableDays: 0, inventoryDays: 0, cashConversionCycle: 0, monthlyReceivables: 0, monthlyPayables: 0, monthlyInventory: 0, workingCapitalNeed: 0 }
  });

  // Consolidated data for calculation
  const financialData = useMemo(() => {
    if (!historicalFinancials) return null;

    return {
      '2022': {
        revenue: historicalFinancials.incomeStatement['2022'].revenue || 0,
        cogs: historicalFinancials.incomeStatement['2022'].cogs || 0,
        accountsReceivable: historicalFinancials.balanceSheet['2022'].accountsReceivable || 0,
        inventory: historicalFinancials.balanceSheet['2022'].inventory || 0,
        accountsPayable: historicalFinancials.balanceSheet['2022'].accountsPayable || 0
      },
      '2023': {
        revenue: historicalFinancials.incomeStatement['2023'].revenue || 0,
        cogs: historicalFinancials.incomeStatement['2023'].cogs || 0,
        accountsReceivable: historicalFinancials.balanceSheet['2023'].accountsReceivable || 0,
        inventory: historicalFinancials.balanceSheet['2023'].inventory || 0,
        accountsPayable: historicalFinancials.balanceSheet['2023'].accountsPayable || 0
      },
      '2024': {
        revenue: historicalFinancials.incomeStatement['2024'].revenue || 0,
        cogs: historicalFinancials.incomeStatement['2024'].cogs || 0,
        accountsReceivable: historicalFinancials.balanceSheet['2024'].accountsReceivable || 0,
        inventory: historicalFinancials.balanceSheet['2024'].inventory || 0,
        accountsPayable: historicalFinancials.balanceSheet['2024'].accountsPayable || 0
      }
    };
  }, [historicalFinancials]);

  // Calculate working capital metrics
  useEffect(() => {
    if (!financialData) return;

    const calculateMetrics = () => {
      const years: FinancialYear[] = ['2022', '2023', '2024'];
      const newMetrics = { ...workingCapitalMetrics };
      
      years.forEach((year, index) => {
        if (index === 0) {
          // For 2022, we don't have a previous year for average calculation
          // Using the current year figures as an approximation
          const receivableDays = (financialData[year].accountsReceivable / (financialData[year].revenue / 365));
          const payableDays = (financialData[year].accountsPayable / (financialData[year].cogs / 365));
          const inventoryDays = (financialData[year].inventory / (financialData[year].cogs / 365));
          
          newMetrics[year] = {
            receivableDays,
            payableDays,
            inventoryDays,
            cashConversionCycle: receivableDays + inventoryDays - payableDays,
            monthlyReceivables: (receivableDays / 30) * (financialData[year].revenue / 12),
            monthlyPayables: (payableDays / 30) * (financialData[year].cogs / 12),
            monthlyInventory: (inventoryDays / 30) * (financialData[year].cogs / 12),
            workingCapitalNeed: 0 // Will calculate after computing the three components
          };
          
          newMetrics[year].workingCapitalNeed = 
            newMetrics[year].monthlyReceivables + 
            newMetrics[year].monthlyInventory - 
            newMetrics[year].monthlyPayables;
        } else {
          // For 2023 and 2024, we can calculate the average
          const prevYear = years[index - 1];
          
          // Calculate average figures
          const avgReceivables = (financialData[prevYear].accountsReceivable + financialData[year].accountsReceivable) / 2;
          const avgInventory = (financialData[prevYear].inventory + financialData[year].inventory) / 2;
          const avgPayables = (financialData[prevYear].accountsPayable + financialData[year].accountsPayable) / 2;
          
          const receivableDays = (avgReceivables / (financialData[year].revenue / 365));
          const payableDays = (avgPayables / (financialData[year].cogs / 365));
          const inventoryDays = (avgInventory / (financialData[year].cogs / 365));
          
          newMetrics[year] = {
            receivableDays,
            payableDays,
            inventoryDays,
            cashConversionCycle: receivableDays + inventoryDays - payableDays,
            monthlyReceivables: (receivableDays / 30) * (financialData[year].revenue / 12),
            monthlyPayables: (payableDays / 30) * (financialData[year].cogs / 12),
            monthlyInventory: (inventoryDays / 30) * (financialData[year].cogs / 12),
            workingCapitalNeed: 0 // Will calculate after computing the three components
          };
          
          newMetrics[year].workingCapitalNeed = 
            newMetrics[year].monthlyReceivables + 
            newMetrics[year].monthlyInventory - 
            newMetrics[year].monthlyPayables;
        }
      });
      
      setWorkingCapitalMetrics(newMetrics);
    };
    
    calculateMetrics();
  }, [financialData]);

  // Formatting functions
  const formatDays = (days: number) => {
    return isNaN(days) || !isFinite(days) ? 'N/A' : Math.round(days).toLocaleString();
  };
  
  const formatCurrency = (amount: number) => {
    return isNaN(amount) || !isFinite(amount) 
      ? 'N/A' 
      : '$' + Math.round(amount).toLocaleString();
  };

  const getBgColor = (year: FinancialYear) => {
    const colorMap: Record<FinancialYear, string> = {
      '2022': 'bg-blue-50',
      '2023': 'bg-green-50',
      '2024': 'bg-purple-50'
    };
    return colorMap[year];
  };

  const getTextColor = (year: FinancialYear) => {
    const colorMap: Record<FinancialYear, string> = {
      '2022': 'text-blue-700',
      '2023': 'text-green-700',
      '2024': 'text-purple-700'
    };
    return colorMap[year];
  };

  if (!historicalFinancials) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Working Capital Analysis</h3>
        <p className="text-neutral-500">Please enter historical financial data first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-neutral-800">Working Capital Analysis</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
          <Card key={year} className={`p-5 ${getBgColor(year)}`}>
            <h3 className={`text-lg font-semibold mb-3 ${getTextColor(year)}`}>{year} Working Capital</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Cash Conversion Cycle:</span>
                <span className="font-medium">{formatDays(workingCapitalMetrics[year].cashConversionCycle)} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Monthly Working Capital Need:</span>
                <span className="font-medium">{formatCurrency(workingCapitalMetrics[year].workingCapitalNeed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Annual WC as % of Revenue:</span>
                <span className="font-medium">
                  {financialData && financialData[year].revenue > 0 
                    ? ((workingCapitalMetrics[year].workingCapitalNeed * 12 / financialData[year].revenue) * 100).toFixed(1) + '%'
                    : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Detailed Metrics Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-neutral-200">
        <Table>
          <TableCaption>Working Capital Components and Metrics</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Metric</TableHead>
              <TableHead>2022</TableHead>
              <TableHead>2023</TableHead>
              <TableHead>2024</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Revenue</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {financialData && formatCurrency(financialData[year].revenue)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">COGS</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {financialData && formatCurrency(financialData[year].cogs)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Accounts Receivable</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {financialData && formatCurrency(financialData[year].accountsReceivable)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Inventory</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {financialData && formatCurrency(financialData[year].inventory)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Accounts Payable</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {financialData && formatCurrency(financialData[year].accountsPayable)}
                </TableCell>
              ))}
            </TableRow>
            
            <TableRow className="bg-neutral-50">
              <TableCell className="font-bold">Days Metrics</TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Receivable Days (DSO)</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatDays(workingCapitalMetrics[year].receivableDays)} days
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payable Days (DPO)</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatDays(workingCapitalMetrics[year].payableDays)} days
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Inventory Days (DIO)</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatDays(workingCapitalMetrics[year].inventoryDays)} days
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cash Conversion Cycle</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatDays(workingCapitalMetrics[year].cashConversionCycle)} days
                </TableCell>
              ))}
            </TableRow>
            
            <TableRow className="bg-neutral-50">
              <TableCell className="font-bold">Monthly Working Capital</TableCell>
              <TableCell colSpan={3}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Monthly Accounts Receivable</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatCurrency(workingCapitalMetrics[year].monthlyReceivables)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Monthly Inventory</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatCurrency(workingCapitalMetrics[year].monthlyInventory)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Monthly Accounts Payable</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatCurrency(workingCapitalMetrics[year].monthlyPayables)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Net Working Capital Need (Monthly)</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatCurrency(workingCapitalMetrics[year].workingCapitalNeed)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Net Working Capital Need (Annual)</TableCell>
              {(['2022', '2023', '2024'] as FinancialYear[]).map(year => (
                <TableCell key={year}>
                  {formatCurrency(workingCapitalMetrics[year].workingCapitalNeed * 12)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      {/* Explainer Card */}
      <Card className="p-5 bg-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Working Capital Calculations</h3>
        <div className="space-y-3 text-sm">
          <p><strong>Receivable Days (DSO)</strong> = Average Accounts Receivable ÷ (Annual Revenue ÷ 365)</p>
          <p><strong>Payable Days (DPO)</strong> = Average Accounts Payable ÷ (Annual COGS ÷ 365)</p>
          <p><strong>Inventory Days (DIO)</strong> = Average Inventory ÷ (Annual COGS ÷ 365)</p>
          <p><strong>Cash Conversion Cycle</strong> = DSO + DIO - DPO</p>
          <p><strong>Monthly Working Capital</strong> is calculated using average days and monthly revenue/COGS:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Monthly A/R = (Receivable Days ÷ 30) × Monthly Revenue</li>
            <li>Monthly A/P = (Payable Days ÷ 30) × Monthly COGS</li>
            <li>Monthly Inventory = (Inventory Days ÷ 30) × Monthly COGS</li>
          </ul>
          <p><strong>Net Working Capital Need</strong> = Monthly A/R + Monthly Inventory - Monthly A/P</p>
        </div>
      </Card>
    </div>
  );
}