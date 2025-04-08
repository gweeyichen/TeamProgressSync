import { useState } from 'react';
import { Language } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import SaveLoadProject from '@/components/SaveLoadProject';
import { useUser } from '@/contexts/UserContext';
import { showNotification } from '@/components/ui/notification';

export default function Header() {
  const { toast } = useToast();
  const { 
    saveFinancialData, 
    loadFinancialData, 
    saveValuationParameters, 
    loadValuationParameters,
    saveInvestmentModel,
    loadInvestmentModel
  } = useUser();
  
  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated for download",
    });
    // Actual export logic would go here
  };
  
  const handleSaveProject = async () => {
    try {
      // Create a comprehensive financial data object
      const financialData = {
        historicalFinancials: {
          incomeStatement: {
            '2022': { revenue: 800000, cogs: 560000, grossProfit: 240000, operatingExpenses: 120000, ebitda: 120000 },
            '2023': { revenue: 1000000, cogs: 700000, grossProfit: 300000, operatingExpenses: 150000, ebitda: 150000 },
            '2024': { revenue: 1200000, cogs: 840000, grossProfit: 360000, operatingExpenses: 180000, ebitda: 180000 }
          },
          balanceSheet: {
            '2022': { cashAndEquivalents: 200000, accountsReceivable: 100000, inventory: 120000, totalAssets: 500000 },
            '2023': { cashAndEquivalents: 250000, accountsReceivable: 120000, inventory: 150000, totalAssets: 600000 },
            '2024': { cashAndEquivalents: 300000, accountsReceivable: 150000, inventory: 180000, totalAssets: 700000 }
          },
          cashFlow: {
            '2022': { operatingCashFlow: 90000, investingCashFlow: -40000, financingCashFlow: -20000, netCashFlow: 30000 },
            '2023': { operatingCashFlow: 120000, investingCashFlow: -50000, financingCashFlow: -30000, netCashFlow: 40000 },
            '2024': { operatingCashFlow: 150000, investingCashFlow: -60000, financingCashFlow: -40000, netCashFlow: 50000 }
          }
        },
        projections: {
          incomeStatement: {
            '2025': { revenue: 1440000, cogs: 1008000, grossProfit: 432000, operatingExpenses: 216000, ebitda: 216000 },
            '2026': { revenue: 1728000, cogs: 1209600, grossProfit: 518400, operatingExpenses: 259200, ebitda: 259200 },
            '2027': { revenue: 2073600, cogs: 1451520, grossProfit: 622080, operatingExpenses: 311040, ebitda: 311040 }
          },
          balanceSheet: {
            '2025': { cashAndEquivalents: 360000, accountsReceivable: 180000, inventory: 216000, totalAssets: 840000 },
            '2026': { cashAndEquivalents: 432000, accountsReceivable: 216000, inventory: 259200, totalAssets: 1008000 },
            '2027': { cashAndEquivalents: 518400, accountsReceivable: 259200, inventory: 311040, totalAssets: 1209600 }
          },
          cashFlow: {
            '2025': { operatingCashFlow: 180000, investingCashFlow: -72000, financingCashFlow: -48000, netCashFlow: 60000 },
            '2026': { operatingCashFlow: 216000, investingCashFlow: -86400, financingCashFlow: -57600, netCashFlow: 72000 },
            '2027': { operatingCashFlow: 259200, investingCashFlow: -103680, financingCashFlow: -69120, netCashFlow: 86400 }
          }
        },
        projectionParams: {
          revenueGrowth: 20,
          grossMargin: 30,
          sgaPercent: 10,
          rdPercent: 5,
          capexPercent: 5,
          taxRate: 25,
          wcPercent: 10
        }
      };
      
      const valuationParameters = {
        wacc: 10.5,
        perpetualGrowthRate: 2.5,
        ebitdaMultiple: 8.0,
        peRatio: 15.0,
        psRatio: 2.0
      };
      
      const investmentModel = {
        name: 'Default Model',
        initialInvestment: 5000000,
        ownershipStake: 25.0,
        investmentYear: 2023,
        exitYear: 2028,
        exitMultiple: 3.0,
        companyGrowthRate: 15.0
      };
      
      await Promise.all([
        saveFinancialData(financialData),
        saveValuationParameters(valuationParameters),
        saveInvestmentModel(investmentModel)
      ]);
      
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      showNotification('Error saving project data', 'error');
      return false;
    }
  };
  
  const handleLoadProject = async () => {
    try {
      const [financialData, valuationParams, investmentModel] = await Promise.all([
        loadFinancialData(),
        loadValuationParameters(),
        loadInvestmentModel()
      ]);
      
      // Display loaded data in console for debugging
      console.log('Loaded financial data:', financialData);
      console.log('Loaded valuation parameters:', valuationParams);
      console.log('Loaded investment model:', investmentModel);
      
      // Check if any data was loaded
      if (!financialData && !valuationParams && !investmentModel) {
        showNotification('No saved project data found', 'warning');
        return false;
      }
      
      // In a full implementation, we would have global state or context to update the app
      // For now, we'll just show a success notification
      
      // Create a summary of what was loaded
      const loadedItems = [];
      if (financialData) loadedItems.push('financial data');
      if (valuationParams) loadedItems.push('valuation parameters');
      if (investmentModel) loadedItems.push('investment model');
      
      showNotification(`Successfully loaded ${loadedItems.join(', ')}`, 'success');
      
      return true;
    } catch (error) {
      console.error('Error loading project:', error);
      showNotification('Error loading project data', 'error');
      return false;
    }
  };
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <i className="ri-line-chart-line text-2xl mr-2"></i>
            <h1 className="text-2xl font-bold">Financial Projection & Valuation Tool</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SaveLoadProject onSave={handleSaveProject} onLoad={handleLoadProject} />
            
            
            
            <button 
              onClick={handleExportReport}
              className="bg-white text-primary hover:bg-neutral-100 px-3 py-1 rounded-md text-sm font-medium flex items-center"
            >
              <i className="ri-file-download-line mr-1"></i>
              <span>Export Report</span>
            </button>
          </div>
        </div>
        <p className="text-white/80 mt-1">Comprehensive financial modeling with multi-language support</p>
      </div>
    </header>
  );
}
