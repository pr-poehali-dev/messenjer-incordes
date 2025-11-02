-- Add columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS discriminator VARCHAR(4);
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(10) DEFAULT 'dark';
ALTER TABLE users ADD COLUMN IF NOT EXISTS locale VARCHAR(10) DEFAULT 'ru';

-- Add columns to servers  
ALTER TABLE servers ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE servers ADD COLUMN IF NOT EXISTS region VARCHAR(20) DEFAULT 'europe';
ALTER TABLE servers ADD COLUMN IF NOT EXISTS verification_level VARCHAR(20) DEFAULT 'none';
ALTER TABLE servers ADD COLUMN IF NOT EXISTS description TEXT;

-- Add columns to channels
ALTER TABLE channels ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS nsfw BOOLEAN DEFAULT FALSE;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS rate_limit INTEGER DEFAULT 0;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS parent_id INTEGER;
ALTER TABLE channels ADD COLUMN IF NOT EXISTS is_dm BOOLEAN DEFAULT FALSE;

-- Add columns to messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS embeds JSONB DEFAULT '[]';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS referenced_message_id INTEGER;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#99AAB5',
    permissions BIGINT DEFAULT 0,
    position INTEGER DEFAULT 0,
    hoist BOOLEAN DEFAULT FALSE,
    mentionable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create server_invites table
CREATE TABLE IF NOT EXISTS server_invites (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    server_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    inviter_id INTEGER NOT NULL,
    max_uses INTEGER DEFAULT 0,
    uses INTEGER DEFAULT 0,
    max_age INTEGER DEFAULT 0,
    temporary BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    message_display VARCHAR(10) DEFAULT 'cozy',
    font_size INTEGER DEFAULT 16,
    enable_sounds BOOLEAN DEFAULT TRUE,
    desktop_notifications VARCHAR(20) DEFAULT 'all',
    dm_from_friends BOOLEAN DEFAULT TRUE,
    dm_from_servers BOOLEAN DEFAULT TRUE,
    friend_request VARCHAR(30) DEFAULT 'everyone',
    settings_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_incordes_id ON users(incordes_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_channels_dm ON channels(is_dm);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON friends(status);
CREATE INDEX IF NOT EXISTS idx_roles_server ON roles(server_id);
CREATE INDEX IF NOT EXISTS idx_invites_code ON server_invites(code);