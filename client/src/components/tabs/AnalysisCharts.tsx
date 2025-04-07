import { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { FinancialYear, ProjectionYear } from '@/lib/types';

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
  const [selectedIndustry, setSelectedIndustry] = useState<string>("technology");
  const [activeTab, setActiveTab] = useState<string>("financial");
  
  // Chart refs
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
    };
  }, [selectedIndustry]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-800 mb-3 md:mb-0">Analysis Charts</h2>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 gap-4">
          <div className="flex gap-2">
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
      ) : (
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
      )}
    </div>
  );
}
