import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
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

  const handleSave = async () => {
    if (!userId) {
      showNotification('Please log in to save your project', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
      showNotification('Project saved successfully', 'success');
      setIsSaveDialogOpen(false);
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

    setIsLoading(true);
    try {
      await onLoad();
      showNotification('Project loaded successfully', 'success');
      setIsLoadDialogOpen(false);
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
              Save your current financial model to access it later. This will save all your
              historical financials, projections, valuation parameters, and investment models.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <FileCheck className="h-16 w-16 text-primary" />
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
              Load your previously saved financial model. This will replace your current work with the
              saved data. Make sure to save your current work if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <Download className="h-16 w-16 text-primary" />
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