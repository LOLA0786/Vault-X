# Overview

AI Vault is a secure document management and AI chat application that prioritizes user privacy through client-side encryption. The application allows users to upload documents, encrypt them locally, store them securely, and interact with a Gemini AI assistant that can analyze their encrypted files. All sensitive data is encrypted before leaving the user's browser, ensuring complete privacy and security.

## Current Status
The MVP is complete and ready for local deployment. All core features are implemented:
- User registration/login with password-derived encryption keys
- Client-side file encryption and secure upload to server
- Gemini AI integration for document analysis and chat
- Encrypted conversation history storage
- Key management and backup functionality

## Local Setup Instructions

1. **Prerequisites**
   - Node.js 20+ installed
   - Gemini API key from https://aistudio.google.com/app/apikey

2. **Installation**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```
   
5. **Access the Application**
   Open http://localhost:5000 in your browser

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, utilizing a modern component-based architecture:
- **UI Framework**: Radix UI components with shadcn/ui styling system for consistent, accessible components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The backend follows a RESTful API pattern built on Express.js:
- **Framework**: Express.js with TypeScript for type-safe server-side development
- **Storage Layer**: Abstract storage interface with in-memory implementation (ready for database integration)
- **API Structure**: RESTful endpoints for users, files, and chat sessions with proper error handling
- **Development**: Hot-reload development server with Vite integration

## Database Design
The application uses Drizzle ORM with PostgreSQL schemas:
- **Users**: Basic user management with email-based authentication
- **Encrypted Files**: File metadata with encrypted content storage
- **Chat Sessions**: Conversation history stored with encryption
- **Migration System**: Drizzle Kit for database schema management and migrations

## Security Architecture
Privacy-first design with client-side encryption:
- **Encryption**: AES encryption using CryptoJS with password-derived keys
- **Key Management**: PBKDF2 key derivation with configurable iterations
- **Data Flow**: All sensitive data encrypted before transmission to server
- **Storage**: Server only stores encrypted data, cannot access plaintext content

## AI Integration
Google Gemini integration for document analysis:
- **Model**: Gemini 2.5 Flash for optimal performance and capabilities
- **Context Management**: Conversation history maintained for coherent interactions
- **File Analysis**: AI can analyze encrypted documents after client-side decryption
- **Privacy**: AI never receives unencrypted sensitive data

## Authentication System
Simple email-based authentication with encryption key derivation:
- **Registration**: User creation with password-based encryption key generation
- **Login**: Authentication with automatic key derivation from password
- **Session Management**: Local storage for user session and encryption keys
- **Security**: No passwords stored server-side, only encrypted data

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Node.js web framework for RESTful API development
- **TypeScript**: Type-safe development across frontend and backend
- **Vite**: Build tool and development server with fast HMR

## Database and ORM
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL client for database connections
- **PostgreSQL**: Primary database system (configurable via DATABASE_URL)

## UI and Styling
- **Radix UI**: Headless, accessible UI component primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component system using Radix UI and Tailwind
- **Lucide React**: Modern icon library for consistent iconography

## State Management and Data Fetching
- **TanStack React Query**: Powerful data fetching and caching library
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation for runtime type checking

## Security and Encryption
- **CryptoJS**: Client-side encryption library for AES encryption
- **PBKDF2**: Key derivation function for password-based encryption keys

## AI and External Services
- **Google Gemini**: Gemini 2.5 Flash integration for document analysis and chat functionality
- **Browser-based API**: Direct Gemini API calls from frontend (development setup)

## Development Tools
- **ESBuild**: Fast bundler for production server builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer
- **Wouter**: Minimal routing library for React applications

## Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling for Replit environment