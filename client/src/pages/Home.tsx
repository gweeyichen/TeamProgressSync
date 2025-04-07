import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabNavigation from "@/components/TabNavigation";
import HistoricalFinancials from "@/components/tabs/HistoricalFinancials";
import FinancialProjections from "@/components/tabs/FinancialProjections";
import CompanyValuation from "@/components/tabs/CompanyValuation";
import InvestmentModeling from "@/components/tabs/InvestmentModeling";
import WorkingCapital from "@/components/tabs/WorkingCapital";
import WeeklyReports from "@/components/tabs/WeeklyReports";
import AnalysisCharts from "@/components/tabs/AnalysisCharts";

type TabId = 'historical' | 'projections' | 'valuation' | 'investment' | 'working-capital' | 'reports' | 'charts';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('historical');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="space-y-6">
            <div className={`tab-pane ${activeTab === 'historical' ? 'active' : ''}`}>
              <HistoricalFinancials />
            </div>
            <div className={`tab-pane ${activeTab === 'projections' ? 'active' : ''}`}>
              <FinancialProjections />
            </div>
            <div className={`tab-pane ${activeTab === 'valuation' ? 'active' : ''}`}>
              <CompanyValuation />
            </div>
            <div className={`tab-pane ${activeTab === 'investment' ? 'active' : ''}`}>
              <InvestmentModeling />
            </div>
            <div className={`tab-pane ${activeTab === 'working-capital' ? 'active' : ''}`}>
              <WorkingCapital />
            </div>
            <div className={`tab-pane ${activeTab === 'reports' ? 'active' : ''}`}>
              <WeeklyReports />
            </div>
            <div className={`tab-pane ${activeTab === 'charts' ? 'active' : ''}`}>
              <AnalysisCharts />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
