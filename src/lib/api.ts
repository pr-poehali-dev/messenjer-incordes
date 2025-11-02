const AUTH_API = 'https://functions.poehali.dev/2d50d235-69aa-4843-90b9-73f0f430a117';
const SERVERS_API = 'https://functions.poehali.dev/e463f777-60a4-4b41-b8f8-d5f8f8229db5';
const MESSAGES_API = 'https://functions.poehali.dev/32453d49-d319-4d27-a215-de640ae2c16d';

export interface User {
  id: string;
  email: string;
  username: string;
  incordes_id: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  theme?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  message?: string;
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  owner_id: string;
  channels?: Channel[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  server_id: string;
}

export interface Message {
  id: string;
  content: string;
  author_id: string;
  author_username: string;
  author_avatar?: string;
  channel_id: string;
  timestamp: string;
}

const getToken = (): string | null => {
  return localStorage.getItem('incordes_token');
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return {
        success: false,
        error: data.error,
      };
    }
    
    if (data.token && data.user) {
      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    }
    
    return {
      success: false,
      error: 'Invalid response from server',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

export const register = async (
  email: string,
  password: string,
  username: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        email,
        password,
        username,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      return {
        success: false,
        error: data.error,
      };
    }
    
    if (data.token && data.user) {
      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    }
    
    return {
      success: false,
      error: 'Invalid response from server',
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

export const getServers = async (): Promise<Server[]> => {
  try {
    const response = await fetch(`${SERVERS_API}?user_servers=true`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (data.servers) {
      return data.servers;
    }
    return [];
  } catch (error) {
    console.error('Get servers error:', error);
    return [];
  }
};

export const createServer = async (name: string, icon?: string): Promise<Server | null> => {
  try {
    const response = await fetch(SERVERS_API, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'create',
        name,
        ...(icon && { icon_url: icon }),
      }),
    });

    const data = await response.json();
    if (data.id || data.server_id) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Create server error:', error);
    return null;
  }
};

export const getChannels = async (serverId: string): Promise<Channel[]> => {
  try {
    const response = await fetch(`${SERVERS_API}?server_id=${serverId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (data.channels) {
      return data.channels;
    }
    return [];
  } catch (error) {
    console.error('Get channels error:', error);
    return [];
  }
};

export const createChannel = async (
  serverId: string,
  name: string,
  type: 'text' | 'voice' = 'text'
): Promise<Channel | null> => {
  try {
    const response = await fetch(SERVERS_API, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'create_channel',
        server_id: serverId,
        name,
        type,
      }),
    });

    const data = await response.json();
    if (data.id || data.channel_id) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Create channel error:', error);
    return null;
  }
};

export const getMessages = async (channelId: string): Promise<Message[]> => {
  try {
    const response = await fetch(`${MESSAGES_API}?channel_id=${channelId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (data.messages) {
      return data.messages;
    }
    return [];
  } catch (error) {
    console.error('Get messages error:', error);
    return [];
  }
};

export const sendMessage = async (channelId: string, content: string): Promise<Message | null> => {
  try {
    const response = await fetch(MESSAGES_API, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'send',
        channel_id: channelId,
        content,
      }),
    });

    const data = await response.json();
    if (data.id || data.message_id) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Send message error:', error);
    return null;
  }
};

export const updateUserProfile = async (updates: Partial<User>): Promise<User | null> => {
  try {
    const response = await fetch(AUTH_API, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        action: 'update_profile',
        ...updates,
      }),
    });

    const data = await response.json();
    if (data.success && data.user) {
      return data.user;
    }
    return null;
  } catch (error) {
    console.error('Update profile error:', error);
    return null;
  }
};