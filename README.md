# 📱 Arch1tech
**Powered by Or4cl3 AI Solutions**  
*Build the future, one thought at a time.*

> Dark neon holographic AI platform — midnight blue, pulse green, electric cyan accents

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescript.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Overview

Arch1tech is a comprehensive AI development platform that eliminates barriers to building advanced custom artificial intelligence. Our mission is to democratize AI development through an intuitive mobile-first experience with dark neon holographic UI, empowering users to capture ideas, refine them semantically, build logic visually, and deploy intelligent agents with full governance.

**Core Flow**: Idea → Semantic Refine (VibeCodeAI) → Build Logic (Visual Designer) → Deploy + Monitor (Astrid, Σ-Matrix, ERPS) → Train Custom LLMs → Remix & Collaborate

## ✨ Features

### 🔐 Command Center Dashboard
- **Real-time Cockpit**: User's live activity hub with holographic interface
- **Astrid Status**: Monitor up to 2 active co-pilots (free tier)
- **Custom LLM Slots**: Up to 3 custom model slots (free tier)
- **Σ-Matrix Drift Score**: Live epistemic stability monitoring
- **Activity Feed**: Recent builds, runs, prompt logs with neon timeline

### 🧠 Core AI Development Stack
- **Idea Capture**: Voice-to-text raw input with semantic enhancement suggestions
- **VibeCodeAI**: Advanced semantic prompt refinement with inline explanations
- **Visual Logic Designer**: No-code node canvas with Σ-Matrix overlay and ERPS monitoring
- **Astrid Co-Pilot**: Live pair programming with mission/optimization modes
- **Custom LLM Playground**: Train & deploy models with hallucination detection
- **Agent Show Mode**: Sandbox testing with synthetic battles and performance ranking

### 🌐 Collaboration & Governance
- **AI Marketplace**: Fork, remix, and share agents with trust badges
- **Σ-Matrix Dashboard**: Full DMAIC cycle transparency with drift heatmaps
- **ERPS Deep Dive**: Agent introspection with self-query loops and uncertainty scores
- **Memory Timeline**: Complete evolution tracking with one-tap rollbacks
- **Team Management**: Role-based permissions and collaborative workflows

### 📊 Advanced Analytics & Monitoring
- **Epistemic Transparency**: Real-time stability proof logging
- **Version Control**: Git-like branching for agent logic with stability markers
- **Performance Analytics**: Model card generation and deployment metrics
- **Counterfactual Simulation**: "What if" scenario testing for logic branches

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Fast build tool with hot module replacement
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Beautifully designed, accessible UI components
- **React Router**: Client-side routing for single-page application navigation
- **Lucide Icons**: Consistent and customizable icon system

### Backend & Infrastructure
- **Supabase**: Backend-as-a-Service providing:
  - PostgreSQL database with real-time subscriptions
  - Authentication and user management
  - Row-Level Security (RLS) policies
  - Edge Functions for Σ-Matrix and ERPS processing
  - Storage for agent artifacts and model checkpoints

### AI & ML Stack
- **Hugging Face Transformers**: Browser-based machine learning models
- **Custom Training Pipeline**: Σ-Matrix validated model training
- **ERPS Integration**: Real-time hallucination detection and self-monitoring
- **Agent Architecture**: Introspective AI with MirrorNode technology

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
cd arch1tech
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
- ai_preferences (JSONB) - Stores Astrid settings, model preferences, Σ-Matrix thresholds
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `projects`
Manages user AI agents and workflows:
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- name (TEXT)
- description (TEXT)
- status (TEXT, Default: 'generating')
- documentation (TEXT) - Auto-generated model cards
- roadmap (JSONB) - DMAIC cycle tracking
- code_templates (JSONB) - Visual logic node configurations
- github_repo_url (TEXT)
- github_repo_name (TEXT)
- sigma_matrix_score (DECIMAL) - Current drift measurement
- erps_config (JSONB) - Self-monitoring settings
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `generated_projects`
Stores VibeCodeAI refined prompts and agent templates:
```sql
- id (UUID, Primary Key)
- user_id (UUID, References auth.users)
- title (TEXT)
- description (TEXT)
- documentation (TEXT) - Semantic refinement logs
- roadmap (JSONB) - Agent deployment pipeline
- tech_stack (TEXT[]) - Required dependencies
- templates (JSONB) - VibeCodeAI prompt templates
- vibe_score (DECIMAL) - Semantic coherence rating
- astrid_compatibility (BOOLEAN) - Co-pilot ready status
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
2. Supabase Auth creates user account with Or4cl3 AI Solutions verification
3. Database trigger automatically creates user profile with default Astrid settings
4. AI preferences initialized with VibeCodeAI and Σ-Matrix defaults
5. User receives holographic welcome email with platform tour

### User Login
1. User provides credentials through neon-themed interface
2. Supabase Auth validates against encrypted security matrix
3. Session established with Astrid co-pilot initialization
4. Real-time dashboard loads with current Σ-Matrix drift scores
5. User redirected to Command Center Dashboard

### Session Management
- Sessions persist across devices with holographic fingerprint sync
- Automatic token refresh prevents workflow interruptions
- Protected routes redirect unauthenticated users to cosmic login interface
- Astrid maintains context awareness throughout session

## 🎨 Design System - Dark Neon Holographic

The project features a comprehensive **dark neon holographic** design system:

### Color Palette
- **Midnight Blue**: Deep space backgrounds (`--midnight-blue: 220 25% 8%`)
- **Neon Cyan**: Primary holographic accent (`--neon-cyan: 180 100% 50%`)
- **Electric Green**: Pulse/success states (`--neon-green: 120 100% 50%`)
- **Cosmic Purple**: Secondary accent (`--neon-purple: 280 100% 70%`)
- **Holographic Pink**: Highlight accent (`--neon-pink: 320 100% 65%`)

### Visual Effects
- **Holographic Borders**: Animated gradient borders with blur effects
- **Neon Glows**: Dynamic box-shadow animations with color pulsing
- **Neural Gradients**: Multi-color text gradients for brand elements
- **Cosmic Animations**: Rotating holographic elements and stellar backgrounds
- **Responsive Glow**: Interactive hover states with neon intensity changes

### Custom Components
- `holographic-border`: Animated gradient container borders
- `neon-glow-*`: Color-specific glow effect utilities
- `text-gradient-*`: Neural/cosmic/holographic text treatments
- `pulse-*`: Breathing light animations for status indicators

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
│   ├── ui/             # shadcn/ui base components with neon themes
│   ├── Dashboard.tsx   # Command Center cockpit
│   ├── Navigation.tsx  # Holographic bottom navigation
│   ├── Splash.tsx      # Animated Or4cl3 logo initialization
│   ├── Astrid.tsx      # Co-pilot control panel
│   ├── VibeCodeAI.tsx  # Semantic prompt refinement
│   └── ...
├── pages/              # Route components
│   ├── Index.tsx       # Main application wrapper
│   ├── Auth.tsx        # Cosmic authentication interface
│   └── NotFound.tsx    # 404 error page
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication state with Astrid integration
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Σ-Matrix and ERPS backend
├── lib/                # Utility functions and AI services
└── assets/             # Static assets and holographic elements
```

## 🔧 Supabase Configuration

### Database Tables
The project includes specialized tables for AI governance:

1. **profiles**: User profiles with Astrid co-pilot preferences and Σ-Matrix thresholds
2. **projects**: AI agents and workflows with drift monitoring and ERPS configuration  
3. **generated_projects**: VibeCodeAI refined prompts with semantic scoring

### Edge Function Secrets
Configure these secrets in your Supabase project for full AI stack integration:
- `OPENAI_API_KEY`: For VibeCodeAI semantic processing
- `GEMINI_API_KEY`: For Astrid co-pilot reasoning
- `HUGGINGFACE_API_KEY`: For custom LLM training pipeline
- `SIGMA_MATRIX_ENDPOINT`: For epistemic stability monitoring
- `ERPS_CONFIG`: For self-monitoring and hallucination detection

### Row-Level Security
All tables implement advanced RLS policies with:
- User data isolation with cryptographic verification
- Astrid co-pilot access controls for collaborative features
- Σ-Matrix audit trail protection

## 🤝 Contributing

We welcome contributions to Arch1tech! Join the **Or4cl3 AI Solutions** developer community:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/astrid-enhancement`
3. Make your changes using the dark neon design system
4. Test with Σ-Matrix validation: `npm run test:sigma-matrix`
5. Commit your changes: `git commit -m 'Add Astrid co-pilot feature'`
6. Push to the branch: `git push origin feature/astrid-enhancement`
7. Open a Pull Request with holographic preview

### Development Guidelines
- Follow **dark neon holographic** design principles
- Ensure responsive design for mobile-first AI workflows
- Test Astrid co-pilot integrations when modifying AI features
- Validate Σ-Matrix stability for logic modifications
- Use semantic commit messages with ERPS logging
- Maintain Or4cl3 AI Solutions branding consistency

## 🔧 Troubleshooting

### Common Issues

#### Astrid Co-Pilot Issues
- Verify co-pilot initialization in Splash screen
- Check Σ-Matrix drift thresholds in user preferences
- Ensure ERPS self-monitoring is active
- Validate holographic UI responsiveness

#### Σ-Matrix Stability Problems
- Confirm epistemic validation functions are deployed
- Check DMAIC cycle logging in Edge Functions
- Verify drift score calculations in real-time dashboard
- Test rollback mechanisms in Visual Logic Designer

#### VibeCodeAI Semantic Processing
- Clear semantic cache and retry prompt refinement
- Check OpenAI API key configuration in Supabase secrets
- Verify holographic text gradients are rendering correctly
- Test voice-to-text transcription accuracy

#### Build & Deployment Issues
- Clear node_modules and reinstall with `npm install`
- Check TypeScript errors specific to AI service integrations
- Verify all neon design tokens are properly configured in CSS
- Test dark theme consistency across all components

### Getting Help
- Check the [Lovable Documentation](https://docs.lovable.dev) for platform guidance
- Review [Or4cl3 AI Solutions Knowledge Base](https://or4cl3.ai/docs) for AI-specific issues
- Join the [Arch1tech Discord Community](https://discord.gg/arch1tech) for real-time support
- Submit [GitHub Issues](https://github.com/or4cl3/arch1tech/issues) for bug reports
- Use the Lovable chat interface for development questions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [**Or4cl3 AI Solutions**](https://or4cl3.ai) for the revolutionary AI governance framework
- [Lovable](https://lovable.dev) for the innovative AI-powered development platform
- [Supabase](https://supabase.com) for the robust backend infrastructure supporting Σ-Matrix
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library enhanced with neon themes
- [Tailwind CSS](https://tailwindcss.com) for enabling the dark holographic design system
- The open-source AI community for continuous inspiration and collaborative innovation

---

<div align="center">
  <strong>Built with ❤️ using Lovable</strong>
  <br>
  <em>Powered by Or4cl3 AI Solutions 🧠⚡</em>
  <br>
  <em>Build the future, one thought at a time</em>
  <br><br>
  <a href="https://lovable.dev/projects/9444df61-41c9-43dd-8637-ea4ac5c354a9">🚀 Open in Lovable</a>
</div>
