import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Mic, Headphones, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface UserBarProps {
  onOpenSettings: () => void;
}

const UserBar = ({ onOpenSettings }: UserBarProps) => {
  const { currentUser } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  if (!currentUser) return null;

  const getInitials = () => {
    return currentUser.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-[#232428] px-2 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback className="bg-[#5865F2] text-white text-xs">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold truncate">
            {currentUser.username}
          </div>
          <div className="text-[#B5BAC1] text-xs truncate">
            #{currentUser.incordes_id?.split('#')[1] || '0001'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
                onClick={() => setIsMuted(!isMuted)}
              >
                <Mic className={`h-4 w-4 ${isMuted ? 'text-red-500' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isMuted ? 'Unmute' : 'Mute'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
                onClick={() => setIsDeafened(!isDeafened)}
              >
                <Headphones className={`h-4 w-4 ${isDeafened ? 'text-red-500' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isDeafened ? 'Undeafen' : 'Deafen'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#B5BAC1] hover:text-white hover:bg-[#35373C]"
                onClick={onOpenSettings}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>User Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default UserBar;
