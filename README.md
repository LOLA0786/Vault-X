# VaultX - Private Client Project

**CONFIDENTIAL - PROPRIETARY SOFTWARE**

A secure AI-powered file management platform with end-to-end encryption, developed for [Client Company Name].

## 🔒 Security Features

- **End-to-End Encryption**: All files and chat history encrypted client-side
- **Zero-Knowledge Architecture**: Server never sees unencrypted data
- **Secure Key Management**: Client-side key generation and storage
- **Privacy-First Design**: Enterprise-grade data protection

## 🚀 Core Features

- **Secure File Upload**: Drag & drop file upload with client-side encryption
- **AI Chat Integration**: Multiple AI providers (OpenAI, Grok, Gemini)
- **Custom AI Agents**: Create personalized AI assistants
- **Encrypted Chat History**: All conversations stored securely
- **Modern UI**: Professional interface with dark/light themes
- **File Processing**: Multi-format file support with text extraction and analysis

### 📁 Supported File Formats

- **Documents**: PDF, DOC, DOCX - Full text extraction and AI analysis
- **Text Files**: TXT, MD - Direct text processing and formatting
- **Data Files**: CSV - Structured data parsing with column analysis
- **Images**: PNG, JPG, JPEG, GIF, WEBP - Secure storage with AI-ready processing
- **File Size**: Up to 50MB per file with client-side encryption

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Encryption**: AES-256-GCM client-side encryption
- **UI Components**: Radix UI, Framer Motion
- **Authentication**: Passport.js with secure sessions

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- AI provider API keys (optional)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Initialize database**
   ```bash
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🌐 Environment Configuration

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/vaultx

# AI Providers (Configure as needed)
OPENAI_API_KEY=your_openai_api_key
GROK_API_KEY=your_grok_api_key  
GEMINI_API_KEY=your_gemini_api_key

# Security
SESSION_SECRET=your_secure_session_secret_minimum_32_chars

# Server
PORT=3000
NODE_ENV=development
```

## 🚀 Deployment

### Docker Deployment
```bash
docker build -t vaultx .
docker-compose up -d
```

### Production Build
```bash
npm run build
npm start
```

## 🏗️ Architecture Overview

### Security Architecture
- **Client-Side Encryption**: AES-256-GCM with PBKDF2 key derivation
- **Zero-Knowledge**: Server never accesses unencrypted data
- **Session Security**: Secure session management with CSRF protection
- **Input Validation**: Comprehensive sanitization and validation

### Component Architecture
- **ModernCard**: Professional card layouts with gradients
- **ModernChat**: Advanced chat interface with encryption
- **ModernStats**: Beautiful statistics displays
- **ModernNavigation**: Responsive sidebar navigation
- **ModernFileUpload**: Secure drag & drop file handling
- **Theme System**: Dark/light mode with smooth transitions

## 📡 API Reference

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### File Management
- `GET /api/files` - List user files
- `POST /api/files` - Upload encrypted file
- `DELETE /api/files/:id` - Delete file

### Chat System
- `GET /api/chat-sessions` - List chat sessions
- `POST /api/chat-sessions` - Create new session
- `PUT /api/chat-sessions/:id` - Update session

### AI Agents
- `GET /api/agents` - List user agents
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

## 🔐 Security Compliance

- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based access with secure authentication
- **Audit Logging**: Comprehensive activity logging for security monitoring
- **Privacy Protection**: Zero-knowledge architecture ensures data privacy

## 📋 Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Component-based architecture

### Security Practices
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- XSS protection with content sanitization
- CSRF protection with secure tokens

## � Important Notes

- **CONFIDENTIAL**: This is proprietary software for Pentaprime Solutions
- **NO PUBLIC DISTRIBUTION**: Do not share or distribute this code
- **SECURE DEVELOPMENT**: Follow all security guidelines during development
- **CLIENT APPROVAL**: All changes require client approval before deployment



**© 2025 [Pentaprime Solutions] - All Rights Reserved**
