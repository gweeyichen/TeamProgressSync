import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function WeeklyReports() {
  const { toast } = useToast();
  const [selectedProjects, setSelectedProjects] = useState<string[]>(["Website Redesign", "Mobile App Development"]);
  const [reportDay, setReportDay] = useState<string>("Friday");
  const [reportTime, setReportTime] = useState<string>("16:00");
  const [reportTitle, setReportTitle] = useState<string>("Weekly Progress Report - {{week}} ({{date_range}})");
  const [includedSections, setIncludedSections] = useState({
    summary: true,
    completed: true,
    progress: true,
    upcoming: true,
    blockers: true,
    metrics: true
  });
  
  // Handle multi-select for projects
  const handleProjectSelection = (project: string) => {
    if (selectedProjects.includes(project)) {
      setSelectedProjects(selectedProjects.filter(p => p !== project));
    } else {
      setSelectedProjects([...selectedProjects, project]);
    }
  };
  
  // Handle checkbox changes for sections
  const handleSectionToggle = (section: keyof typeof includedSections) => {
    setIncludedSections({
      ...includedSections,
      [section]: !includedSections[section]
    });
  };
  
  // Handle report distribution
  const handleDistribute = (method: string) => {
    toast({
      title: "Report Distribution",
      description: `Report will be distributed via ${method}`,
      variant: "default"
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-neutral-800 mb-6">Weekly Progress Reports</h2>
      
      {/* Project Management Tool Integration */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">Project Management Tool Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex items-center">
            <img src="https://cdn.worldvectorlogo.com/logos/jira-1.svg" alt="Jira Logo" className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-medium text-neutral-800">Jira</h4>
              <p className="text-xs text-neutral-600">Connect to Jira issues and sprints</p>
            </div>
            <button 
              className="ml-auto bg-primary text-white text-xs py-1 px-3 rounded"
              onClick={() => {
                toast({
                  title: "Jira Connection",
                  description: "Connecting to Jira...",
                  variant: "default"
                });
              }}
            >
              Connect
            </button>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex items-center">
            <img src="https://cdn.worldvectorlogo.com/logos/asana-logo.svg" alt="Asana Logo" className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-medium text-neutral-800">Asana</h4>
              <p className="text-xs text-neutral-600">Connect to Asana tasks and projects</p>
            </div>
            <button 
              className="ml-auto bg-primary text-white text-xs py-1 px-3 rounded"
              onClick={() => {
                toast({
                  title: "Asana Connection",
                  description: "Connecting to Asana...",
                  variant: "default"
                });
              }}
            >
              Connect
            </button>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex items-center">
            <img src="https://cdn.worldvectorlogo.com/logos/trello.svg" alt="Trello Logo" className="h-8 w-8 mr-3" />
            <div>
              <h4 className="font-medium text-neutral-800">Trello</h4>
              <p className="text-xs text-neutral-600">Connect to Trello boards and cards</p>
            </div>
            <div className="ml-auto flex items-center text-success text-sm">
              <i className="ri-check-line mr-1"></i>
              Connected
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Configuration */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Projects to Include</label>
            <select 
              multiple 
              className="form-multiselect block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
              value={selectedProjects}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedProjects(options);
              }}
            >
              <option value="Website Redesign">Website Redesign</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="API Integration">API Integration</option>
              <option value="Database Migration">Database Migration</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Report Schedule</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Day of Week</label>
                <select 
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                  value={reportDay}
                  onChange={(e) => setReportDay(e.target.value)}
                >
                  <option value="Monday">Monday</option>
                  <option value="Friday">Friday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Time (24h)</label>
                <input 
                  type="time" 
                  value={reportTime} 
                  onChange={(e) => setReportTime(e.target.value)}
                  className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Template */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">Report Template</h3>
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Report Title Format</label>
            <input 
              type="text" 
              value={reportTitle} 
              onChange={(e) => setReportTitle(e.target.value)}
              className="block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Sections to Include</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  id="section-summary" 
                  type="checkbox" 
                  checked={includedSections.summary}
                  onChange={() => handleSectionToggle('summary')}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="section-summary" className="ml-2 block text-sm text-neutral-700">Executive Summary</label>
              </div>
              <div className="flex items-center">
                <input 
                  id="section-completed" 
                  type="checkbox" 
                  checked={includedSections.completed}
                  onChange={() => handleSectionToggle('completed')}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="section-completed" className="ml-2 block text-sm text-neutral-700">Completed Tasks</label>
              </div>
              <div className="flex items-center">
                <input 
                  id="section-progress" 
                  type="checkbox" 
                  checked={includedSections.progress}
                  onChange={() => handleSectionToggle('progress')}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="section-progress" className="ml-2 block text-sm text-neutral-700">In-Progress Tasks</label>
              </div>
              <div className="flex items-center">
                <input 
                  id="section-upcoming" 
                  type="checkbox" 
                  checked={includedSections.upcoming}
                  onChange={() => handleSectionToggle('upcoming')}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="section-upcoming" className="ml-2 block text-sm text-neutral-700">Upcoming Tasks</label>
              </div>
              <div className="flex items-center">
                <input 
                  id="section-blockers" 
                  type="checkbox" 
                  checked={includedSections.blockers}
                  onChange={() => handleSectionToggle('blockers')}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="section-blockers" className="ml-2 block text-sm text-neutral-700">Blockers & Issues</label>
              </div>
              <div className="flex items-center">
                <input 
                  id="section-metrics" 
                  type="checkbox" 
                  checked={includedSections.metrics}
                  onChange={() => handleSectionToggle('metrics')}
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                />
                <label htmlFor="section-metrics" className="ml-2 block text-sm text-neutral-700">Key Metrics & KPIs</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">Report Preview</h3>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-neutral-800">Weekly Progress Report - Week 24 (Jun 10-16, 2023)</h4>
              <div className="text-sm text-neutral-500">Generated on Jun 16, 2023</div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <div className="prose max-w-none text-sm text-neutral-700">
              {includedSections.summary && (
                <>
                  <h5 className="font-medium text-neutral-800 mb-2">Executive Summary</h5>
                  <p className="mb-4">This week the team made significant progress on the {selectedProjects.includes("Website Redesign") ? "Website Redesign" : ""} project, completing 14 tasks and moving 8 into review. {selectedProjects.includes("Mobile App Development") ? "Mobile App Development" : ""} faced some challenges with API integration that delayed two features until next sprint.</p>
                </>
              )}
              
              {includedSections.completed && (
                <>
                  <h5 className="font-medium text-neutral-800 mb-2">Completed Tasks (14)</h5>
                  <ul className="list-disc pl-5 mb-4">
                    <li>Implement responsive navigation menu</li>
                    <li>Create user profile page components</li>
                    <li>Fix login form validation issues</li>
                    <li>Update product catalog styling</li>
                    <li>Optimize image loading performance</li>
                  </ul>
                </>
              )}
              
              {includedSections.metrics && (
                <>
                  <h5 className="font-medium text-neutral-800 mb-2">Key Metrics</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="p-3 bg-neutral-50 rounded-md text-center">
                      <div className="text-xl font-bold text-primary">87%</div>
                      <div className="text-xs text-neutral-600">Sprint Completion</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-md text-center">
                      <div className="text-xl font-bold text-success">+5</div>
                      <div className="text-xs text-neutral-600">Velocity Change</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-md text-center">
                      <div className="text-xl font-bold text-primary">3.2</div>
                      <div className="text-xs text-neutral-600">Days per Story</div>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-md text-center">
                      <div className="text-xl font-bold text-accent">2</div>
                      <div className="text-xs text-neutral-600">Active Blockers</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Distribution Options */}
      <div className="border-t border-neutral-200 pt-6">
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">Distribution Options</h3>
        <div className="flex flex-wrap gap-3">
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => handleDistribute('Email')}
          >
            <i className="ri-mail-line mr-1"></i>
            Email Report
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            onClick={() => handleDistribute('Slack')}
          >
            <i className="ri-slack-line mr-1"></i>
            Send to Slack
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => handleDistribute('PDF')}
          >
            <i className="ri-download-line mr-1"></i>
            Download PDF
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => handleDistribute('Link')}
          >
            <i className="ri-share-line mr-1"></i>
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
}
