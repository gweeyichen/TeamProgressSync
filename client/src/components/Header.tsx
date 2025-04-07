import { useState } from 'react';
import { Language } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const [language, setLanguage] = useState<Language>('en');
  const { toast } = useToast();
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    setLanguage(newLanguage);
    
    const languageNames = {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      zh: "中文"
    };
    
    toast({
      title: "Language Changed",
      description: `Language changed to ${languageNames[newLanguage]}`,
    });
  };
  
  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated for download",
    });
    // Actual export logic would go here
  };
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <i className="ri-line-chart-line text-2xl mr-2"></i>
            <h1 className="text-2xl font-bold">Financial Projection & Valuation Tool</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select 
                id="language-selector" 
                value={language}
                onChange={handleLanguageChange}
                className="bg-primary-light text-white py-1 pl-3 pr-8 rounded-md border border-primary-light appearance-none cursor-pointer text-sm"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <i className="ri-arrow-down-s-line"></i>
              </div>
            </div>
            <button 
              onClick={handleExportReport}
              className="bg-white text-primary hover:bg-neutral-100 px-3 py-1 rounded-md text-sm font-medium flex items-center"
            >
              <i className="ri-file-download-line mr-1"></i>
              <span>Export Report</span>
            </button>
          </div>
        </div>
        <p className="text-white/80 mt-1">Comprehensive financial modeling with multi-language support</p>
      </div>
    </header>
  );
}
