
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showNotification } from '@/components/ui/notification';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Save, Download, FileCheck } from 'lucide-react';

interface SaveLoadProjectProps {
  onSave: () => Promise<any>;
  onLoad: () => Promise<any>;
}

export default function SaveLoadProject({ onSave, onLoad }: SaveLoadProjectProps) {
  const { userId } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState('');

  // Fetch saved projects on component mount
  useEffect(() => {
    const fetchSavedProjects = async () => {
      try {
        const response = await fetch('/api/saved-projects');
        const data = await response.json();
        if (data.error) {
          console.error('Error fetching saved projects:', data.error);
          setSavedProjects([]);
        } else {
          setSavedProjects(data || []);
        }
      } catch (error) {
        console.error('Error fetching saved projects:', error);
        setSavedProjects([]);
      }
    };
    fetchSavedProjects();
  }, []);

  const handleSave = async () => {
    if (!userId) {
      showNotification('Please log in to save your project', 'error');
      return;
    }

    if (!fileName.trim()) {
      showNotification('Please enter a file name', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
      showNotification('Project saved successfully', 'success');
      setIsSaveDialogOpen(false);
      setFileName('');
    } catch (error) {
      console.error('Error saving project:', error);
      showNotification('Failed to save project', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    if (!userId) {
      showNotification('Please log in to load a project', 'error');
      return;
    }

    if (!selectedProject) {
      showNotification('Please select a project to load', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await onLoad();
      showNotification('Project loaded successfully', 'success');
      setIsLoadDialogOpen(false);
      setSelectedProject('');
    } catch (error) {
      console.error('Error loading project:', error);
      showNotification('Failed to load project', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Save Project Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
            <DialogDescription>
              Enter a name for your project and save your current financial model.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="fileName" className="text-sm font-medium">Project Name</label>
              <Input
                id="fileName"
                placeholder="Enter project name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Project Dialog */}
      <Dialog open={isLoadDialogOpen} onOpenChange={setIsLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Load</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Project</DialogTitle>
            <DialogDescription>
              Select a previously saved project to load.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="projectSelect" className="text-sm font-medium">Select Project</label>
              <select
                id="projectSelect"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select a project</option>
                {savedProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLoadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLoad} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Load Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
