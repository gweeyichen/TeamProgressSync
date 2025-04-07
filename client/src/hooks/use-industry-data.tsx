import { useState } from 'react';
import { IndustryType, IndustryFinancialData } from '@/lib/types';

const industryData: Record<IndustryType, IndustryFinancialData> = {
  tech: {
    name: "Technology",
    revenue: [4800, 6200, 8500],
    cogs: [1680, 2108, 2805],
    expenses: {
      "Research & Development": [960, 1240, 1785],
      "Sales & Marketing": [1200, 1550, 2125],
      "General & Administrative": [720, 930, 1275]
    },
    assets: {
      "Cash & Equivalents": [1200, 1800, 2600],
      "Accounts Receivable": [800, 1100, 1500],
      "Property & Equipment": [2400, 3000, 3600],
      "Intangible Assets": [1600, 2200, 2800]
    },
    liabilities: {
      "Accounts Payable": [600, 800, 1100],
      "Short-term Debt": [400, 600, 800],
      "Long-term Debt": [1800, 2400, 2800]
    }
  },
  healthcare: {
    name: "Healthcare",
    revenue: [7200, 8400, 9800],
    cogs: [2880, 3276, 3724],
    expenses: {
      "Research & Development": [1440, 1680, 1960],
      "Sales & Marketing": [1080, 1260, 1470],
      "General & Administrative": [1080, 1260, 1470]
    },
    assets: {
      "Cash & Equivalents": [1800, 2100, 2450],
      "Accounts Receivable": [1400, 1650, 1900],
      "Property & Equipment": [3600, 4200, 4900],
      "Intangible Assets": [2000, 2300, 2700]
    },
    liabilities: {
      "Accounts Payable": [900, 1050, 1200],
      "Short-term Debt": [600, 700, 800],
      "Long-term Debt": [2400, 2800, 3200]
    }
  },
  retail: {
    name: "Retail",
    revenue: [9500, 10300, 11200],
    cogs: [5700, 6180, 6720],
    expenses: {
      "Research & Development": [380, 412, 448],
      "Sales & Marketing": [1900, 2060, 2240],
      "General & Administrative": [950, 1030, 1120]
    },
    assets: {
      "Cash & Equivalents": [1400, 1600, 1800],
      "Accounts Receivable": [500, 600, 700],
      "Inventory": [3800, 4100, 4500],
      "Property & Equipment": [4800, 5200, 5600]
    },
    liabilities: {
      "Accounts Payable": [2000, 2200, 2400],
      "Short-term Debt": [1000, 1100, 1200],
      "Long-term Debt": [3500, 3800, 4100]
    }
  },
  manufacturing: {
    name: "Manufacturing",
    revenue: [12000, 13200, 14500],
    cogs: [7800, 8580, 9425],
    expenses: {
      "Research & Development": [960, 1056, 1160],
      "Sales & Marketing": [1200, 1320, 1450],
      "General & Administrative": [1800, 1980, 2175]
    },
    assets: {
      "Cash & Equivalents": [2000, 2200, 2500],
      "Accounts Receivable": [3000, 3300, 3600],
      "Inventory": [4500, 5000, 5500],
      "Property & Equipment": [8000, 8800, 9700]
    },
    liabilities: {
      "Accounts Payable": [2500, 2750, 3000],
      "Short-term Debt": [1500, 1650, 1800],
      "Long-term Debt": [6000, 6600, 7200]
    }
  },
  financial: {
    name: "Financial Services",
    revenue: [15000, 16500, 18200],
    cogs: [4500, 4950, 5460],
    expenses: {
      "Research & Development": [750, 825, 910],
      "Sales & Marketing": [2250, 2475, 2730],
      "General & Administrative": [3000, 3300, 3640]
    },
    assets: {
      "Cash & Equivalents": [25000, 27500, 30000],
      "Accounts Receivable": [8000, 8800, 9700],
      "Investments": [75000, 82500, 90000],
      "Loans Receivable": [120000, 132000, 145000],
      "Property & Equipment": [4000, 4200, 4400]
    },
    liabilities: {
      "Accounts Payable": [5000, 5500, 6000],
      "Deposits": [150000, 165000, 180000],
      "Short-term Debt": [15000, 16500, 18000],
      "Long-term Debt": [45000, 49500, 54000]
    }
  },
  energy: {
    name: "Energy",
    revenue: [22000, 24200, 26000],
    cogs: [13200, 14520, 15600],
    expenses: {
      "Research & Development": [1100, 1210, 1300],
      "Sales & Marketing": [880, 968, 1040],
      "General & Administrative": [2200, 2420, 2600]
    },
    assets: {
      "Cash & Equivalents": [4000, 4400, 4700],
      "Accounts Receivable": [3300, 3630, 3900],
      "Inventory": [2200, 2420, 2600],
      "Property & Equipment": [35000, 38500, 41500]
    },
    liabilities: {
      "Accounts Payable": [3000, 3300, 3550],
      "Short-term Debt": [2500, 2750, 2950],
      "Long-term Debt": [15000, 16500, 17750]
    }
  },
  telecom: {
    name: "Telecommunications",
    revenue: [18000, 19800, 21600],
    cogs: [7200, 7920, 8640],
    expenses: {
      "Research & Development": [1800, 1980, 2160],
      "Sales & Marketing": [3600, 3960, 4320],
      "General & Administrative": [2700, 2970, 3240]
    },
    assets: {
      "Cash & Equivalents": [3000, 3300, 3600],
      "Accounts Receivable": [4500, 4950, 5400],
      "Inventory": [900, 990, 1080],
      "Property & Equipment": [30000, 33000, 36000]
    },
    liabilities: {
      "Accounts Payable": [2700, 2970, 3240],
      "Short-term Debt": [3600, 3960, 4320],
      "Long-term Debt": [18000, 19800, 21600]
    }
  },
  real_estate: {
    name: "Real Estate",
    revenue: [9000, 9900, 10800],
    cogs: [3600, 3960, 4320],
    expenses: {
      "Research & Development": [270, 297, 324],
      "Sales & Marketing": [1350, 1485, 1620],
      "General & Administrative": [1800, 1980, 2160]
    },
    assets: {
      "Cash & Equivalents": [2000, 2200, 2400],
      "Accounts Receivable": [900, 990, 1080],
      "Inventory": [0, 0, 0],
      "Property & Equipment": [45000, 49500, 54000]
    },
    liabilities: {
      "Accounts Payable": [1200, 1320, 1440],
      "Short-term Debt": [3000, 3300, 3600],
      "Long-term Debt": [27000, 29700, 32400]
    }
  }
};

// Calculate industry-specific projection parameters
export function getIndustryParams(industry: IndustryType) {
  const data = industryData[industry];
  
  // Calculate average growth rate from revenue data (3 years)
  const years = data.revenue.length;
  const revenueGrowth = years > 1 
    ? Math.round((data.revenue[years-1] / data.revenue[0] - 1) * 100 / (years - 1)) 
    : 10;
  
  // Calculate gross margin from latest year
  const latestRevenue = data.revenue[years-1];
  const latestCOGS = data.cogs[years-1];
  const grossMargin = Math.round((1 - latestCOGS / latestRevenue) * 100);
  
  // Calculate SG&A as percentage of revenue
  const salesMarketing = data.expenses["Sales & Marketing"]?.[years-1] || 0;
  const generalAdmin = data.expenses["General & Administrative"]?.[years-1] || 0;
  const sgaPercent = Math.round(((salesMarketing + generalAdmin) / latestRevenue) * 100);
  
  // Calculate R&D as percentage of revenue
  const rd = data.expenses["Research & Development"]?.[years-1] || 0;
  const rdPercent = Math.round((rd / latestRevenue) * 100);
  
  // Estimate CapEx as percentage of revenue (based on property & equipment growth)
  const propertyEquipment = data.assets["Property & Equipment"]?.[years-1] || 0;
  const prevPropertyEquipment = data.assets["Property & Equipment"]?.[years-2] || propertyEquipment * 0.9;
  const capexPercent = Math.round(((propertyEquipment - prevPropertyEquipment) / latestRevenue) * 100);
  
  // Set tax rate based on industry standards
  let taxRate = 25; // Default corporate tax rate
  if (industry === 'energy') taxRate = 30;
  if (industry === 'financial') taxRate = 22;
  
  // Calculate working capital as percentage of revenue
  const receivables = data.assets["Accounts Receivable"]?.[years-1] || 0;
  const inventory = data.assets["Inventory"]?.[years-1] || 0;
  const payables = data.liabilities["Accounts Payable"]?.[years-1] || 0;
  const wcPercent = Math.round(((receivables + inventory - payables) / latestRevenue) * 100);
  
  return {
    revenueGrowth,
    grossMargin,
    sgaPercent,
    rdPercent,
    capexPercent: capexPercent > 0 ? capexPercent : 5, // Ensure it's at least 5%
    taxRate,
    wcPercent: wcPercent > 0 ? wcPercent : 10 // Ensure it's at least 10%
  };
}

export default function useIndustryData() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null);
  
  const getIndustryData = (industry: IndustryType): IndustryFinancialData => {
    setSelectedIndustry(industry);
    return industryData[industry];
  };
  
  const getAllIndustryData = () => {
    return industryData;
  };
  
  return {
    selectedIndustry,
    getIndustryData,
    getAllIndustryData,
    getIndustryParams
  };
}
