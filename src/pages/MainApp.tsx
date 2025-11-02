import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Server, Channel, getServers, getChannels } from '@/lib/api';
import ServerSidebar from '@/components/ServerSidebar';
import ChannelSidebar from '@/components/ChannelSidebar';
import ChatArea from '@/components/ChatArea';
import UserBar from '@/components/UserBar';
import CreateServerModal from '@/components/modals/CreateServerModal';
import CreateChannelModal from '@/components/modals/CreateChannelModal';
import UserSettingsModal from '@/components/modals/UserSettingsModal';

const MainApp = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, isLoading, navigate]);

  useEffect(() => {
    const loadServers = async () => {
      const fetchedServers = await getServers();
      setServers(fetchedServers);
    };

    if (currentUser) {
      loadServers();
    }
  }, [currentUser, refreshTrigger]);

  useEffect(() => {
    const loadChannels = async () => {
      if (selectedServerId) {
        const fetchedChannels = await getChannels(selectedServerId);
        setChannels(fetchedChannels);

        // Auto-select first channel if none selected
        if (fetchedChannels.length > 0 && !selectedChannelId) {
          setSelectedChannelId(fetchedChannels[0].id);
          setSelectedChannel(fetchedChannels[0]);
        }
      } else {
        setChannels([]);
        setSelectedChannelId(null);
        setSelectedChannel(null);
      }
    };

    loadChannels();
  }, [selectedServerId]);

  useEffect(() => {
    if (selectedServerId) {
      const server = servers.find((s) => s.id === selectedServerId);
      setSelectedServer(server || null);
    } else {
      setSelectedServer(null);
    }
  }, [selectedServerId, servers]);

  useEffect(() => {
    if (selectedChannelId && channels.length > 0) {
      const channel = channels.find((c) => c.id === selectedChannelId);
      setSelectedChannel(channel || null);
    } else {
      setSelectedChannel(null);
    }
  }, [selectedChannelId, channels]);

  const handleServerCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleChannelCreated = async () => {
    if (selectedServerId) {
      const fetchedChannels = await getChannels(selectedServerId);
      setChannels(fetchedChannels);
      if (fetchedChannels.length > 0) {
        const newChannel = fetchedChannels[fetchedChannels.length - 1];
        setSelectedChannelId(newChannel.id);
        setSelectedChannel(newChannel);
      }
    }
  };

  const handleSelectServer = (serverId: string | null) => {
    setSelectedServerId(serverId);
    setSelectedChannelId(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#2B2D31]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-screen flex bg-[#2B2D31] overflow-hidden">
      <ServerSidebar
        selectedServerId={selectedServerId}
        onSelectServer={handleSelectServer}
        onCreateServer={() => setIsCreateServerOpen(true)}
        onRefresh={refreshTrigger}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex-1 flex min-h-0">
          <ChannelSidebar
            server={selectedServer}
            selectedChannelId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
            onCreateChannel={() => {
              if (selectedServerId) {
                setIsCreateChannelOpen(true);
              }
            }}
          />
          <ChatArea channel={selectedChannel} />
        </div>
        <UserBar onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>

      <CreateServerModal
        isOpen={isCreateServerOpen}
        onClose={() => setIsCreateServerOpen(false)}
        onServerCreated={handleServerCreated}
      />

      {selectedServerId && (
        <CreateChannelModal
          isOpen={isCreateChannelOpen}
          onClose={() => setIsCreateChannelOpen(false)}
          serverId={selectedServerId}
          onChannelCreated={handleChannelCreated}
        />
      )}

      <UserSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default MainApp;
