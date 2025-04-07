import { useState, useEffect } from 'react';
import { ProjectionYear } from '@/lib/types';

// Projected financial data to use for valuation (would come from the projections tab in a real app)
const sampleProjectedData = {
  revenue: {
    '2025': 8580,
    '2026': 9438,
    '2027': 10382,
    '2028': 11420,
    '2029': 12562
  },
  ebitda: {
    '2025': 2574,
    '2026': 2831,
    '2027': 3115,
    '2028': 3426,
    '2029': 3769
  },
  netIncome: {
    '2025': 1562,
    '2026': 1718,
    '2027': 1890,
    '2028': 2079,
    '2029': 2287
  },
  freeCashFlow: {
    '2025': 1875,
    '2026': 2063,
    '2027': 2269,
    '2028': 2496,
    '2029': 2745
  }
};

export default function CompanyValuation() {
  const [valuationParams, setValuationParams] = useState({
    wacc: 10, // Weighted Average Cost of Capital
    perpetualGrowthRate: 2.5, // Terminal growth rate
    ebitdaMultiple: 12, // EBITDA multiple for exit value
    peRatio: 25, // Price to Earnings ratio
    psRatio: 3, // Price to Sales ratio
  });
  
  const [valuations, setValuations] = useState({
    dcf: 0,
    ebitdaMultiple: 0,
    peRatio: 0,
    psRatio: 0,
    average: 0
  });
  
  // Update valuation parameters
  const handleParamChange = (param: string, value: number) => {
    setValuationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Calculate company valuations
  useEffect(() => {
    // DCF Valuation
    const calculateDCF = () => {
      const projectionYears: ProjectionYear[] = ['2025', '2026', '2027', '2028', '2029'];
      let presentValue = 0;
      
      // Calculate present value of projected cash flows
      projectionYears.forEach((year, index) => {
        const cashFlow = sampleProjectedData.freeCashFlow[year];
        const discountFactor = Math.pow(1 + valuationParams.wacc / 100, index + 1);
        presentValue += cashFlow / discountFactor;
      });
      
      // Calculate terminal value
      const terminalYear = sampleProjectedData.freeCashFlow['2029'];
      const terminalValue = terminalYear * (1 + valuationParams.perpetualGrowthRate / 100) / 
                          (valuationParams.wacc / 100 - valuationParams.perpetualGrowthRate / 100);
      
      // Discount terminal value
      const discountedTerminalValue = terminalValue / Math.pow(1 + valuationParams.wacc / 100, 5);
      
      // Total enterprise value
      const enterpriseValue = presentValue + discountedTerminalValue;
      
      return enterpriseValue;
    };
    
    // EBITDA Multiple Valuation
    const calculateEBITDAMultiple = () => {
      const terminalEBITDA = sampleProjectedData.ebitda['2029'];
      return terminalEBITDA * valuationParams.ebitdaMultiple;
    };
    
    // P/E Ratio Valuation
    const calculatePERatio = () => {
      const terminalNetIncome = sampleProjectedData.netIncome['2029'];
      return terminalNetIncome * valuationParams.peRatio;
    };
    
    // P/S Ratio Valuation
    const calculatePSRatio = () => {
      const terminalRevenue = sampleProjectedData.revenue['2029'];
      return terminalRevenue * valuationParams.psRatio;
    };
    
    const dcfValue = calculateDCF();
    const ebitdaValue = calculateEBITDAMultiple();
    const peValue = calculatePERatio();
    const psValue = calculatePSRatio();
    const averageValue = (dcfValue + ebitdaValue + peValue + psValue) / 4;
    
    setValuations({
      dcf: dcfValue,
      ebitdaMultiple: ebitdaValue,
      peRatio: peValue,
      psRatio: psValue,
      average: averageValue
    });
  }, [valuationParams]);
  
  // Format currency in thousands
  const formatCurrency = (value: number) => {
    return '$' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Company Valuation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Valuation Parameters</h3>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>WACC (Discount Rate)</span>
              <span>{valuationParams.wacc}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="20" 
              value={valuationParams.wacc} 
              step="0.1" 
              onChange={(e) => handleParamChange('wacc', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Terminal Growth Rate</span>
              <span>{valuationParams.perpetualGrowthRate}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5" 
              value={valuationParams.perpetualGrowthRate} 
              step="0.1" 
              onChange={(e) => handleParamChange('perpetualGrowthRate', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>EBITDA Multiple</span>
              <span>{valuationParams.ebitdaMultiple}x</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="25" 
              value={valuationParams.ebitdaMultiple} 
              step="0.5" 
              onChange={(e) => handleParamChange('ebitdaMultiple', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>P/E Ratio</span>
              <span>{valuationParams.peRatio}x</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={valuationParams.peRatio} 
              step="1" 
              onChange={(e) => handleParamChange('peRatio', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>P/S Ratio</span>
              <span>{valuationParams.psRatio}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="10" 
              value={valuationParams.psRatio} 
              step="0.1" 
              onChange={(e) => handleParamChange('psRatio', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Valuation Results ($000s)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-base font-medium mb-1">DCF Valuation</h4>
              <div className="text-2xl font-bold text-primary">{formatCurrency(valuations.dcf)}</div>
              <p className="text-sm text-neutral-500">Based on discounted future cash flows</p>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-base font-medium mb-1">EBITDA Multiple</h4>
              <div className="text-2xl font-bold text-primary">{formatCurrency(valuations.ebitdaMultiple)}</div>
              <p className="text-sm text-neutral-500">Based on {valuationParams.ebitdaMultiple}x EBITDA</p>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-base font-medium mb-1">P/E Ratio</h4>
              <div className="text-2xl font-bold text-primary">{formatCurrency(valuations.peRatio)}</div>
              <p className="text-sm text-neutral-500">Based on {valuationParams.peRatio}x earnings</p>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-base font-medium mb-1">P/S Ratio</h4>
              <div className="text-2xl font-bold text-primary">{formatCurrency(valuations.psRatio)}</div>
              <p className="text-sm text-neutral-500">Based on {valuationParams.psRatio}x sales</p>
            </div>
          </div>
          
          <div className="mt-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">Average Valuation</h4>
            <div className="text-3xl font-bold text-primary">{formatCurrency(valuations.average)}</div>
            <p className="text-sm text-neutral-600 mt-1">Average of all valuation methods</p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-lg font-semibold mb-3">Projected Financial Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-neutral-100 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Metric</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">2025</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">2026</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">2027</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">2028</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">2029</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <tr>
                <td className="px-4 py-2 text-sm text-neutral-700">Revenue</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.revenue['2025'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.revenue['2026'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.revenue['2027'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.revenue['2028'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.revenue['2029'].toLocaleString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-neutral-700">EBITDA</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.ebitda['2025'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.ebitda['2026'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.ebitda['2027'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.ebitda['2028'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.ebitda['2029'].toLocaleString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-neutral-700">Net Income</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.netIncome['2025'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.netIncome['2026'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.netIncome['2027'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.netIncome['2028'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.netIncome['2029'].toLocaleString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-neutral-700">Free Cash Flow</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.freeCashFlow['2025'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.freeCashFlow['2026'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.freeCashFlow['2027'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.freeCashFlow['2028'].toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-right">${sampleProjectedData.freeCashFlow['2029'].toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
