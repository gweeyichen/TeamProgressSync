import { useState } from 'react';
import { IndustryType } from '@/lib/types';
import { showNotification } from './notification';

interface IndustrySelectorProps {
  onSelectIndustry: (industry: IndustryType) => void;
}

export default function IndustrySelector({ onSelectIndustry }: IndustrySelectorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | ''>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as IndustryType | '';
    setSelectedIndustry(value);
    
    if (value) {
      onSelectIndustry(value);
      showNotification('Industry data loaded successfully', 'success');
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="text-sm text-neutral-600">Load sample data:</div>
      <div className="relative w-full sm:w-64">
        <select
          id="industry-selector"
          value={selectedIndustry}
          onChange={handleChange}
          className="w-full py-2 pl-3 pr-10 border border-neutral-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="" disabled>Select Industry</option>
          <option value="tech">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="retail">Retail</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="financial">Financial Services</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
          <i className="ri-arrow-down-s-line"></i>
        </div>
      </div>
    </div>
  );
}
