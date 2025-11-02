# Incordes Messenger - Testing Guide

## How to Test the Complete Application

### Prerequisites
```bash
# Make sure all dependencies are installed
npm install

# Start the development server
npm run dev
```

The app should open at `http://localhost:5173`

---

## Test Scenarios

### 1. Authentication Flow

#### Test Registration
1. Open `http://localhost:5173`
2. You should see the Login page with dark Discord-like theme
3. Click "Register" link at bottom
4. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
5. Click "Register" button
6. ✅ **Expected:** Success message showing IncordesID (e.g., `testuser#0001`)
7. ✅ **Expected:** Auto-redirect to `/app` after 2 seconds

#### Test Login
1. If logged in, logout first (Settings → Log Out)
2. Fill in login form:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Log In" button
4. ✅ **Expected:** Immediate redirect to `/app`

#### Test Persistence
1. Login to the app
2. Refresh the page (F5)
3. ✅ **Expected:** Should stay logged in (no redirect to login page)
4. Open DevTools → Application → Local Storage
5. ✅ **Expected:** Should see `incordes_token` and `incordes_user`

#### Test Protected Routes
1. Logout from the app
2. Try to navigate to `/app`
3. ✅ **Expected:** Should redirect to `/` (login page)

#### Test Public Routes (when logged in)
1. Login to the app
2. Try to navigate to `/`
3. ✅ **Expected:** Should redirect to `/app`

---

### 2. Server Management

#### Test Server List
1. Login to the app
2. Look at the left sidebar (72px wide)
3. ✅ **Expected:** Home button at top
4. ✅ **Expected:** Separator line
5. ✅ **Expected:** List of servers (or empty if none)
6. ✅ **Expected:** "+" button at bottom

#### Test Create Server
1. Click the "+" button in server sidebar
2. ✅ **Expected:** Modal appears: "Create Your Server"
3. Enter server name: `My Test Server`
4. (Optional) Enter icon URL: `https://via.placeholder.com/150`
5. Click "Create Server"
6. ✅ **Expected:** Modal closes
7. ✅ **Expected:** New server appears in sidebar
8. ✅ **Expected:** Server shows initials if no icon (e.g., "MT")

#### Test Server Selection
1. Click on a server icon
2. ✅ **Expected:** Server icon becomes highlighted/rounded
3. ✅ **Expected:** Middle sidebar shows server name
4. ✅ **Expected:** Channels load for that server
5. Click Home button
6. ✅ **Expected:** Returns to Friends view (placeholder)

#### Test Server Hover Effects
1. Hover over server icons
2. ✅ **Expected:** Icon rounds from circle to rounded square
3. ✅ **Expected:** Hover color changes to blue (#5865F2)
4. ✅ **Expected:** Tooltip appears showing server name

---

### 3. Channel Management

#### Test Channel List
1. Select a server
2. Look at middle sidebar (240px wide)
3. ✅ **Expected:** Server name at top with dropdown icon
4. ✅ **Expected:** "TEXT CHANNELS" category with "+" button
5. ✅ **Expected:** List of text channels (e.g., # general)
6. ✅ **Expected:** "VOICE CHANNELS" category with "+" button
7. ✅ **Expected:** List of voice channels (e.g., 🔊 General)
8. ✅ **Expected:** "Server Settings" at bottom

#### Test Create Text Channel
1. Hover over "TEXT CHANNELS" category
2. Click the "+" button that appears
3. ✅ **Expected:** "Create Channel" modal appears
4. ✅ **Expected:** "Text Channel" is selected by default
5. Enter channel name: `test-channel`
6. Click "Create Channel"
7. ✅ **Expected:** Modal closes
8. ✅ **Expected:** New channel appears in text channels list

#### Test Create Voice Channel
1. Hover over "VOICE CHANNELS" category
2. Click the "+" button
3. Select "Voice Channel" radio button
4. Enter channel name: `Gaming`
5. Click "Create Channel"
6. ✅ **Expected:** New voice channel appears with 🔊 icon

#### Test Channel Selection
1. Click on a channel
2. ✅ **Expected:** Channel background becomes highlighted (#404249)
3. ✅ **Expected:** Chat area shows channel name at top
4. ✅ **Expected:** Messages load (or empty state shown)
5. Click another channel
6. ✅ **Expected:** Previous channel unhighlights
7. ✅ **Expected:** New channel highlights
8. ✅ **Expected:** Different messages load

#### Test Collapse/Expand Categories
1. Click on "TEXT CHANNELS" header
2. ✅ **Expected:** Text channels list collapses
3. ✅ **Expected:** Chevron icon rotates -90 degrees
4. Click again
5. ✅ **Expected:** Text channels list expands
6. ✅ **Expected:** Chevron icon rotates back

---

### 4. Messaging System

#### Test Message Display
1. Select a channel with messages
2. ✅ **Expected:** Messages display in scrollable area
3. ✅ **Expected:** Each message shows:
   - Avatar (or initials)
   - Username
   - Timestamp (relative: "2 minutes ago")
   - Message content
4. ✅ **Expected:** Consecutive messages from same user group together (no avatar repeat)

#### Test Send Message
1. Click in message input at bottom
2. Type: `Hello, this is a test message!`
3. Press Enter (or click Send button)
4. ✅ **Expected:** Message appears at bottom of chat
5. ✅ **Expected:** Input clears
6. ✅ **Expected:** Auto-scrolls to new message

#### Test Empty Channel
1. Create a new channel (no messages yet)
2. Select that channel
3. ✅ **Expected:** Welcome message appears:
   - Large # icon
   - "Welcome to #channel-name!"
   - "This is the beginning of the #channel-name channel."

#### Test Message Input
1. Focus on message input
2. ✅ **Expected:** Placeholder shows "Message #channel-name"
3. Type some text
4. ✅ **Expected:** Send button becomes enabled
5. Clear text
6. ✅ **Expected:** Send button becomes disabled

#### Test Long Messages
1. Type a very long message (200+ characters)
2. Send it
3. ✅ **Expected:** Message wraps to multiple lines
4. ✅ **Expected:** No horizontal overflow

---

### 5. User Interface

#### Test User Bar
1. Look at bottom of screen
2. ✅ **Expected:** User bar shows:
   - Your avatar (or placeholder)
   - Your username
   - Your #discriminator (e.g., #0001)
3. Hover over microphone button
4. ✅ **Expected:** Tooltip shows "Mute"
5. Click microphone button
6. ✅ **Expected:** Icon turns red
7. ✅ **Expected:** Tooltip changes to "Unmute"
8. Test headphones button similarly
9. Click settings button
10. ✅ **Expected:** Settings modal opens

#### Test User Settings Modal
1. Open user settings
2. ✅ **Expected:** Modal with three tabs appears
3. Click "My Account" tab
4. ✅ **Expected:** Shows:
   - Avatar
   - Username
   - IncordesID
   - Email
   - "Log Out" button
5. Click "Profile" tab
6. ✅ **Expected:** Shows fields:
   - Avatar URL input
   - Banner URL input
   - Bio textarea (190 char limit)
   - Character counter
7. Change avatar URL to: `https://via.placeholder.com/150`
8. Change bio to: `This is my test bio`
9. Click "Save Changes"
10. ✅ **Expected:** Success message appears
11. ✅ **Expected:** Avatar updates in user bar
12. Click "Appearance" tab
13. ✅ **Expected:** Shows theme options (Dark selected)

#### Test Scrollbars
1. Create many channels (10+)
2. ✅ **Expected:** Custom scrollbar appears (8px wide, dark)
3. Hover over scrollbar
4. ✅ **Expected:** Scrollbar thumb slightly lightens
5. Scroll in chat area
6. ✅ **Expected:** Same custom scrollbar style

#### Test Responsive Hover Effects
1. Hover over any channel
2. ✅ **Expected:** Background changes to #35373C
3. Hover over server icon
4. ✅ **Expected:** Rounds corners, changes to blue
5. Hover over buttons
6. ✅ **Expected:** Color changes, smooth transition

---

### 6. Legal Pages

#### Test Privacy Policy
1. On login page, click "Privacy Policy" link
2. ✅ **Expected:** Navigates to `/privacy`
3. ✅ **Expected:** Shows complete privacy policy
4. ✅ **Expected:** Shows contact email: connection.support@gmail.com
5. ✅ **Expected:** "Back to Login" button works
6. If logged in, navigate directly to `/privacy`
7. ✅ **Expected:** Can access privacy policy while logged in

#### Test Terms of Service
1. On login page, click "Terms of Service" link
2. ✅ **Expected:** Navigates to `/terms`
3. ✅ **Expected:** Shows complete terms
4. ✅ **Expected:** Shows contact email
5. ✅ **Expected:** "Back to Login" button works

---

### 7. Error Handling

#### Test Invalid Login
1. Try to login with wrong credentials
2. ✅ **Expected:** Red error alert appears
3. ✅ **Expected:** Error message is descriptive

#### Test Empty Form Submission
1. Try to create server with empty name
2. ✅ **Expected:** Error message appears
3. ✅ **Expected:** Modal stays open

#### Test Network Errors
1. Turn off internet/stop backend
2. Try to create server
3. ✅ **Expected:** Error message appears
4. ✅ **Expected:** Graceful degradation

#### Test 404 Page
1. Navigate to `/nonexistent`
2. ✅ **Expected:** NotFound page appears
3. ✅ **Expected:** Can navigate back to app

---

### 8. State Management

#### Test Logout
1. Login to the app
2. Open user settings
3. Click "Log Out"
4. ✅ **Expected:** Redirects to login page
5. ✅ **Expected:** localStorage cleared
6. Try to go back to `/app`
7. ✅ **Expected:** Redirects to login page

#### Test Refresh After Logout
1. Logout
2. Refresh page
3. ✅ **Expected:** Stays on login page
4. ✅ **Expected:** No errors in console

#### Test Multiple Tabs
1. Login in one tab
2. Open another tab to same app
3. ✅ **Expected:** Both tabs show logged-in state
4. Logout in one tab
5. ✅ **Expected:** Other tab should eventually update (on action)

---

### 9. Keyboard Navigation

#### Test Tab Navigation
1. On login page, press Tab key
2. ✅ **Expected:** Focus moves through inputs in order
3. ✅ **Expected:** Focus indicators visible (blue ring)
4. Press Enter on Login button
5. ✅ **Expected:** Form submits

#### Test Form Submission
1. In message input, type message
2. Press Enter
3. ✅ **Expected:** Message sends
4. In modal forms, press Escape
5. ✅ **Expected:** Modal closes

---

### 10. Visual Testing

#### Test Color Consistency
1. Check all backgrounds are consistent
2. ✅ **Expected:** Main bg: #2B2D31
3. ✅ **Expected:** Sidebar: #313338 / #2B2D31
4. ✅ **Expected:** Accent: #5865F2
5. ✅ **Expected:** Text: #FFFFFF / #B5BAC1

#### Test Typography
1. Check all text is readable
2. ✅ **Expected:** Good contrast ratios
3. ✅ **Expected:** Consistent font sizes
4. ✅ **Expected:** Proper line heights

#### Test Spacing
1. Check padding/margins
2. ✅ **Expected:** Consistent spacing throughout
3. ✅ **Expected:** No overlapping elements
4. ✅ **Expected:** Proper alignment

---

## Browser Testing

Test in multiple browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Console Testing

### Check for Errors
1. Open DevTools Console (F12)
2. Use the app normally
3. ✅ **Expected:** No errors in console
4. ✅ **Expected:** No warnings (except React dev warnings)

### Check Network Requests
1. Open DevTools Network tab
2. Login to app
3. ✅ **Expected:** POST to auth API (200 status)
4. Create server
5. ✅ **Expected:** POST to servers API (200 status)
6. Load messages
7. ✅ **Expected:** GET to messages API (200 status)
8. ✅ **Expected:** All requests include Authorization header (except login/register)

---

## Performance Testing

### Check Load Times
1. Clear cache
2. Reload app
3. ✅ **Expected:** Initial load < 2 seconds
4. ✅ **Expected:** Navigation is instant

### Check Memory
1. Open DevTools Performance tab
2. Record while using app
3. ✅ **Expected:** No memory leaks
4. ✅ **Expected:** Smooth 60fps animations

---

## Accessibility Testing

### Keyboard Only
1. Unplug mouse
2. Navigate entire app with keyboard
3. ✅ **Expected:** Can access all features
4. ✅ **Expected:** Focus indicators visible

### Screen Reader
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate app
3. ✅ **Expected:** All elements announced properly
4. ✅ **Expected:** Semantic HTML used

---

## Edge Cases

### Test Empty States
- No servers → Shows home view
- No channels → Shows empty state
- No messages → Shows welcome message

### Test Loading States
- Login → Shows "Loading..." during auth check
- Server list → Shows "Loading..." while fetching
- Messages → Shows "Loading messages..."

### Test Long Content
- Very long server names → Truncate with ellipsis
- Very long usernames → Truncate
- Very long messages → Wrap properly

---

## Automated Testing (Future)

For automated tests, you would test:
- Component rendering
- API calls
- State management
- User interactions
- Form validation

Example test structure (with Jest/React Testing Library):
```typescript
describe('LoginPage', () => {
  it('should render login form', () => {
    // test code
  });
  
  it('should handle login submission', () => {
    // test code
  });
});
```

---

## Known Limitations

The following features are not yet implemented:
- Real-time updates (WebSocket)
- Voice/video calling
- File uploads
- Rich text formatting
- Emoji picker functionality
- Friends system
- Direct messages
- User presence (online/offline)
- Message reactions
- Notifications

These are UI placeholders for future implementation.

---

## Bug Reporting

If you find bugs, report with:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/OS
5. Console errors (if any)

Contact: connection.support@gmail.com

---

**All features are ready to test!** ✅
