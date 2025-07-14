# AppMaster AI

> Eliminating barriers to building advanced custom artificial intelligence

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescript.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Overview

AppMaster AI is a comprehensive platform designed to democratize artificial intelligence development. Our mission is to eliminate the technical barriers that prevent innovators from building advanced custom AI solutions, empowering users to create, deploy, and manage AI-powered applications with ease.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: Email/password authentication powered by Supabase Auth
- **User Profiles**: Automatic profile creation with AI preferences and customization options
- **Session Management**: Persistent sessions with automatic token refresh
- **Row-Level Security**: Database-level security ensuring users only access their own data

### 🤖 AI Development Tools
- **Dashboard**: Central hub for managing AI projects and monitoring activities
- **Idea Capture**: Intelligent system for capturing and organizing AI project concepts
- **VibeCode AI**: Advanced AI coding assistant for generating and optimizing code
- **Visual Logic Designer**: Drag-and-drop interface for creating AI workflows and logic
- **Custom LLM Builder**: Tools for training and deploying custom language models
- **AI Marketplace**: Discover, share, and deploy AI models and components
- **Astrid AI Assistant**: Integrated AI assistant for project guidance and support

### 📊 Project Management
- **Project Creation**: Streamlined project initialization with templates
- **Documentation Generation**: Automatic documentation creation for AI projects
- **Roadmap Planning**: AI-assisted project planning and milestone tracking
- **Code Templates**: Reusable code patterns and boilerplates
- **Version Control**: Integration with GitHub for seamless code management

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Fast build tool with hot module replacement
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Beautifully designed, accessible UI components
- **React Router**: Client-side routing for single-page application navigation
- **Lucide Icons**: Consistent and customizable icon system

### Backend & Database
- **Supabase**: Backend-as-a-Service providing:
  - PostgreSQL database with real-time subscriptions
  - Authentication and user management
  - Row-Level Security (RLS) policies
  - Edge Functions for serverless compute
  - Storage for file management

### AI & ML
- **Hugging Face Transformers**: Browser-based machine learning models
- **Custom AI Services**: Extensible AI service layer for various providers
- **Edge Function Integration**: Serverless AI processing capabilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase CLI** (optional, for local development)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd appmaster-ai
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
The project uses Supabase for backend services. The Supabase configuration is already set up in the codebase:

```typescript
// src/integrations/supabase/client.ts
const SUPABASE_URL = "https://ngivzofqryxxwvlxxsqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";
```

### 4. Database Setup
The project includes automated database migrations for:
- User profiles table with AI preferences
- Projects table for AI project management
- Generated projects table for AI-created content
- Row-Level Security policies for data protection

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📊 Database Schema

### Tables

#### `profiles`
Stores user profile information and AI preferences:
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- display_name (TEXT)
- avatar_url (TEXT)
- bio (TEXT)
- ai_preferences (JSONB) - Stores AI model preferences, temperature settings, etc.
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `projects`
Manages user AI projects:
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- name (TEXT)
- description (TEXT)
- status (TEXT, Default: 'generating')
- documentation (TEXT)
- roadmap (JSONB)
- code_templates (JSONB)
- github_repo_url (TEXT)
- github_repo_name (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `generated_projects`
Stores AI-generated project templates:
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- title (TEXT)
- description (TEXT)
- documentation (TEXT)
- roadmap (JSONB)
- tech_stack (TEXT[])
- templates (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Row-Level Security (RLS)
All tables implement RLS policies ensuring:
- Users can only view, create, update, and delete their own data
- Secure data isolation between users
- Profile information is publicly viewable but only editable by the owner

## 🔐 Authentication Flow

### User Registration
1. User provides email, password, and optional display name
2. Supabase Auth creates user account
3. Database trigger automatically creates user profile
4. AI preferences are initialized with default values
5. User receives email confirmation

### User Login
1. User provides email and password
2. Supabase Auth validates credentials
3. Session is established with automatic token refresh
4. User is redirected to dashboard

### Session Management
- Sessions persist across browser sessions
- Automatic token refresh prevents interruptions
- Protected routes redirect unauthenticated users to login

## 🎨 UI/UX Design System

The project uses a comprehensive design system built on:
- **Color Palette**: HSL-based semantic color tokens
- **Typography**: Consistent text scales and font weights
- **Spacing**: Tailwind's spacing system for consistent layouts
- **Components**: shadcn/ui components with custom variants
- **Dark/Light Mode**: Automatic theme switching support
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Custom Button Variants
- `neon`: Glowing accent style for primary actions
- `ghost`: Subtle hover effects for secondary actions
- `destructive`: Warning style for dangerous actions

## 🚀 Deployment

### Lovable Platform (Recommended)
1. Visit your [Lovable Project](https://lovable.dev/projects/9444df61-41c9-43dd-8637-ea4ac5c354a9)
2. Click Share → Publish
3. Your app will be deployed automatically

### Custom Domain
To connect a custom domain:
1. Navigate to Project → Settings → Domains
2. Click Connect Domain
3. Follow the DNS configuration instructions

### Alternative Deployment Options
The project can also be deployed to:
- **Vercel**: Optimized for React/Vite applications
- **Netlify**: Simple deployment with form handling
- **Supabase Hosting**: Integrated hosting solution

## 🧪 Development Workflow

### Local Development with Lovable
This project is built with [Lovable](https://lovable.dev), offering multiple development approaches:

**Option 1: Use Lovable (Recommended)**
- Visit your [Lovable Project](https://lovable.dev/projects/9444df61-41c9-43dd-8637-ea4ac5c354a9)
- Make changes through natural language prompts
- Changes are automatically committed to your repository

**Option 2: Local IDE Development**
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

**Option 3: GitHub Codespaces**
1. Navigate to your repository on GitHub
2. Click the "Code" button → "Codespaces" tab
3. Click "New codespace"
4. Edit directly in the browser-based IDE

### Code Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── Navigation.tsx  # App navigation
│   └── ...
├── pages/              # Route components
│   ├── Index.tsx       # Main application page
│   ├── Auth.tsx        # Authentication page
│   └── NotFound.tsx    # 404 error page
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication state management
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions and services
└── assets/             # Static assets and images
```

## 🔧 Supabase Configuration

### Database Tables
The project includes three main tables:

1. **profiles**: User profile information with AI preferences
2. **projects**: User-created AI projects
3. **generated_projects**: AI-generated project templates

### Edge Function Secrets
Configure these secrets in your Supabase project:
- `OPENAI_API_KEY`: For AI model integration
- `GEMINI_API_KEY`: For Google AI services
- Additional AI service keys as needed

### Row-Level Security
All tables implement RLS policies ensuring data isolation between users.

## 🤝 Contributing

We welcome contributions to AppMaster AI! 

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes using Lovable or your preferred IDE
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Ensure responsive design for all UI changes
- Test authentication flows when modifying auth code
- Use semantic commit messages

## 🔧 Troubleshooting

### Common Issues

#### Authentication Problems
- Verify Supabase URL and anon key configuration
- Check email confirmation settings in Supabase dashboard
- Ensure RLS policies are properly configured

#### Database Connection Issues
- Confirm Supabase project is active
- Check database migrations are applied
- Verify RLS policies allow user access

#### Build Issues
- Clear node_modules and reinstall dependencies
- Check TypeScript errors in the console
- Verify all environment variables are set

### Getting Help
- Check the [Lovable Documentation](https://docs.lovable.dev)
- Review GitHub Issues for common problems
- Use the Lovable chat interface for development questions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Lovable](https://lovable.dev) for the innovative AI-powered development platform
- [Supabase](https://supabase.com) for the incredible backend platform
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- The open-source community for continuous inspiration

---

<div align="center">
  <strong>Built with ❤️ using Lovable</strong>
  <br>
  <em>Eliminating barriers to building advanced custom artificial intelligence</em>
  <br><br>
  <a href="https://lovable.dev/projects/9444df61-41c9-43dd-8637-ea4ac5c354a9">🚀 Open in Lovable</a>
</div>
