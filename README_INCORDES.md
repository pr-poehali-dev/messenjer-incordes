# Incordes Messenger - Complete Discord-like Frontend Application

A fully functional Discord-inspired messenger application built with React, TypeScript, Tailwind CSS, and Vite.

## Features

### Authentication
- User registration with email, password, and username
- Login functionality with JWT tokens
- Persistent authentication using localStorage
- Automatic redirect based on authentication state
- Display of unique IncordesID (Username#0001 format)

### Main Interface
- **Three-column Discord-like layout:**
  - Left sidebar: Server list with icons
  - Middle sidebar: Channels list
  - Right area: Chat messages and input

### Server Management
- View all joined servers
- Create new servers with custom names and icons
- Home button for Friends/DM (placeholder)
- Server icons with fallback initials
- Hover effects and smooth transitions

### Channel Management
- Text channels (#general style)
- Voice channels (🔊 General style)
- Create new channels (text or voice)
- Collapsible channel categories
- Auto-select first channel on server load

### Messaging
- Real-time message display
- Send messages with Enter key
- Avatar support with fallback initials
- Timestamp formatting (relative time)
- Smooth scroll to bottom
- Message grouping by author
- Discord-like message UI

### User Settings
- Profile customization (avatar, banner, bio)
- Theme selection (dark mode default)
- Account information display
- Logout functionality
- Settings accessible from user bar

### User Bar
- Current user avatar and username
- IncordesID display (#discriminator)
- Mute/unmute microphone
- Deafen/undeafen audio
- Settings gear icon

### Legal Pages
- Privacy Policy page with comprehensive details
- Terms of Service page
- Contact information: connection.support@gmail.com
- Links back to main app

## File Structure

```
src/
├── App.tsx                          # Main app with router and auth protection
├── main.tsx                         # App entry point
├── index.css                        # Global styles with Discord colors
│
├── contexts/
│   └── AuthContext.tsx              # Authentication state management
│
├── lib/
│   └── api.ts                       # API helper functions
│
├── pages/
│   ├── LoginPage.tsx                # Login/Register page
│   ├── MainApp.tsx                  # Main Discord interface
│   ├── PrivacyPolicy.tsx            # Privacy policy page
│   ├── TermsOfService.tsx           # Terms of service page
│   └── NotFound.tsx                 # 404 page
│
├── components/
│   ├── ServerSidebar.tsx            # Left server list
│   ├── ChannelSidebar.tsx           # Middle channels list
│   ├── ChatArea.tsx                 # Right chat messages
│   ├── UserBar.tsx                  # Bottom user info bar
│   │
│   └── modals/
│       ├── CreateServerModal.tsx    # Create server modal
│       ├── CreateChannelModal.tsx   # Create channel modal
│       └── UserSettingsModal.tsx    # User settings modal
```

## Backend API Integration

### Authentication API
**URL:** `https://functions.poehali.dev/2d50d235-69aa-4843-90b9-73f0f430a117`

**Endpoints:**
- `POST` with `{ action: 'register', email, password, username }` - Register user
- `POST` with `{ action: 'login', email, password }` - Login user
- `POST` with `{ action: 'update_profile', avatar, banner, bio, theme }` - Update profile

**Response:** `{ success, token, user, error, message }`

### Servers API
**URL:** `https://functions.poehali.dev/e463f777-60a4-4b41-b8f8-d5f8f8229db5`

**Endpoints:**
- `GET ?user_servers=true` - Get user's servers
- `GET ?server_id=X&channels=true` - Get channels for server
- `POST` with `{ action: 'create', name, icon }` - Create server
- `POST` with `{ action: 'create_channel', server_id, name, type }` - Create channel

**Headers:** `Authorization: Bearer {token}`

### Messages API
**URL:** `https://functions.poehali.dev/32453d49-d319-4d27-a215-de640ae2c16d`

**Endpoints:**
- `GET ?channel_id=X` - Get messages for channel
- `POST` with `{ action: 'send', channel_id, content }` - Send message

**Headers:** `Authorization: Bearer {token}`

## Authentication Flow

1. User registers → receives JWT token + user object with incordes_id
2. Token saved to `localStorage.setItem('incordes_token', token)`
3. User saved to `localStorage.setItem('incordes_user', JSON.stringify(user))`
4. Redirect to `/app`
5. All API calls include header: `Authorization: Bearer {token}`
6. Protected routes check for authentication
7. Public routes redirect authenticated users to `/app`

## Color Scheme (Discord-like)

- Background: `#2B2D31`
- Sidebar: `#313338`
- Secondary: `#1E1F22`
- Tertiary: `#35373C`
- Input: `#383A40`
- Accent (Incordes Blue): `#5865F2`
- Text Primary: `#FFFFFF`
- Text Secondary: `#B5BAC1`
- Text Muted: `#6D6F78`
- Success: `#3BA55D`
- Danger: `#F23F42`

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Technologies

- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **TanStack Query** - Data fetching

## Features Implemented

✅ Complete authentication system
✅ Server and channel management
✅ Real-time-style messaging interface
✅ User profile management
✅ Discord-like UI/UX
✅ Responsive design
✅ Modal dialogs for creation flows
✅ Protected and public routes
✅ Legal pages (Privacy & Terms)
✅ Local storage persistence
✅ Avatar fallbacks
✅ Smooth animations and transitions
✅ Custom scrollbars
✅ Tooltip support
✅ Toast notifications ready
✅ Dark theme by default

## Notes

- The app uses localStorage for authentication persistence
- All API calls automatically include JWT token when available
- Protected routes redirect unauthenticated users to login
- Public routes redirect authenticated users to main app
- Channels auto-select first available on server load
- Messages scroll to bottom automatically
- Voice channels are UI-only (functional voice coming soon)
- Friends/DM section is placeholder (coming soon)

## Contact & Support

For questions or support, contact: **connection.support@gmail.com**

---

**Built with React + TypeScript + Tailwind CSS**
