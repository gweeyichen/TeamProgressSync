import { useState, useEffect, useMemo } from 'react';
import { ProjectionYear } from '../../lib/types';

interface InvestmentParams {
  initialInvestment: number;
  ownershipStake: number;
  investmentYear: number;
  exitYear: number;
  exitMultiple: number;
  companyGrowthRate: number;
}

export default function InvestmentModeling() {
  const [investmentParams, setInvestmentParams] = useState<InvestmentParams>({
    initialInvestment: 5000, // in thousands
    ownershipStake: 20, // percentage
    investmentYear: 2025,
    exitYear: 2029,
    exitMultiple: 15, // EBITDA multiple
    companyGrowthRate: 10, // percentage
  });
  
  const [investmentResults, setInvestmentResults] = useState({
    exitValue: 0,
    investorProceeds: 0,
    moneyMultiple: 0,
    irr: 0,
  });
  
  // Sample projected EBITDA values (would come from projections tab in a real app)
  const projectedEBITDA: Record<ProjectionYear, number> = {
    '2025': 2574,
    '2026': 2831,
    '2027': 3115,
    '2028': 3426,
    '2029': 3769,
  };
  
  // Helper function to convert number to ProjectionYear type
  const getProjectionYearValue = useMemo(() => {
    return (year: number): number => {
      const yearStr = year.toString() as ProjectionYear;
      return projectedEBITDA[yearStr] || 0;
    };
  }, [projectedEBITDA]);
  
  // Update investment parameters
  const handleParamChange = (param: string, value: number) => {
    setInvestmentParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Calculate investment returns
  useEffect(() => {
    const calculateInvestmentReturns = () => {
      const exitYear = investmentParams.exitYear;
      const investmentYear = investmentParams.investmentYear;
      const holdingPeriod = exitYear - investmentYear;
      
      // Get exit year EBITDA
      let exitEBITDA = getProjectionYearValue(exitYear);
      
      // Calculate company value at exit
      const exitCompanyValue = exitEBITDA * investmentParams.exitMultiple;
      
      // Calculate investor's share of exit proceeds
      const investorProceeds = exitCompanyValue * (investmentParams.ownershipStake / 100);
      
      // Calculate money multiple
      const moneyMultiple = investorProceeds / investmentParams.initialInvestment;
      
      // Calculate IRR
      const irr = ((Math.pow(moneyMultiple, 1 / holdingPeriod) - 1) * 100);
      
      return {
        exitValue: exitCompanyValue,
        investorProceeds,
        moneyMultiple,
        irr,
      };
    };
    
    setInvestmentResults(calculateInvestmentReturns());
  }, [investmentParams, projectedEBITDA]);

  // Format currency in thousands
  const formatCurrency = (value: number) => {
    return '$' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Investment Modeling</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Investment Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Initial Investment ($000s)</label>
              <input
                type="number"
                value={investmentParams.initialInvestment}
                onChange={(e) => handleParamChange('initialInvestment', parseFloat(e.target.value) || 0)}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Ownership Stake (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={investmentParams.ownershipStake}
                onChange={(e) => handleParamChange('ownershipStake', parseFloat(e.target.value) || 0)}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Investment Year</label>
              <select
                value={investmentParams.investmentYear}
                onChange={(e) => handleParamChange('investmentYear', parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Exit Year</label>
              <select
                value={investmentParams.exitYear}
                onChange={(e) => handleParamChange('exitYear', parseInt(e.target.value))}
                className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value={2026} disabled={investmentParams.investmentYear >= 2026}>2026</option>
                <option value={2027} disabled={investmentParams.investmentYear >= 2027}>2027</option>
                <option value={2028} disabled={investmentParams.investmentYear >= 2028}>2028</option>
                <option value={2029}>2029</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Exit EBITDA Multiple</span>
              <span>{investmentParams.exitMultiple}x</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="25" 
              value={investmentParams.exitMultiple} 
              step="0.5" 
              onChange={(e) => handleParamChange('exitMultiple', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span>Company Annual Growth Rate</span>
              <span>{investmentParams.companyGrowthRate}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={investmentParams.companyGrowthRate} 
              step="0.5" 
              onChange={(e) => handleParamChange('companyGrowthRate', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Investment Returns</h3>
          
          <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-neutral-500">Company Exit Value</h4>
                <div className="text-2xl font-bold text-primary">{formatCurrency(investmentResults.exitValue)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500">Investor Proceeds</h4>
                <div className="text-2xl font-bold text-primary">{formatCurrency(investmentResults.investorProceeds)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500">Money Multiple</h4>
                <div className="text-2xl font-bold text-primary">{investmentResults.moneyMultiple.toFixed(2)}x</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500">IRR</h4>
                <div className="text-2xl font-bold text-primary">{investmentResults.irr.toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <h3 className="text-base font-semibold mb-2">Investment Summary</h3>
            <ul className="text-sm space-y-2 text-neutral-600">
              <li><span className="font-medium">Investment:</span> {formatCurrency(investmentParams.initialInvestment)} for {investmentParams.ownershipStake}% equity</li>
              <li><span className="font-medium">Timeline:</span> {investmentParams.exitYear - investmentParams.investmentYear} year holding period ({investmentParams.investmentYear} to {investmentParams.exitYear})</li>
              <li><span className="font-medium">Exit Value:</span> {investmentParams.exitMultiple}x EBITDA = {formatCurrency(investmentResults.exitValue)}</li>
              <li><span className="font-medium">Returns:</span> {formatCurrency(investmentResults.investorProceeds)} ({investmentResults.moneyMultiple.toFixed(2)}x, {investmentResults.irr.toFixed(1)}% IRR)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-lg font-semibold mb-3">Sensitivity Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-neutral-100 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Exit Multiple</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">10x</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">12.5x</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">15x</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">17.5x</th>
                <th className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">20x</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-neutral-700">IRR</td>
                <td className="px-4 py-2 text-sm text-right">
                  {(((Math.pow((getProjectionYearValue(investmentParams.exitYear) * 10 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment, 1 / (investmentParams.exitYear - investmentParams.investmentYear)) - 1) * 100).toFixed(1))}%
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {(((Math.pow((getProjectionYearValue(investmentParams.exitYear) * 12.5 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment, 1 / (investmentParams.exitYear - investmentParams.investmentYear)) - 1) * 100).toFixed(1))}%
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {(((Math.pow((getProjectionYearValue(investmentParams.exitYear) * 15 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment, 1 / (investmentParams.exitYear - investmentParams.investmentYear)) - 1) * 100).toFixed(1))}%
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {(((Math.pow((getProjectionYearValue(investmentParams.exitYear) * 17.5 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment, 1 / (investmentParams.exitYear - investmentParams.investmentYear)) - 1) * 100).toFixed(1))}%
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  {(((Math.pow((getProjectionYearValue(investmentParams.exitYear) * 20 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment, 1 / (investmentParams.exitYear - investmentParams.investmentYear)) - 1) * 100).toFixed(1))}%
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-neutral-700">Money Multiple</td>
                <td className="px-4 py-2 text-sm text-right">{((getProjectionYearValue(investmentParams.exitYear) * 10 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment).toFixed(2)}x</td>
                <td className="px-4 py-2 text-sm text-right">{((getProjectionYearValue(investmentParams.exitYear) * 12.5 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment).toFixed(2)}x</td>
                <td className="px-4 py-2 text-sm text-right">{((getProjectionYearValue(investmentParams.exitYear) * 15 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment).toFixed(2)}x</td>
                <td className="px-4 py-2 text-sm text-right">{((getProjectionYearValue(investmentParams.exitYear) * 17.5 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment).toFixed(2)}x</td>
                <td className="px-4 py-2 text-sm text-right">{((getProjectionYearValue(investmentParams.exitYear) * 20 * (investmentParams.ownershipStake / 100)) / investmentParams.initialInvestment).toFixed(2)}x</td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm font-medium text-neutral-700">Investor Proceeds</td>
                <td className="px-4 py-2 text-sm text-right">{formatCurrency(getProjectionYearValue(investmentParams.exitYear) * 10 * (investmentParams.ownershipStake / 100))}</td>
                <td className="px-4 py-2 text-sm text-right">{formatCurrency(getProjectionYearValue(investmentParams.exitYear) * 12.5 * (investmentParams.ownershipStake / 100))}</td>
                <td className="px-4 py-2 text-sm text-right">{formatCurrency(getProjectionYearValue(investmentParams.exitYear) * 15 * (investmentParams.ownershipStake / 100))}</td>
                <td className="px-4 py-2 text-sm text-right">{formatCurrency(getProjectionYearValue(investmentParams.exitYear) * 17.5 * (investmentParams.ownershipStake / 100))}</td>
                <td className="px-4 py-2 text-sm text-right">{formatCurrency(getProjectionYearValue(investmentParams.exitYear) * 20 * (investmentParams.ownershipStake / 100))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
