// Financial Data Types
export type FinancialYear = '2022' | '2023' | '2024';
export type ProjectionYear = '2025' | '2026' | '2027' | '2028' | '2029' | '2030' | '2031' | '2032';
export type AllYears = FinancialYear | ProjectionYear;

export interface FinancialData {
  [field: string]: number | null;
}

export interface HistoricalData {
  incomeStatement: Record<FinancialYear, FinancialData>;
  balanceSheet: Record<FinancialYear, FinancialData>;
  cashFlow: Record<FinancialYear, FinancialData>;
}

export interface ProjectionParams {
  revenueGrowth: number;
  grossMargin: number;
  sgaPercent: number;
  rdPercent: number;
  capexPercent: number;
  taxRate: number;
  wcPercent: number;
}

export interface ProjectedData {
  incomeStatement: Record<ProjectionYear, FinancialData>;
  balanceSheet: Record<ProjectionYear, FinancialData>;
  cashFlow: Record<ProjectionYear, FinancialData>;
}

// Industry data types
export type IndustryType = 'tech' | 'healthcare' | 'retail' | 'manufacturing' | 'financial' | 'energy' | 'telecom' | 'real_estate';

export interface IndustryFinancialData {
  name: string;
  revenue: number[];
  cogs: number[];
  expenses: Record<string, number[]>;
  assets: Record<string, number[]>;
  liabilities: Record<string, number[]>;
}

export interface ValidationError {
  message: string;
  fields?: string[];
}

// Language types
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

export type TabId = 'historical' | 'projections' | 'valuation' | 'investment' | 'working-capital' | 'monthly-cash-flow' | 'reports' | 'charts';
