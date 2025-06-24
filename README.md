# PE Research AI

A specialized Private Equity research chat application that provides intelligent analysis and insights for PE professionals. Built with React, Express, and Azure OpenAI integration.

## 🎯 Purpose
 
PE Research AI is designed to streamline private equity research workflows by providing:

- **Company Analysis**: Deep dive into target companies with PE investment history and performance metrics
- **Market Intelligence**: Sector-specific investment opportunities and competitive landscape analysis
- **Deal Sourcing**: Target identification frameworks and transaction analysis
- **Financial Analysis**: Valuation multiples, benchmarking, and performance assessment
- **Due Diligence**: Risk assessment frameworks and investment thesis development

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** with custom PE-themed styling
- **TanStack React Query** for efficient server state management
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** server with TypeScript
- **Azure OpenAI** integration using GPT-4o model
- **RESTful API** design with comprehensive error handling
- **Drizzle ORM** configured for PostgreSQL (currently using in-memory storage)
- **Real-time logging** for API requests and responses

## 🚀 Features

### Core Functionality
- **Intelligent Chat Interface**: Specialized PE research assistant
- **Session Management**: Conversation history and context retention
- **Export Capabilities**: Download conversation transcripts
- **Azure OpenAI Configuration**: Customizable AI model settings
- **Responsive Design**: Optimized for desktop and mobile use

### PE-Specific Analysis
- **Company Research**: Financial performance, PE history, strategic positioning
- **Market Opportunities**: Sector trends, investment themes, deal flow analysis
- **Valuation Frameworks**: Industry-specific multiples and benchmarking
- **Risk Assessment**: Due diligence checklists and investment considerations

## 🛠️ Technology Stack

### Frontend Dependencies
```json
{
  "react": "^18.x",
  "typescript": "^5.x",
  "vite": "^5.x",
  "@radix-ui/react-*": "Various UI primitives",
  "@tanstack/react-query": "Server state management",
  "tailwindcss": "Utility-first CSS framework",
  "wouter": "Lightweight routing"
}
```

### Backend Dependencies
```json
{
  "express": "Web application framework",
  "drizzle-orm": "Type-safe ORM",
  "@azure/openai": "Azure OpenAI client",
  "zod": "Schema validation",
  "tsx": "TypeScript execution"
}
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Azure OpenAI** (Optional)
   - The app includes hardcoded Azure OpenAI credentials for immediate use
   - To use your own credentials, configure them through the settings modal in the app
   - Or update the configuration in `server/storage.ts`

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── chat/       # Chat-specific components
│   │   │   └── ui/         # shadcn/ui component library
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   └── pages/          # Application pages/routes
├── server/                 # Express backend server
│   ├── azure-config-routes.ts    # Azure OpenAI configuration endpoints
│   ├── azure-openai-client.ts    # Azure OpenAI client wrapper
│   ├── config-manager.ts         # Configuration management
│   ├── routes.ts                  # Main API routes
│   ├── storage.ts                 # Data storage and AI logic
│   └── vite.ts                    # Vite development server setup
├── shared/                 # Shared TypeScript schemas and types
└── migrations/             # Database migration files (future use)
```

## 🔧 Configuration

### Environment Setup
The application is configured to run on port 5000 for optimal Replit compatibility. The server binds to `0.0.0.0` to ensure accessibility.

### Azure OpenAI Configuration
- **Default Setup**: Hardcoded credentials included for immediate use
- **Custom Setup**: Use the settings modal in the application
- **Manual Configuration**: Edit `server/storage.ts` with your Azure OpenAI credentials

### Database Migration
Currently using in-memory storage with PostgreSQL migration support ready:
```bash
npm run db:push  # Push schema changes to database (when configured)
```

## 🎨 Customization

### Styling
- Custom PE-themed CSS variables in `client/src/index.css`
- Tailwind configuration in `tailwind.config.ts`
- Component-level styling using shadcn/ui patterns

### AI Responses
- PE-specific prompts and fallback responses in `server/storage.ts`
- Customizable system prompts for different analysis types
- Intelligent fallback responses when AI API is unavailable

## 🔒 Security Features

- **Input Validation**: Zod schema validation for all API requests
- **Error Handling**: Comprehensive error boundaries and logging
- **Session Isolation**: Unique session IDs for conversation privacy
- **API Security**: Structured error responses without sensitive data exposure

## 📊 Monitoring & Logging

- Real-time API request logging with response times
- Error tracking and debugging information
- Performance monitoring for AI response generation
- Session analytics and usage patterns

## 🚀 Deployment

### Replit Deployment
1. **Development**: Use the Run button to start the development server
2. **Production**: The app is configured for Replit's deployment system
3. **Port Configuration**: Optimized for port 5000 with proper forwarding

### Environment Variables
Configure through Replit's Secrets or environment:
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint
- `NODE_ENV`: Set to 'production' for production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing code patterns
4. Test thoroughly with PE-specific use cases
5. Submit a pull request with detailed description

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Use Cases

### For PE Professionals
- **Investment Analysis**: Research potential acquisition targets
- **Market Research**: Analyze sector trends and opportunities
- **Due Diligence**: Framework development and risk assessment
- **Financial Modeling**: Valuation guidance and benchmark analysis

### For Investment Teams
- **Deal Sourcing**: Target identification and screening
- **Competitive Analysis**: Market positioning and comparison
- **Portfolio Management**: Performance tracking and optimization
- **Exit Planning**: Strategic and financial buyer analysis

## 🔮 Future Enhancements

- **Database Integration**: PostgreSQL implementation with persistent storage
- **Advanced Analytics**: Charts and visualizations for financial data
- **Document Processing**: PDF upload and analysis capabilities
- **Team Collaboration**: Multi-user sessions and shared workspaces
- **API Integrations**: Real-time financial data and market feeds

---

**Built for Private Equity professionals who demand precision, speed, and intelligence in their research workflows.**
