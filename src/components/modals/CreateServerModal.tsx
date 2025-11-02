import { useState } from 'react';
import { createServer } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServerCreated: () => void;
}

const CreateServerModal = ({ isOpen, onClose, onServerCreated }: CreateServerModalProps) => {
  const [serverName, setServerName] = useState('');
  const [serverIcon, setServerIcon] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!serverName.trim()) {
      setError('Server name is required');
      return;
    }

    setIsCreating(true);
    setError('');

    const server = await createServer(serverName.trim(), serverIcon.trim() || undefined);

    if (server) {
      setServerName('');
      setServerIcon('');
      onServerCreated();
      onClose();
    } else {
      setError('Failed to create server. Please try again.');
    }

    setIsCreating(false);
  };

  const handleClose = () => {
    if (!isCreating) {
      setServerName('');
      setServerIcon('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#313338] border-[#1E1F22] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Create Your Server</DialogTitle>
          <DialogDescription className="text-[#B5BAC1] text-center">
            Your server is where you and your friends hang out. Make yours and start talking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="serverName" className="text-[#B5BAC1] uppercase text-xs font-semibold">
              Server Name
            </Label>
            <Input
              id="serverName"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="My Awesome Server"
              className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2]"
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverIcon" className="text-[#B5BAC1] uppercase text-xs font-semibold">
              Server Icon URL (Optional)
            </Label>
            <Input
              id="serverIcon"
              value={serverIcon}
              onChange={(e) => setServerIcon(e.target.value)}
              placeholder="https://example.com/icon.png"
              className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2]"
              disabled={isCreating}
            />
          </div>

          {error && (
            <Alert className="bg-[#F23F42] border-[#F23F42]">
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isCreating}
            className="text-white hover:bg-[#4E5058]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
          >
            {isCreating ? 'Creating...' : 'Create Server'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;
