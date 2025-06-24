# PE Research AI

## Overview

PE Research AI is a specialized private equity research chat application that combines React frontend with Express backend to provide intelligent analysis and insights for PE professionals. The system leverages OpenAI's GPT-4o model to deliver comprehensive research on target companies, market intelligence, deal sourcing, and financial performance analysis.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom PE-themed color variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ESM modules
- **API Structure**: RESTful endpoints for chat functionality
- **AI Integration**: OpenAI API using GPT-4o model for specialized PE research responses

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Shared schema definitions between client and server
- **Current Storage**: In-memory storage implementation with interface for future database migration
- **Migration Ready**: Database migrations configured in `/migrations` directory

## Key Components

### Chat System
- **Real-time Messaging**: Conversation flow with user and assistant messages
- **Session Management**: Unique session IDs for conversation tracking
- **Typing Indicators**: Visual feedback during AI response generation
- **Message Actions**: Copy, export, and timestamp functionality

### AI Research Engine
- **Azure OpenAI Integration**: Complete migration from OpenAI to Azure OpenAI for enterprise compliance
- **Configurable Settings**: Runtime configuration of API key, endpoint, deployment name, and API version
- **Specialized Prompts**: Tailored for PE research including market analysis, deal sourcing, and financial evaluation
- **Context Awareness**: Maintains conversation context within sessions
- **Fallback System**: Intelligent fallback responses when Azure OpenAI is unavailable

### UI/UX Design
- **Welcome Screen**: Interactive sample questions for common PE research scenarios
- **Professional Interface**: Clean, business-focused design with PE-branded colors
- **Responsive Layout**: Mobile-first design with desktop optimization
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

1. **User Input**: Message submitted through chat interface
2. **Request Validation**: Zod schema validation for message content and session ID
3. **Message Storage**: User message stored in memory/database
4. **AI Processing**: Azure OpenAI API call with specialized PE research system prompt
5. **Response Generation**: Assistant response generated and stored
6. **Client Update**: Both messages returned to frontend for display

## External Dependencies

### Core Dependencies
- **Azure OpenAI API**: GPT-4o model deployment for AI-powered research responses
- **Neon Database**: PostgreSQL database service (configured but not actively used)
- **shadcn/ui**: Component library for consistent UI patterns

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **Replit Integration**: Development environment with runtime error handling
- **ESBuild**: Production bundling for server-side code

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` with hot reloading
- **Port Configuration**: Server runs on port 5000 with external port 80
- **File Watching**: Automatic restart on server changes

### Production Deployment
- **Build Process**: Vite build for client, ESBuild for server
- **Static Assets**: Client built to `dist/public` directory
- **Server Bundle**: Single bundled server file in `dist/index.js`
- **Environment Variables**: Database URL and Azure OpenAI credentials required

### Scaling Considerations
- **Database Migration**: Ready to switch from in-memory to PostgreSQL
- **Session Persistence**: Current in-memory storage suitable for single-instance deployment
- **API Rate Limiting**: Azure OpenAI API usage should be monitored for production scaling

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

- June 20, 2025: Complete migration from OpenAI to Azure OpenAI
  - Implemented Azure OpenAI client with configurable settings
  - Added configuration management system with file/environment support  
  - Created Azure configuration UI modal with connection testing
  - Updated all API calls to use Azure OpenAI endpoints
  - Added fallback response system for unavailable service
- June 19, 2025: Initial setup