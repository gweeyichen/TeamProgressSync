import React, { useMemo } from 'react';
import { FinancialYear, ProjectionYear, AllYears, FinancialData } from '@/lib/types';
import { useUser } from '@/contexts/UserContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';

export default function CashFlow() {
  const { historicalFinancials } = useUser();
  
  // Historical financial years
  const financialYears: FinancialYear[] = ['2022', '2023', '2024'];
  
  // Projection years
  const projectionYears: ProjectionYear[] = ['2025', '2026', '2027', '2028', '2029'];
  
  // All years for combined charts
  const allYears: AllYears[] = [...financialYears, ...projectionYears];
  
  // Get projected cash flow data from the parent (via localStorage or state management)
  const projectedCashFlowData = useMemo(() => {
    const savedData = localStorage.getItem('projectedData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.cashFlow || {};
      } catch (error) {
        console.error('Error parsing saved projected data:', error);
        return {};
      }
    }
    return {};
  }, []);
  
  // Prepare combined cash flow data (historical + projected)
  const combinedCashFlowData = useMemo(() => {
    if (!historicalFinancials) return [];
    
    const result = [];
    
    // Add historical data
    for (const year of financialYears) {
      const historicalData = historicalFinancials.cashFlow[year] || {};
      
      result.push({
        year,
        operatingCashFlow: historicalData.netCashOperating || 0,
        investingCashFlow: historicalData.netCashInvesting || 0,
        financingCashFlow: historicalData.netCashFinancing || 0,
        netCashChange: historicalData.netCashChange || 0,
        isHistorical: true
      });
    }
    
    // Add projected data
    for (const year of projectionYears) {
      const projectedData = projectedCashFlowData[year] || {};
      
      result.push({
        year,
        operatingCashFlow: projectedData.netCashOperating || 0,
        investingCashFlow: projectedData.netCashInvesting || 0,
        financingCashFlow: projectedData.netCashFinancing || 0,
        netCashChange: projectedData.netCashChange || 0,
        isHistorical: false
      });
    }
    
    return result;
  }, [historicalFinancials, projectedCashFlowData, financialYears, projectionYears]);
  
  // Calculate cumulative cash position over time
  const cashPositionData = useMemo(() => {
    if (!historicalFinancials || combinedCashFlowData.length === 0) return [];
    
    const result = [];
    let cumulativeCash = historicalFinancials.balanceSheet['2022']?.cash || 0;
    
    for (const item of combinedCashFlowData) {
      cumulativeCash += item.netCashChange;
      result.push({
        year: item.year,
        cashPosition: cumulativeCash,
        netCashChange: item.netCashChange,
        isHistorical: item.isHistorical
      });
    }
    
    return result;
  }, [historicalFinancials, combinedCashFlowData]);
  
  // Analysis of cash flow components
  const cashFlowComponentsData = useMemo(() => {
    if (!combinedCashFlowData.length) return [];
    
    return combinedCashFlowData.map(item => ({
      name: item.year,
      "Operating Cash Flow": item.operatingCashFlow,
      "Investing Cash Flow": item.investingCashFlow,
      "Financing Cash Flow": item.financingCashFlow,
      "Net Cash Flow": item.netCashChange,
      isHistorical: item.isHistorical
    }));
  }, [combinedCashFlowData]);

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value * 1000); // Convert thousands to actual value
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Cash Flow Analysis</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Cash Position Over Time</h3>
        <p className="text-sm text-neutral-600 mb-4">
          This chart shows the cumulative cash position and net cash change over time, combining historical and projected data.
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={cashPositionData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="netCashChange"
                fill="#8884d8"
                name="Net Cash Change"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cashPosition"
                stroke="#ff7300"
                name="Cash Position"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Cash Flow Components</h3>
        <p className="text-sm text-neutral-600 mb-4">
          This chart breaks down cash flow into operating, investing, and financing components across historical and projected periods.
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cashFlowComponentsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Operating Cash Flow" fill="#82ca9d" />
              <Bar dataKey="Investing Cash Flow" fill="#f7a4a7" />
              <Bar dataKey="Financing Cash Flow" fill="#8884d8" />
              <Bar dataKey="Net Cash Flow" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Cash Flow Trends Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Operating Cash Efficiency</h4>
            <p className="text-3xl font-bold text-primary">
              {historicalFinancials && combinedCashFlowData.length > 0 ? 
                `${((combinedCashFlowData[combinedCashFlowData.length - 1].operatingCashFlow / 
                  combinedCashFlowData[combinedCashFlowData.length - 1].netCashChange) * 100).toFixed(1)}%` : 
                'N/A'}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Operating cash flow as percentage of total net cash flow (latest period)
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Cash Flow Growth</h4>
            <p className="text-3xl font-bold text-primary">
              {historicalFinancials && combinedCashFlowData.length > 2 ? 
                `${(((combinedCashFlowData[combinedCashFlowData.length - 1].netCashChange / 
                  combinedCashFlowData[combinedCashFlowData.length - 3].netCashChange) - 1) * 100).toFixed(1)}%` : 
                'N/A'}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Two-year projected growth rate in net cash flow
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Cash Balance Forecast</h4>
            <p className="text-3xl font-bold text-primary">
              {cashPositionData.length > 0 ? 
                formatCurrency(cashPositionData[cashPositionData.length - 1].cashPosition / 1000) : 
                'N/A'}
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Projected cash balance at the end of forecast period
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}