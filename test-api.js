import fetch from 'node-fetch';

async function testAPI() {
  console.log('Testing API endpoints...');
  
  try {
    // Test financial data endpoint
    console.log('\nTesting POST /api/financial-data');
    const financialData = {
      userId: 1,
      dataJson: JSON.stringify({
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
        }
      })
    };
    
    const financialResponse = await fetch('http://localhost:5000/api/financial-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(financialData)
    });
    
    const financialResult = await financialResponse.json();
    console.log('Financial data response:', financialResult);
    
    // Test valuation parameters endpoint
    console.log('\nTesting POST /api/valuation-parameters');
    const valuationParams = {
      userId: 1,
      paramsJson: JSON.stringify({
        wacc: 10.5,
        perpetualGrowthRate: 2.5,
        ebitdaMultiple: 8.0,
        peRatio: 15.0,
        psRatio: 2.0
      })
    };
    
    const valuationResponse = await fetch('http://localhost:5000/api/valuation-parameters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(valuationParams)
    });
    
    const valuationResult = await valuationResponse.json();
    console.log('Valuation parameters response:', valuationResult);
    
    // Test investment model endpoint
    console.log('\nTesting POST /api/investment-models');
    const investmentModel = {
      userId: 1,
      modelJson: JSON.stringify({
        name: 'Default Model',
        initialInvestment: 5000000,
        ownershipStake: 25.0,
        investmentYear: 2023,
        exitYear: 2028,
        exitMultiple: 3.0,
        companyGrowthRate: 15.0
      })
    };
    
    const investmentResponse = await fetch('http://localhost:5000/api/investment-models', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(investmentModel)
    });
    
    const investmentResult = await investmentResponse.json();
    console.log('Investment model response:', investmentResult);
    
    // Test GET endpoints
    console.log('\nTesting GET /api/financial-data/1');
    const getFinancialResponse = await fetch('http://localhost:5000/api/financial-data/1');
    const getFinancialResult = await getFinancialResponse.json();
    console.log('GET financial data response:', getFinancialResult);
    
    console.log('\nTesting GET /api/valuation-parameters/1');
    const getValuationResponse = await fetch('http://localhost:5000/api/valuation-parameters/1');
    const getValuationResult = await getValuationResponse.json();
    console.log('GET valuation parameters response:', getValuationResult);
    
    console.log('\nTesting GET /api/investment-models/1');
    const getInvestmentResponse = await fetch('http://localhost:5000/api/investment-models/1');
    const getInvestmentResult = await getInvestmentResponse.json();
    console.log('GET investment model response:', getInvestmentResult);
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAPI();