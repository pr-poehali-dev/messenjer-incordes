import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          navigate('/app');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        if (!username) {
          setError('Username is required');
          setIsLoading(false);
          return;
        }
        const result = await register(email, password, username);
        if (result.success && result.user) {
          setSuccess(`Account created! Your IncordesID: ${result.user.incordes_id}`);
          setTimeout(() => {
            navigate('/app');
          }, 2000);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2B2D31] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" fill="#5865F2" stroke="#FFFFFF" strokeWidth="2"/>
              <path d="M25 35C25 35 30 28 40 28C50 28 55 35 55 35V52C55 52 50 45 40 45C30 45 25 52 25 52V35Z" fill="white"/>
              <circle cx="32" cy="38" r="3" fill="#5865F2"/>
              <circle cx="48" cy="38" r="3" fill="#5865F2"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Incordes</h1>
          <p className="text-[#B5BAC1]">Connect with your friends</p>
        </div>

        <Card className="bg-[#313338] border-[#1E1F22]">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {isLogin ? 'Welcome back!' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-[#B5BAC1]">
              {isLogin ? 'We\'re so excited to see you again!' : 'Join the community today!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[#B5BAC1] uppercase text-xs font-semibold">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2]"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#B5BAC1] uppercase text-xs font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#B5BAC1] uppercase text-xs font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1E1F22] border-[#1E1F22] text-white focus:border-[#5865F2]"
                  required
                />
              </div>

              {error && (
                <Alert className="bg-[#F23F42] border-[#F23F42]">
                  <AlertDescription className="text-white">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-[#3BA55D] border-[#3BA55D]">
                  <AlertDescription className="text-white">{success}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Please wait...' : isLogin ? 'Log In' : 'Register'}
              </Button>

              <div className="text-sm text-[#B5BAC1]">
                {isLogin ? "Need an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-[#00A8FC] hover:underline"
                >
                  {isLogin ? 'Register' : 'Log In'}
                </button>
              </div>

              <div className="text-xs text-[#B5BAC1] text-center space-x-2">
                <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                <span>•</span>
                <Link to="/terms" className="hover:underline">Terms of Service</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;