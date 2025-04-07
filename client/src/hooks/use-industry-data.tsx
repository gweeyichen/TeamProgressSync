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
      "Investments": [75000, 82500, 90000],
      "Loans Receivable": [120000, 132000, 145000],
      "Property & Equipment": [4000, 4200, 4400]
    },
    liabilities: {
      "Deposits": [150000, 165000, 180000],
      "Short-term Debt": [15000, 16500, 18000],
      "Long-term Debt": [45000, 49500, 54000]
    }
  }
};

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
    getAllIndustryData
  };
}
