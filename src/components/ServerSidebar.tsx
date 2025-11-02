import { useState, useEffect } from 'react';
import { Server, getServers } from '@/lib/api';
import { Home, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServerSidebarProps {
  selectedServerId: string | null;
  onSelectServer: (serverId: string | null) => void;
  onCreateServer: () => void;
  onRefresh?: () => void;
}

const ServerSidebar = ({ selectedServerId, onSelectServer, onCreateServer, onRefresh }: ServerSidebarProps) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadServers = async () => {
    setIsLoading(true);
    const fetchedServers = await getServers();
    setServers(fetchedServers);
    setIsLoading(false);
  };

  useEffect(() => {
    loadServers();
  }, [onRefresh]);

  const getServerInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={`h-12 w-12 rounded-full p-0 ${
                selectedServerId === null
                  ? 'bg-[#5865F2] text-white'
                  : 'bg-[#313338] text-[#B5BAC1] hover:bg-[#5865F2] hover:text-white hover:rounded-2xl'
              } transition-all duration-200`}
              onClick={() => onSelectServer(null)}
            >
              <Home className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-8 h-[2px] bg-[#35373C] rounded-full my-1" />

      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center gap-2 px-3">
          {isLoading ? (
            <div className="text-[#B5BAC1] text-xs">Loading...</div>
          ) : (
            servers.map((server) => (
              <TooltipProvider key={server.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`h-12 w-12 rounded-full p-0 ${
                        selectedServerId === server.id
                          ? 'rounded-2xl'
                          : 'hover:rounded-2xl'
                      } transition-all duration-200`}
                      onClick={() => onSelectServer(server.id)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={server.icon} />
                        <AvatarFallback className="bg-[#313338] text-white">
                          {getServerInitials(server.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{server.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-12 w-12 rounded-full p-0 bg-[#313338] text-[#3BA55D] hover:bg-[#3BA55D] hover:text-white hover:rounded-2xl transition-all duration-200"
                  onClick={onCreateServer}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Add a Server</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
