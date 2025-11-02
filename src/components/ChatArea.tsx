import { useState, useEffect, useRef } from 'react';
import { Channel, Message, getMessages, sendMessage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Hash, Send, Plus, Gift, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface ChatAreaProps {
  channel: Channel | null;
}

const ChatArea = ({ channel }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { currentUser } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      if (!channel) {
        setMessages([]);
        return;
      }

      setIsLoading(true);
      const fetchedMessages = await getMessages(channel.id);
      setMessages(fetchedMessages);
      setIsLoading(false);
    };

    loadMessages();
  }, [channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel || !newMessage.trim() || isSending) return;

    setIsSending(true);
    const message = await sendMessage(channel.id, newMessage.trim());
    if (message) {
      setMessages([...messages, message]);
      setNewMessage('');
    }
    setIsSending(false);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'just now';
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  if (!channel) {
    return (
      <div className="flex-1 bg-[#313338] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Incordes</h2>
          <p className="text-[#B5BAC1]">Select a channel or server to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#313338] flex flex-col">
      <div className="h-12 px-4 flex items-center border-b border-[#26282C] shadow-sm">
        <Hash className="h-5 w-5 text-[#B5BAC1] mr-2" />
        <h2 className="text-white font-semibold">{channel.name}</h2>
        <div className="ml-4 text-[#B5BAC1] text-sm hidden md:block">
          Channel Description
        </div>
      </div>

      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-4 space-y-4">
          {isLoading ? (
            <div className="text-[#B5BAC1] text-center">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <Hash className="h-16 w-16 text-[#B5BAC1] mx-auto mb-4 opacity-50" />
              <h3 className="text-white font-semibold text-lg mb-2">
                Welcome to #{channel.name}!
              </h3>
              <p className="text-[#B5BAC1] text-sm">
                This is the beginning of the #{channel.name} channel.
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const showAvatar =
                index === 0 || messages[index - 1].author_id !== message.author_id;
              const isOwnMessage = message.author_id === currentUser?.id;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 hover:bg-[#2E3035] px-2 py-1 rounded ${
                    showAvatar ? 'mt-4' : ''
                  }`}
                >
                  {showAvatar ? (
                    <Avatar className="h-10 w-10 mt-0.5">
                      <AvatarImage src={message.author_avatar} />
                      <AvatarFallback className="bg-[#5865F2] text-white text-sm">
                        {getInitials(message.author_username)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10" />
                  )}
                  <div className="flex-1 min-w-0">
                    {showAvatar && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span
                          className={`font-semibold ${
                            isOwnMessage ? 'text-[#00A8FC]' : 'text-white'
                          }`}
                        >
                          {message.author_username}
                        </span>
                        <span className="text-[#B5BAC1] text-xs">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <p className="text-[#DBDEE1] text-sm break-words">{message.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center gap-2 bg-[#383A40] rounded-lg px-3 py-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#B5BAC1] hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${channel.name}`}
              className="flex-1 bg-transparent border-0 text-white placeholder:text-[#6D6F78] focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              disabled={isSending}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#B5BAC1] hover:text-white"
            >
              <Gift className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#B5BAC1] hover:text-white"
            >
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#B5BAC1] hover:text-white disabled:opacity-50"
              disabled={!newMessage.trim() || isSending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
