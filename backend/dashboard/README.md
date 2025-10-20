# Taste & Grow Dashboard

A secure admin dashboard for managing the Taste & Grow platform - educational content, users, schools, and game content.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Taste & Grow API server running (see `backend/api`)

### Installation

Follow these steps to get the project running locally:

```sh
# Step 1: Navigate to the dashboard directory
cd backend/dashboard

# Step 2: Install the necessary dependencies
npm install

# Step 3: Create environment variables
# Create .env.development file with:
echo "VITE_API_URL=http://localhost:3000" > .env.development

# Step 4: Start the development server
npm run dev
```

### Authentication Setup

⚠️ **Important**: This dashboard requires admin authentication.

1. Create an admin user via the API:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@tasteandgrow.com",
    "password": "YourSecurePassword123!",
    "role": "ADMIN"
  }'
```

2. Navigate to `http://localhost:5173/login`
3. Login with your admin credentials

📖 For detailed authentication setup, see [AUTH_SETUP.md](./AUTH_SETUP.md)

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Features

### Authentication & Security
- 🔐 Secure admin login/logout system
- 👤 User profile display with avatar
- 🛡️ JWT token-based authentication
- 🔒 Protected routes (admin-only access)
- 💾 Session persistence across page refreshes

### Content Management
- 📊 Analytics dashboard
- 🌐 Website content management
- 👥 User management
- 🏫 School management
- 🔑 School access codes
- 🎮 Game corridors management
- 🏆 Reward cards management
- ⚙️ Settings configuration

### UI/UX
- Modern, responsive design
- Collapsible sidebar navigation
- Smooth animations and transitions
- Toast notifications
- Loading states

## Development

The project uses Vite for fast development with hot module replacement. All changes are automatically reflected in the browser.

## Deployment

Build the project for production:

```sh
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.
