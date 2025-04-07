import { useState, useEffect, useRef, useMemo } from 'react';
import { Chart } from 'chart.js/auto';
import { FinancialYear, ProjectionYear } from '@/lib/types';
import { useUser } from '@/contexts/UserContext';

// Sample data for charts (in a real app, this would come from the other tabs)
const historicalData = {
  years: [2022, 2023, 2024],
  revenue: [5000, 6200, 7800],
  grossProfit: [3250, 4030, 5070],
  netIncome: [850, 1050, 1320],
  ebitda: [1550, 1900, 2360],
  operatingExpenses: [1700, 2130, 2710]
};

const projectedData = {
  years: [2025, 2026, 2027, 2028, 2029],
  revenue: [8580, 9438, 10382, 11420, 12562],
  grossProfit: [5579, 6135, 6748, 7423, 8165],
  netIncome: [1562, 1718, 1890, 2079, 2287],
  ebitda: [2575, 2832, 3115, 3427, 3770],
  operatingExpenses: [3004, 3305, 3635, 3999, 4398]
};

const combinedYears = [...historicalData.years, ...projectedData.years];
const combinedRevenue = [...historicalData.revenue, ...projectedData.revenue];
const combinedGrossProfit = [...historicalData.grossProfit, ...projectedData.grossProfit];
const combinedNetIncome = [...historicalData.netIncome, ...projectedData.netIncome];
const combinedEbitda = [...historicalData.ebitda, ...projectedData.ebitda];
const combinedOpEx = [...historicalData.operatingExpenses, ...projectedData.operatingExpenses];

// Industry comparison data
const industryData = {
  technology: {
    name: "Technology",
    margins: {
      grossMargin: 65,
      operatingMargin: 25,
      netMargin: 20
    },
    growth: {
      revenue: 12,
      earnings: 15
    },
    metrics: {
      peRatio: 22,
      evEbitda: 15,
      debtToEquity: 0.4
    }
  },
  healthcare: {
    name: "Healthcare",
    margins: {
      grossMargin: 55,
      operatingMargin: 18,
      netMargin: 12
    },
    growth: {
      revenue: 8,
      earnings: 10
    },
    metrics: {
      peRatio: 18,
      evEbitda: 12,
      debtToEquity: 0.6
    }
  },
  retail: {
    name: "Retail",
    margins: {
      grossMargin: 40,
      operatingMargin: 8,
      netMargin: 5
    },
    growth: {
      revenue: 5,
      earnings: 6
    },
    metrics: {
      peRatio: 15,
      evEbitda: 8,
      debtToEquity: 0.8
    }
  },
  manufacturing: {
    name: "Manufacturing",
    margins: {
      grossMargin: 35,
      operatingMargin: 12,
      netMargin: 8
    },
    growth: {
      revenue: 6,
      earnings: 7
    },
    metrics: {
      peRatio: 16,
      evEbitda: 9,
      debtToEquity: 1.0
    }
  },
  financial: {
    name: "Financial Services",
    margins: {
      grossMargin: 70,
      operatingMargin: 30,
      netMargin: 25
    },
    growth: {
      revenue: 7,
      earnings: 9
    },
    metrics: {
      peRatio: 14,
      evEbitda: 10,
      debtToEquity: 2.5
    }
  }
};

export default function AnalysisCharts() {
  const { historicalFinancials } = useUser();
  const [selectedIndustry, setSelectedIndustry] = useState<string>("technology");
  const [activeTab, setActiveTab] = useState<string>("financial");
  const [selectedValuationTab, setSelectedValuationTab] = useState<string>("overview");
  
  // Chart refs for financial performance
  const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
  const revenueChartInstance = useRef<Chart | null>(null);
  
  const profitabilityChartRef = useRef<HTMLCanvasElement | null>(null);
  const profitabilityChartInstance = useRef<Chart | null>(null);
  
  const marginChartRef = useRef<HTMLCanvasElement | null>(null);
  const marginChartInstance = useRef<Chart | null>(null);
  
  const industryComparisonChartRef = useRef<HTMLCanvasElement | null>(null);
  const industryComparisonChartInstance = useRef<Chart | null>(null);
  
  const growthChartRef = useRef<HTMLCanvasElement | null>(null);
  const growthChartInstance = useRef<Chart | null>(null);
  
  // Advanced analysis charts
  const balanceSheetCompositionRef = useRef<HTMLCanvasElement | null>(null);
  const balanceSheetCompositionInstance = useRef<Chart | null>(null);
  
  const cashFlowComponentsRef = useRef<HTMLCanvasElement | null>(null);
  const cashFlowComponentsInstance = useRef<Chart | null>(null);
  
  const valuationMethodComparisonRef = useRef<HTMLCanvasElement | null>(null);
  const valuationMethodComparisonInstance = useRef<Chart | null>(null);
  
  const sensitivityAnalysisRef = useRef<HTMLCanvasElement | null>(null);
  const sensitivityAnalysisInstance = useRef<Chart | null>(null);
  
  // Financial ratios charts
  const ratiosChartRef = useRef<HTMLCanvasElement | null>(null);
  const ratiosChartInstance = useRef<Chart | null>(null);
  
  // Create and update charts
  useEffect(() => {
    // Initialize Revenue Growth Chart
    if (revenueChartRef.current) {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      
      const ctx = revenueChartRef.current.getContext('2d');
      if (ctx) {
        revenueChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: combinedYears,
            datasets: [
              {
                label: 'Revenue',
                data: combinedRevenue,
                borderColor: '#1a5a96',
                backgroundColor: 'rgba(26, 90, 150, 0.1)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Gross Profit',
                data: combinedGrossProfit,
                borderColor: '#34a853',
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                fill: true,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Revenue & Gross Profit Trends (Historical & Projected)',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                  }
                }
              },
              legend: {
                position: 'top',
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount ($000s)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Profitability Chart
    if (profitabilityChartRef.current) {
      if (profitabilityChartInstance.current) {
        profitabilityChartInstance.current.destroy();
      }
      
      const ctx = profitabilityChartRef.current.getContext('2d');
      if (ctx) {
        profitabilityChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: combinedYears,
            datasets: [
              {
                label: 'Net Income',
                data: combinedNetIncome,
                borderColor: '#ea4335',
                backgroundColor: 'rgba(234, 67, 53, 0.1)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'EBITDA',
                data: combinedEbitda,
                borderColor: '#fbbc05',
                backgroundColor: 'rgba(251, 188, 5, 0.1)',
                fill: true,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Profitability Trends (Historical & Projected)',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                  }
                }
              },
              legend: {
                position: 'top',
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Amount ($000s)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Margins Chart
    if (marginChartRef.current) {
      if (marginChartInstance.current) {
        marginChartInstance.current.destroy();
      }
      
      const ctx = marginChartRef.current.getContext('2d');
      if (ctx) {
        // Calculate margins
        const grossMargins = combinedYears.map((year, index) => {
          if (index < combinedGrossProfit.length) {
            return (combinedGrossProfit[index] / combinedRevenue[index]) * 100;
          }
          return 0;
        });
        
        const operatingMargins = combinedYears.map((year, index) => {
          if (index < combinedEbitda.length) {
            return (combinedEbitda[index] / combinedRevenue[index]) * 100;
          }
          return 0;
        });
        
        const netMargins = combinedYears.map((year, index) => {
          if (index < combinedNetIncome.length) {
            return (combinedNetIncome[index] / combinedRevenue[index]) * 100;
          }
          return 0;
        });
        
        marginChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: combinedYears,
            datasets: [
              {
                label: 'Gross Margin %',
                data: grossMargins,
                borderColor: '#34a853',
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                fill: false,
                tension: 0.3
              },
              {
                label: 'EBITDA Margin %',
                data: operatingMargins,
                borderColor: '#fbbc05',
                backgroundColor: 'rgba(251, 188, 5, 0.1)',
                fill: false,
                tension: 0.3
              },
              {
                label: 'Net Margin %',
                data: netMargins,
                borderColor: '#ea4335',
                backgroundColor: 'rgba(234, 67, 53, 0.1)',
                fill: false,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Margin Analysis (Historical & Projected)',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                  }
                }
              },
              legend: {
                position: 'top',
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Percentage (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Industry Comparison Chart
    if (industryComparisonChartRef.current) {
      if (industryComparisonChartInstance.current) {
        industryComparisonChartInstance.current.destroy();
      }
      
      const ctx = industryComparisonChartRef.current.getContext('2d');
      if (ctx) {
        const industry = industryData[selectedIndustry as keyof typeof industryData];
        
        const companyMargins = {
          grossMargin: (combinedGrossProfit[combinedGrossProfit.length - 1] / combinedRevenue[combinedRevenue.length - 1]) * 100,
          operatingMargin: (combinedEbitda[combinedEbitda.length - 1] / combinedRevenue[combinedRevenue.length - 1]) * 100,
          netMargin: (combinedNetIncome[combinedNetIncome.length - 1] / combinedRevenue[combinedRevenue.length - 1]) * 100
        };
        
        industryComparisonChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Gross Margin', 'Operating Margin', 'Net Margin'],
            datasets: [
              {
                label: 'Your Company',
                data: [
                  companyMargins.grossMargin,
                  companyMargins.operatingMargin,
                  companyMargins.netMargin
                ],
                backgroundColor: 'rgba(26, 90, 150, 0.6)',
                borderColor: 'rgba(26, 90, 150, 1)',
                borderWidth: 1
              },
              {
                label: `${industry.name} Industry Average`,
                data: [
                  industry.margins.grossMargin,
                  industry.margins.operatingMargin,
                  industry.margins.netMargin
                ],
                backgroundColor: 'rgba(52, 168, 83, 0.6)',
                borderColor: 'rgba(52, 168, 83, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Margin Comparison vs ${industry.name} Industry`,
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Percentage (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Growth Chart
    if (growthChartRef.current) {
      if (growthChartInstance.current) {
        growthChartInstance.current.destroy();
      }
      
      const ctx = growthChartRef.current.getContext('2d');
      if (ctx) {
        // Calculate annual growth rates
        const revenueGrowthRates = [];
        const earningsGrowthRates = [];
        
        for (let i = 1; i < combinedRevenue.length; i++) {
          const revenueGrowth = ((combinedRevenue[i] - combinedRevenue[i-1]) / combinedRevenue[i-1]) * 100;
          revenueGrowthRates.push(revenueGrowth);
          
          const earningsGrowth = ((combinedNetIncome[i] - combinedNetIncome[i-1]) / combinedNetIncome[i-1]) * 100;
          earningsGrowthRates.push(earningsGrowth);
        }
        
        // For the growth chart, we need to shift labels by 1 year since growth rates start from the second year
        const growthChartLabels = combinedYears.slice(1);
        
        growthChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: growthChartLabels,
            datasets: [
              {
                label: 'Revenue Growth %',
                data: revenueGrowthRates,
                backgroundColor: 'rgba(26, 90, 150, 0.6)',
                borderColor: 'rgba(26, 90, 150, 1)',
                borderWidth: 1
              },
              {
                label: 'Earnings Growth %',
                data: earningsGrowthRates,
                backgroundColor: 'rgba(234, 67, 53, 0.6)',
                borderColor: 'rgba(234, 67, 53, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Annual Growth Rates',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                  }
                }
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Growth Rate (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Balance Sheet Composition Chart (Donut Chart)
    if (balanceSheetCompositionRef.current && activeTab === 'advanced') {
      if (balanceSheetCompositionInstance.current) {
        balanceSheetCompositionInstance.current.destroy();
      }
      
      const ctx = balanceSheetCompositionRef.current.getContext('2d');
      if (ctx) {
        balanceSheetCompositionInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Current Assets', 'Fixed Assets', 'Other Assets', 'Current Liabilities', 'Long-term Debt', 'Equity'],
            datasets: [
              {
                data: [3500, 4200, 800, 1200, 2300, 5000],
                backgroundColor: [
                  'rgba(54, 162, 235, 0.8)',  // Current Assets
                  'rgba(75, 192, 192, 0.8)',  // Fixed Assets
                  'rgba(153, 102, 255, 0.8)', // Other Assets
                  'rgba(255, 159, 64, 0.8)',  // Current Liabilities
                  'rgba(255, 99, 132, 0.8)',  // Long-term Debt
                  'rgba(255, 205, 86, 0.8)'   // Equity
                ],
                borderColor: '#fff',
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Balance Sheet Composition (2025)',
                font: {
                  size: 16
                }
              },
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Cash Flow Components Chart (Stacked Bar Chart)
    if (cashFlowComponentsRef.current && activeTab === 'advanced') {
      if (cashFlowComponentsInstance.current) {
        cashFlowComponentsInstance.current.destroy();
      }
      
      const ctx = cashFlowComponentsRef.current.getContext('2d');
      if (ctx) {
        cashFlowComponentsInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'],
            datasets: [
              {
                label: 'Operating Cash Flow',
                data: [5000, 6200, 7600, 9000, 10500, 12000, 13500, 15000],
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                stack: 'Stack 0'
              },
              {
                label: 'Investing Cash Flow',
                data: [-2000, -2500, -3000, -4000, -5000, -5500, -6000, -6500],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                stack: 'Stack 0'
              },
              {
                label: 'Financing Cash Flow',
                data: [1000, -500, 2000, 6000, -10000, 3000, 6000, 5000],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                stack: 'Stack 0'
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                stacked: false,
                title: {
                  display: true,
                  text: 'Amount ($000s)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Cash Flow Components',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Valuation Method Comparison Chart (Bar Chart)
    if (valuationMethodComparisonRef.current && activeTab === 'advanced') {
      if (valuationMethodComparisonInstance.current) {
        valuationMethodComparisonInstance.current.destroy();
      }
      
      const ctx = valuationMethodComparisonRef.current.getContext('2d');
      if (ctx) {
        valuationMethodComparisonInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['DCF', 'EBITDA Multiple', 'Revenue Multiple', 'Book Value Multiple', 'PE Multiple'],
            datasets: [
              {
                label: 'Enterprise Value ($ millions)',
                data: [110, 250, 220, 150, 180],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: 'Equity Value ($ millions)',
                data: [95, 210, 190, 140, 160],
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Valuation Method Comparison',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString() + 'M';
                  }
                }
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Value ($ millions)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value + 'M';
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Sensitivity Analysis Chart (Line Chart)
    if (sensitivityAnalysisRef.current && activeTab === 'advanced') {
      if (sensitivityAnalysisInstance.current) {
        sensitivityAnalysisInstance.current.destroy();
      }
      
      const ctx = sensitivityAnalysisRef.current.getContext('2d');
      if (ctx) {
        sensitivityAnalysisInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['8.0%', '10.0%', '12.0%', '14.0%', '16.0%'],
            datasets: [
              {
                label: 'Growth 1.0%',
                data: [50, 40, 30, 25, 20],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'Growth 2.0%',
                data: [65, 45, 35, 28, 22],
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.1)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'Growth 3.0%',
                data: [80, 55, 40, 32, 25],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'Growth 4.0%',
                data: [95, 65, 45, 35, 28],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'Growth 5.0%',
                data: [120, 80, 60, 40, 30],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.1)',
                fill: false,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'DCF Sensitivity: WACC vs. Terminal Growth',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y + 'M';
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'WACC'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Equity Value ($ millions)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value + 'M';
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Initialize Financial Ratios Chart (Line Chart)
    if (ratiosChartRef.current && activeTab === 'ratios') {
      if (ratiosChartInstance.current) {
        ratiosChartInstance.current.destroy();
      }
      
      const ctx = ratiosChartRef.current.getContext('2d');
      if (ctx) {
        ratiosChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2022', '2023', '2024', '2025'],
            datasets: [
              {
                label: 'ROE (%)',
                data: [12.1, 12.8, 13.5, 14.2],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y'
              },
              {
                label: 'ROA (%)',
                data: [7.2, 7.6, 8.2, 8.7],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y'
              },
              {
                label: 'Profit Margin (%)',
                data: [13.5, 14.5, 15.8, 16.9],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y'
              },
              {
                label: 'Debt-to-Equity',
                data: [0.8, 0.7, 0.65, 0.6],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: 'y1'
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Key Financial Ratios Trend',
                font: {
                  size: 16
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Percentage (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Ratio'
                },
                // Grid line settings
                grid: {
                  drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
              }
            }
          }
        });
      }
    }
    
    // Cleanup
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (profitabilityChartInstance.current) {
        profitabilityChartInstance.current.destroy();
      }
      if (marginChartInstance.current) {
        marginChartInstance.current.destroy();
      }
      if (industryComparisonChartInstance.current) {
        industryComparisonChartInstance.current.destroy();
      }
      if (growthChartInstance.current) {
        growthChartInstance.current.destroy();
      }
      if (balanceSheetCompositionInstance.current) {
        balanceSheetCompositionInstance.current.destroy();
      }
      if (cashFlowComponentsInstance.current) {
        cashFlowComponentsInstance.current.destroy();
      }
      if (valuationMethodComparisonInstance.current) {
        valuationMethodComparisonInstance.current.destroy();
      }
      if (sensitivityAnalysisInstance.current) {
        sensitivityAnalysisInstance.current.destroy();
      }
      if (ratiosChartInstance.current) {
        ratiosChartInstance.current.destroy();
      }
    };
  }, [selectedIndustry, activeTab, selectedValuationTab]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-800 mb-3 md:mb-0">Analysis Charts</h2>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 gap-4">
          <div className="flex gap-2 flex-wrap">
            <button 
              className={`px-3 py-1.5 rounded text-sm font-medium ${activeTab === 'financial' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'}`}
              onClick={() => setActiveTab('financial')}
            >
              Financial Performance
            </button>
            <button 
              className={`px-3 py-1.5 rounded text-sm font-medium ${activeTab === 'industry' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'}`}
              onClick={() => setActiveTab('industry')}
            >
              Industry Comparison
            </button>
            <button 
              className={`px-3 py-1.5 rounded text-sm font-medium ${activeTab === 'advanced' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'}`}
              onClick={() => setActiveTab('advanced')}
            >
              Advanced Analysis
            </button>
            <button 
              className={`px-3 py-1.5 rounded text-sm font-medium ${activeTab === 'ratios' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700'}`}
              onClick={() => setActiveTab('ratios')}
            >
              Financial Ratios
            </button>
          </div>
          
          {activeTab === 'industry' && (
            <div className="relative">
              <select
                id="industry-chart-selector"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="py-2 pl-3 pr-10 border border-neutral-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="financial">Financial Services</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <div className="relative">
              <select
                id="advanced-chart-selector"
                value={selectedValuationTab}
                onChange={(e) => setSelectedValuationTab(e.target.value)}
                className="py-2 pl-3 pr-10 border border-neutral-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="overview">Overview</option>
                <option value="balance">Balance Sheet Composition</option>
                <option value="cashflow">Cash Flow Components</option>
                <option value="valuation">Valuation Methods</option>
                <option value="sensitivity">Sensitivity Analysis</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {activeTab === 'financial' ? (
        <div className="space-y-8">
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
              <canvas ref={revenueChartRef}></canvas>
            </div>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
              <canvas ref={profitabilityChartRef}></canvas>
            </div>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
              <canvas ref={marginChartRef}></canvas>
            </div>
          </div>
          
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
              <canvas ref={growthChartRef}></canvas>
            </div>
          </div>
        </div>
      ) : activeTab === 'industry' ? (
        <div className="space-y-8">
          <div className="border border-neutral-200 rounded-lg p-4">
            <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
              <canvas ref={industryComparisonChartRef}></canvas>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-neutral-800">Growth Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Revenue Growth</span>
                    <div className="flex items-center">
                      <span className="font-medium">{projectedData.revenue[0] && projectedData.revenue[1] ? (((projectedData.revenue[1] - projectedData.revenue[0]) / projectedData.revenue[0]) * 100).toFixed(1) : 0}%</span>
                      <span className="text-xs ml-2 text-neutral-500">vs {industryData[selectedIndustry as keyof typeof industryData].growth.revenue}% Industry</span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-neutral-200">
                      <div
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                        style={{ width: `${projectedData.revenue[0] && projectedData.revenue[1] ? (((projectedData.revenue[1] - projectedData.revenue[0]) / projectedData.revenue[0]) * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Earnings Growth</span>
                    <div className="flex items-center">
                      <span className="font-medium">{projectedData.netIncome[0] && projectedData.netIncome[1] ? (((projectedData.netIncome[1] - projectedData.netIncome[0]) / projectedData.netIncome[0]) * 100).toFixed(1) : 0}%</span>
                      <span className="text-xs ml-2 text-neutral-500">vs {industryData[selectedIndustry as keyof typeof industryData].growth.earnings}% Industry</span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-neutral-200">
                      <div
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary"
                        style={{ width: `${projectedData.netIncome[0] && projectedData.netIncome[1] ? (((projectedData.netIncome[1] - projectedData.netIncome[0]) / projectedData.netIncome[0]) * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-neutral-800">Valuation Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-50 rounded-md">
                  <div className="text-sm text-neutral-600">P/E Ratio</div>
                  <div className="text-xl font-bold text-primary">{25}x</div>
                  <div className="text-xs text-neutral-500">Industry: {industryData[selectedIndustry as keyof typeof industryData].metrics.peRatio}x</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-md">
                  <div className="text-sm text-neutral-600">EV/EBITDA</div>
                  <div className="text-xl font-bold text-primary">{12}x</div>
                  <div className="text-xs text-neutral-500">Industry: {industryData[selectedIndustry as keyof typeof industryData].metrics.evEbitda}x</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-md">
                  <div className="text-sm text-neutral-600">Debt/Equity</div>
                  <div className="text-xl font-bold text-primary">{0.6}</div>
                  <div className="text-xs text-neutral-500">Industry: {industryData[selectedIndustry as keyof typeof industryData].metrics.debtToEquity}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-md">
                  <div className="text-sm text-neutral-600">ROE</div>
                  <div className="text-xl font-bold text-primary">{(projectedData.netIncome[projectedData.netIncome.length - 1] / 3700 * 100).toFixed(1)}%</div>
                  <div className="text-xs text-neutral-500">Industry: {15}%</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-neutral-800">Peer Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span>Company Positioning</span>
                  <span className="px-2 py-1 bg-success/10 text-success rounded-md text-xs font-medium">Above Average</span>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Gross Margin Percentile</div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-neutral-200">
                      <div
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 mt-1">
                      <span>Industry Min</span>
                      <span>Your Company</span>
                      <span>Industry Max</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-1">Earnings Growth Percentile</div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-neutral-200">
                      <div
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 mt-1">
                      <span>Industry Min</span>
                      <span>Your Company</span>
                      <span>Industry Max</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'advanced' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Balance Sheet Composition */}
            {(selectedValuationTab === 'overview' || selectedValuationTab === 'balance') && (
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-neutral-800">Balance Sheet Composition (2025)</h3>
                <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                  <canvas ref={balanceSheetCompositionRef}></canvas>
                </div>
                <div className="mt-4 text-sm text-neutral-600">
                  <p>This chart shows the breakdown of assets, liabilities, and equity, giving a visual representation of the company's financial structure.</p>
                </div>
              </div>
            )}
            
            {/* Cash Flow Components */}
            {(selectedValuationTab === 'overview' || selectedValuationTab === 'cashflow') && (
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-neutral-800">Cash Flow Components</h3>
                <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                  <canvas ref={cashFlowComponentsRef}></canvas>
                </div>
                <div className="mt-4 text-sm text-neutral-600">
                  <p>This chart breaks down cash flow into operating, investing, and financing components, showing how cash is generated and used over time.</p>
                </div>
              </div>
            )}
            
            {/* Valuation Method Comparison */}
            {(selectedValuationTab === 'overview' || selectedValuationTab === 'valuation') && (
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-neutral-800">Valuation Method Comparison</h3>
                <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                  <canvas ref={valuationMethodComparisonRef}></canvas>
                </div>
                <div className="mt-4 text-sm text-neutral-600">
                  <p>This chart compares different valuation approaches (DCF, EBITDA Multiple, Revenue Multiple, etc.) to provide a range of company valuations.</p>
                </div>
              </div>
            )}
            
            {/* Sensitivity Analysis */}
            {(selectedValuationTab === 'overview' || selectedValuationTab === 'sensitivity') && (
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-neutral-800">Sensitivity Analysis: WACC vs. Terminal Growth</h3>
                <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                  <canvas ref={sensitivityAnalysisRef}></canvas>
                </div>
                <div className="mt-4 text-sm text-neutral-600">
                  <p>This analysis shows how company valuation changes with different assumptions about WACC (Weighted Average Cost of Capital) and terminal growth rates.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'ratios' ? (
        <div className="space-y-8">
          <div className="border border-neutral-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-neutral-800">Key Financial Ratios</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                <h4 className="text-sm text-neutral-500 mb-1">Return on Equity (ROE)</h4>
                <p className="text-2xl font-bold text-primary">14.2%</p>
                <p className="text-xs text-neutral-500 mt-1">Net Income / Shareholder's Equity</p>
                <div className="text-xs text-neutral-600 mt-2">Measures how efficiently company generates profits from shareholders' investments</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                <h4 className="text-sm text-neutral-500 mb-1">Return on Assets (ROA)</h4>
                <p className="text-2xl font-bold text-primary">8.7%</p>
                <p className="text-xs text-neutral-500 mt-1">Net Income / Total Assets</p>
                <div className="text-xs text-neutral-600 mt-2">Indicates how efficiently assets are being used to generate profits</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                <h4 className="text-sm text-neutral-500 mb-1">Current Ratio</h4>
                <p className="text-2xl font-bold text-primary">2.4</p>
                <p className="text-xs text-neutral-500 mt-1">Current Assets / Current Liabilities</p>
                <div className="text-xs text-neutral-600 mt-2">Measures company's ability to pay short-term obligations</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                <h4 className="text-sm text-neutral-500 mb-1">Debt-to-Equity Ratio</h4>
                <p className="text-2xl font-bold text-primary">0.6</p>
                <p className="text-xs text-neutral-500 mt-1">Total Debt / Shareholder's Equity</p>
                <div className="text-xs text-neutral-600 mt-2">Shows how much debt company is using to finance operations relative to equity</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                <h4 className="text-sm text-neutral-500 mb-1">Asset Turnover Ratio</h4>
                <p className="text-2xl font-bold text-primary">1.2</p>
                <p className="text-xs text-neutral-500 mt-1">Revenue / Average Total Assets</p>
                <div className="text-xs text-neutral-600 mt-2">Measures efficiency of asset use to generate revenue</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                <h4 className="text-sm text-neutral-500 mb-1">Profit Margin</h4>
                <p className="text-2xl font-bold text-primary">16.9%</p>
                <p className="text-xs text-neutral-500 mt-1">Net Income / Revenue</p>
                <div className="text-xs text-neutral-600 mt-2">Shows what percentage of revenue is converted to profit</div>
              </div>
            </div>
            
            <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
              <h3 className="text-md font-semibold mb-4">Ratio Trends (2022-2025)</h3>
              <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                <canvas ref={ratiosChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
