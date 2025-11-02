import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettingsModal = ({ isOpen, onClose }: UserSettingsModalProps) => {
  const { currentUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [banner, setBanner] = useState(currentUser?.banner || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [theme, setTheme] = useState(currentUser?.theme || 'dark');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    const updatedUser = await updateUserProfile({
      avatar: avatar.trim() || undefined,
      banner: banner.trim() || undefined,
      bio: bio.trim() || undefined,
      theme,
    });

    if (updatedUser) {
      updateUser(updatedUser);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Failed to save settings. Please try again.');
    }

    setIsSaving(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#313338] border-[#1E1F22] text-white max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="bg-[#1E1F22] border-[#1E1F22]">
            <TabsTrigger value="account" className="data-[state=active]:bg-[#404249]">
              My Account
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#404249]">
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-[#404249]">
              Appearance
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[50vh]">
            <TabsContent value="account" className="space-y-4">
              <div className="bg-[#2B2D31] p-4 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-[#5865F2] text-white text-xl">
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{currentUser.username}</h3>
                    <p className="text-[#B5BAC1]">{currentUser.incordes_id}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-[#B5BAC1] uppercase text-xs font-semibold">Email</Label>
                    <p className="text-white mt-1">{currentUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-[#B5BAC1] uppercase text-xs font-semibold">
                      Username
                    </Label>
                    <p className="text-white mt-1">{currentUser.username}</p>
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full bg-[#F23F42] hover:bg-[#D83C3E]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-[#B5BAC1] uppercase text-xs font-semibold">
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner" className="text-[#B5BAC1] uppercase text-xs font-semibold">
                    Banner URL
                  </Label>
                  <Input
                    id="banner"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="https://example.com/banner.png"
                    className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-[#B5BAC1] uppercase text-xs font-semibold">
                    About Me
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2] min-h-[100px]"
                    maxLength={190}
                  />
                  <p className="text-xs text-[#B5BAC1]">{bio.length}/190</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#B5BAC1] uppercase text-xs font-semibold">Theme</Label>
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      theme === 'dark'
                        ? 'border-[#5865F2] bg-[#2B2D31]'
                        : 'border-[#1E1F22] bg-[#1E1F22]'
                    }`}
                    onClick={() => setTheme('dark')}
                  >
                    <h4 className="font-semibold mb-1">Dark</h4>
                    <p className="text-sm text-[#B5BAC1]">The default Discord-like dark theme</p>
                  </div>
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer opacity-50 ${
                      theme === 'light'
                        ? 'border-[#5865F2] bg-[#2B2D31]'
                        : 'border-[#1E1F22] bg-[#1E1F22]'
                    }`}
                  >
                    <h4 className="font-semibold mb-1">Light</h4>
                    <p className="text-sm text-[#B5BAC1]">Coming soon...</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          {error && (
            <Alert className="bg-[#F23F42] border-[#F23F42] mt-4">
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-[#3BA55D] border-[#3BA55D] mt-4">
              <AlertDescription className="text-white">{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-[#4E5058]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsModal;
