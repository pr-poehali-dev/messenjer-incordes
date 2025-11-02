import { useState, useEffect } from 'react';
import { Server, Channel, getChannels } from '@/lib/api';
import { Hash, Volume2, Plus, ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ChannelSidebarProps {
  server: Server | null;
  selectedChannelId: string | null;
  onSelectChannel: (channelId: string) => void;
  onCreateChannel: () => void;
}

const ChannelSidebar = ({
  server,
  selectedChannelId,
  onSelectChannel,
  onCreateChannel,
}: ChannelSidebarProps) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [textChannelsOpen, setTextChannelsOpen] = useState(true);
  const [voiceChannelsOpen, setVoiceChannelsOpen] = useState(true);

  useEffect(() => {
    const loadChannels = async () => {
      if (!server) {
        setChannels([]);
        return;
      }

      setIsLoading(true);
      const fetchedChannels = await getChannels(server.id);
      setChannels(fetchedChannels);
      setIsLoading(false);

      // Auto-select first channel if none selected
      if (fetchedChannels.length > 0 && !selectedChannelId) {
        onSelectChannel(fetchedChannels[0].id);
      }
    };

    loadChannels();
  }, [server]);

  if (!server) {
    return (
      <div className="w-60 bg-[#2B2D31] flex flex-col">
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#1E1F22] shadow-md">
          <h2 className="text-white font-semibold">Friends</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 text-[#B5BAC1] text-sm">
            <p>Direct Messages</p>
            <p className="text-xs mt-2 opacity-60">Coming soon...</p>
          </div>
        </ScrollArea>
      </div>
    );
  }

  const textChannels = channels.filter((c) => c.type === 'text');
  const voiceChannels = channels.filter((c) => c.type === 'voice');

  return (
    <div className="w-60 bg-[#2B2D31] flex flex-col">
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#1E1F22] shadow-md hover:bg-[#35373C] cursor-pointer transition-colors">
        <h2 className="text-white font-semibold truncate">{server.name}</h2>
        <ChevronDown className="h-4 w-4 text-[#B5BAC1]" />
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {isLoading ? (
            <div className="px-4 text-[#B5BAC1] text-sm">Loading channels...</div>
          ) : (
            <>
              <Collapsible open={textChannelsOpen} onOpenChange={setTextChannelsOpen}>
                <div className="px-2 py-1 flex items-center justify-between group">
                  <CollapsibleTrigger className="flex items-center gap-1 text-[#B5BAC1] hover:text-white text-xs font-semibold uppercase flex-1">
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        textChannelsOpen ? '' : '-rotate-90'
                      }`}
                    />
                    Text Channels
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 text-[#B5BAC1] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onCreateChannel}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <CollapsibleContent>
                  {textChannels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant="ghost"
                      className={`w-full justify-start px-2 mx-1 my-0.5 h-8 rounded ${
                        selectedChannelId === channel.id
                          ? 'bg-[#404249] text-white'
                          : 'text-[#B5BAC1] hover:bg-[#35373C] hover:text-white'
                      }`}
                      onClick={() => onSelectChannel(channel.id)}
                    >
                      <Hash className="h-4 w-4 mr-1.5" />
                      <span className="truncate">{channel.name}</span>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={voiceChannelsOpen} onOpenChange={setVoiceChannelsOpen}>
                <div className="px-2 py-1 flex items-center justify-between group mt-2">
                  <CollapsibleTrigger className="flex items-center gap-1 text-[#B5BAC1] hover:text-white text-xs font-semibold uppercase flex-1">
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        voiceChannelsOpen ? '' : '-rotate-90'
                      }`}
                    />
                    Voice Channels
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 text-[#B5BAC1] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onCreateChannel}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <CollapsibleContent>
                  {voiceChannels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant="ghost"
                      className="w-full justify-start px-2 mx-1 my-0.5 h-8 rounded text-[#B5BAC1] hover:bg-[#35373C] hover:text-white"
                      onClick={() => onSelectChannel(channel.id)}
                    >
                      <Volume2 className="h-4 w-4 mr-1.5" />
                      <span className="truncate">{channel.name}</span>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-[#1E1F22]">
        <Button
          variant="ghost"
          className="w-full justify-start text-[#B5BAC1] hover:bg-[#35373C] hover:text-white h-8"
        >
          <Settings className="h-4 w-4 mr-2" />
          Server Settings
        </Button>
      </div>
    </div>
  );
};

export default ChannelSidebar;
