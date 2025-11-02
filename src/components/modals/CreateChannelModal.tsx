import { useState } from 'react';
import { createChannel } from '@/lib/api';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Hash, Volume2 } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  onChannelCreated: () => void;
}

const CreateChannelModal = ({
  isOpen,
  onClose,
  serverId,
  onChannelCreated,
}: CreateChannelModalProps) => {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!channelName.trim()) {
      setError('Channel name is required');
      return;
    }

    setIsCreating(true);
    setError('');

    const channel = await createChannel(serverId, channelName.trim(), channelType);

    if (channel) {
      setChannelName('');
      setChannelType('text');
      onChannelCreated();
      onClose();
    } else {
      setError('Failed to create channel. Please try again.');
    }

    setIsCreating(false);
  };

  const handleClose = () => {
    if (!isCreating) {
      setChannelName('');
      setChannelType('text');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#313338] border-[#1E1F22] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Channel</DialogTitle>
          <DialogDescription className="text-[#B5BAC1]">
            Create a new channel for your server
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[#B5BAC1] uppercase text-xs font-semibold">
              Channel Type
            </Label>
            <RadioGroup
              value={channelType}
              onValueChange={(value) => setChannelType(value as 'text' | 'voice')}
            >
              <div className="flex items-center space-x-3 bg-[#2B2D31] p-3 rounded-lg hover:bg-[#35373C] cursor-pointer">
                <RadioGroupItem value="text" id="text" />
                <Label
                  htmlFor="text"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Hash className="h-5 w-5 text-[#B5BAC1]" />
                  <div>
                    <div className="text-white font-semibold">Text Channel</div>
                    <div className="text-[#B5BAC1] text-xs">Send messages, images, and more</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 bg-[#2B2D31] p-3 rounded-lg hover:bg-[#35373C] cursor-pointer">
                <RadioGroupItem value="voice" id="voice" />
                <Label
                  htmlFor="voice"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Volume2 className="h-5 w-5 text-[#B5BAC1]" />
                  <div>
                    <div className="text-white font-semibold">Voice Channel</div>
                    <div className="text-[#B5BAC1] text-xs">Hang out with voice or video</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channelName" className="text-[#B5BAC1] uppercase text-xs font-semibold">
              Channel Name
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B5BAC1]">
                {channelType === 'text' ? (
                  <Hash className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </div>
              <Input
                id="channelName"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="new-channel"
                className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2] pl-9"
                disabled={isCreating}
              />
            </div>
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
            {isCreating ? 'Creating...' : 'Create Channel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
