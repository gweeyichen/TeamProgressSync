import { Dispatch, SetStateAction } from 'react';
import { TabId } from '@/lib/types';

interface TabNavigationProps {
  activeTab: TabId;
  setActiveTab: Dispatch<SetStateAction<TabId>>;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'historical', label: 'Historical Financials' },
    { id: 'projections', label: 'Financial Projections' },
    { id: 'valuation', label: 'Company Valuation' },
    { id: 'investment', label: 'Investment Modeling' },
    { id: 'working-capital', label: 'Working Capital', icon: 'ri-exchange-funds-line' },
    { id: 'monthly-cash-flow', label: 'Monthly Cash Flow', icon: 'ri-funds-line' },
    { id: 'reports', label: 'Weekly Reports', icon: 'ri-file-chart-line' },
    { id: 'charts', label: 'Analysis Charts' }
  ];
  
  return (
    <div className="mb-6 border-b border-neutral-300">
      <nav className="flex flex-wrap -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-tab={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as TabId)}
          >
            {tab.icon && <i className={`${tab.icon} mr-1`}></i>}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
