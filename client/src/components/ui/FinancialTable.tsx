import { useState } from 'react';
import { FinancialYear, FinancialData } from '@/lib/types';

interface FinancialTableProps {
  title: string;
  years: FinancialYear[];
  rows: {
    id: string;
    label: string;
    editable?: boolean;
    type?: 'header' | 'subheader' | 'total' | 'standard';
    tooltip?: string;
    validateField?: boolean;
  }[];
  data: Record<FinancialYear, FinancialData>;
  onDataChange?: (field: string, year: FinancialYear, value: number) => void;
  errors?: Record<string, string[]>;
}

export default function FinancialTable({
  title,
  years,
  rows,
  data,
  onDataChange,
  errors = {}
}: FinancialTableProps) {
  // Format number as currency
  const formatCurrency = (value: number | null): string => {
    if (value === null) return '';
    return value.toLocaleString('en-US');
  };

  // Parse currency input
  const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  };

  // Handle input change
  const handleInputChange = (field: string, year: FinancialYear, value: string) => {
    if (onDataChange) {
      onDataChange(field, year, parseCurrency(value));
    }
  };

  // Check if a field has validation errors
  const hasError = (field: string, year: FinancialYear): boolean => {
    return errors[`${field}_${year}`]?.length > 0 || false;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 text-neutral-800">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-neutral-100 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Line Item</th>
              {years.map(year => (
                <th key={year} className="px-4 py-3 bg-neutral-100 text-right text-xs font-medium text-neutral-600 uppercase tracking-wider">{year}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {rows.map(row => {
              const rowType = row.type || 'standard';
              const isEditable = row.editable !== false;
              const bgClass = rowType === 'header' ? 'bg-neutral-100 font-semibold' :
                            rowType === 'subheader' ? 'bg-neutral-50 font-medium' :
                            rowType === 'total' ? 'bg-neutral-50 font-medium' : 'hover:bg-neutral-50';
              
              return (
                <tr key={row.id} className={bgClass}>
                  <td className="px-4 py-2 text-sm text-neutral-700">
                    <div className="flex items-center">
                      <span>{row.label}</span>
                      {row.tooltip && (
                        <i className="ri-information-line ml-1 text-neutral-400 cursor-pointer" title={row.tooltip}></i>
                      )}
                    </div>
                  </td>
                  
                  {years.map(year => {
                    const value = data[year]?.[row.id] ?? null;
                    const fieldHasError = hasError(row.id, year);
                    
                    return (
                      <td key={`${row.id}_${year}`} className="px-4 py-2 text-sm text-right">
                        {isEditable ? (
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-neutral-500">$</span>
                            </div>
                            <input
                              type="text"
                              className={`financial-input ${fieldHasError ? 'error' : ''}`}
                              value={formatCurrency(value)}
                              onChange={(e) => handleInputChange(row.id, year, e.target.value)}
                              data-field={row.id}
                              data-year={year}
                              data-validate={row.validateField}
                            />
                          </div>
                        ) : (
                          <span className="text-neutral-800">${formatCurrency(value)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
