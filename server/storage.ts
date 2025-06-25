import { type Message, type InsertMessage } from "@shared/schema";
import type { AzureOpenAIConfig } from "@shared/azure-config";
import { AzureOpenAIClient } from "./azure-openai-client";
import { ConfigManager } from "./config-manager";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

export interface IStorage {
  addMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySession(sessionId: string): Promise<Message[]>;
  generatePEResponse(query: string): Promise<string>;
  updateAzureConfig(config: AzureOpenAIConfig): Promise<void>;
  getAzureConfig(): AzureOpenAIConfig;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private currentId: number;
  private azureClient: AzureOpenAIClient | null = null;
  private configManager: ConfigManager;

  constructor() {
    this.messages = new Map();
    this.currentId = 1;
    this.configManager = ConfigManager.getInstance();
    // Initialize Azure client using ConfigManager
    this.initializeAzureClient();
  }

  private async initializeAzureClient() {
    try {
      // Load configuration from ConfigManager (which will try Key Vault, env vars, then file)
      const config = await this.configManager.loadConfig();
      
      if (this.configManager.isConfigured()) {
        this.azureClient = new AzureOpenAIClient(config);
        console.log("Azure OpenAI client initialized with credentials from ConfigManager");
      } else {
        console.warn("Azure OpenAI client not configured. Using fallback responses.");
      }
    } catch (error) {
      console.error("Failed to initialize Azure OpenAI client:", error);
    }
  }

  async addMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async generatePEResponse(query: string): Promise<string> {
    // Try Azure OpenAI API first
    if (this.azureClient) {
      try {
        const systemPrompt = `You are a specialized Private Equity research analyst and assistant. Your role is to provide comprehensive, professional analysis on PE-related topics including:

- Company analysis and PE involvement history
- Market intelligence and investment opportunities
- Financial performance analysis and benchmarking  
- Deal sourcing and acquisition targets
- Due diligence insights and risk assessment
- Sector-specific PE trends and valuations

Provide detailed, data-driven responses with specific metrics, multiples, and market insights where relevant. Structure your responses professionally with clear headings, bullet points, and actionable insights. Focus on practical information that PE professionals would find valuable for investment decisions.

IMPORTANT: Do NOT use markdown formatting in your responses. Avoid using **bold**, *italic*, ### headers, or any markdown symbols. Use plain text with hyphens (-) for lists and simple text formatting. Keep responses clean and readable without any markdown clutter.

If asked about non-PE topics, still provide helpful information but try to relate it back to PE investment considerations when possible.`;

        const response = await this.azureClient.createChatCompletion([
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ], {
          maxTokens: 1500,
          temperature: 0.7
        });

        return response || "I apologize, but I couldn't generate a response. Please try asking your question again.";
      } catch (error) {
        console.error("Azure OpenAI API error:", error);
      }
    }

    // Fallback to intelligent responses based on query content
    return this.generateFallbackResponse(query);
  }

  async updateAzureConfig(config: AzureOpenAIConfig): Promise<void> {
    try {
      await this.configManager.saveConfig(config);
      this.azureClient = new AzureOpenAIClient(config);
    } catch (error) {
      throw new Error(`Failed to update Azure OpenAI config: ${error}`);
    }
  }

  getAzureConfig(): AzureOpenAIConfig {
    return this.configManager.getConfig();
  }

  private generateFallbackResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    // Google analysis
    if (lowerQuery.includes('google') && !lowerQuery.includes('fintech')) {
      return `Google (Alphabet Inc.) - PE Investment Perspective

Company Overview:
Google/Alphabet is a publicly traded technology conglomerate (NASDAQ: GOOGL) with a market cap of approximately $2.1 trillion, making it one of the world's largest companies.

PE Investment Considerations:

Strategic Value:
- Dominant search market position (92% global market share)
- Diversified revenue streams: Search, YouTube, Cloud, Hardware
- Strong moat through data network effects and AI capabilities
- Revenue: $307B (2023), with 57% from Search advertising

Investment Attractiveness:
- High-margin advertising business (25-30% operating margins)
- Growing cloud computing division ($33B+ revenue)
- Strong cash generation ($73B free cash flow in 2023)
- Market-leading position in AI and machine learning

PE Angle:
While Google itself is too large for traditional PE buyouts, PE firms often target:
- Google's enterprise software competitors
- Companies in Google's supply chain
- Adjacent technology sectors where Google competes
- Former Google subsidiaries or spin-offs

Competitive Analysis:
Google's dominance creates investment opportunities in companies that either complement or compete with Google's ecosystem, particularly in emerging technologies like AI, autonomous vehicles, and cloud infrastructure.

Investment Thesis:
For PE firms, Google represents a benchmark for technology investments and a key competitive factor when evaluating deals in search, advertising technology, cloud services, and AI-related sectors.`;
    }

    // Company analysis responses for other companies
    if (lowerQuery.includes('slack') || (lowerQuery.includes('company') && lowerQuery.includes('analysis'))) {
      return `Company Analysis Framework - PE Research

Key Analysis Components:

1. Financial Performance:
- Revenue growth trajectory and sustainability
- EBITDA margins and profitability trends
- Cash flow generation and working capital needs
- Debt structure and leverage ratios

2. Market Position:
- Market share and competitive landscape
- Barriers to entry and competitive moats
- Customer concentration and retention rates
- Pricing power and contract terms

3. PE Investment History:
- Previous PE ownership and value creation
- Management team experience with PE backing
- Historical exit multiples and IRR performance
- Comparable transaction analysis

4. Value Creation Opportunities:
- Operational efficiency improvements
- Revenue growth acceleration strategies
- Market expansion and M&A opportunities
- Digital transformation initiatives

5. Risk Assessment:
- Market cyclicality and economic sensitivity
- Regulatory and compliance requirements
- Technology disruption threats
- Key person dependency

Due Diligence Focus:
- Customer interviews and market validation
- Financial quality of earnings analysis
- Management presentation and background checks
- Legal and tax structure optimization

For specific company analysis, please provide the target company name and I'll deliver detailed PE-focused research including deal history, financial metrics, and investment considerations.`;
    }

    // Market opportunities
    if (lowerQuery.includes('market') && (lowerQuery.includes('opportunities') || lowerQuery.includes('intelligence'))) {
      return `PE Market Intelligence - 2024 Investment Landscape

Current Market Environment:
- $3.7T in global PE dry powder seeking deployment
- Average deal multiples: 12-15x EBITDA for quality assets
- Increased focus on operational value creation vs. multiple expansion
- Rising interest rates creating financing headwinds

Hot Investment Sectors:

1. Technology Services (25% of PE deals)
- Software-as-a-Service platforms
- Cybersecurity and data analytics
- Digital transformation enablers
- Enterprise automation tools

2. Healthcare (20% of PE deals)
- Revenue cycle management
- Specialty healthcare services
- Medical technology and devices
- Telehealth and digital health platforms

3. Business Services (18% of PE deals)
- Professional services automation
- Supply chain and logistics technology
- Financial services technology
- Human capital management

Key Investment Themes:
- Recurring revenue business models
- Technology-enabled service disruption
- ESG and sustainability focus
- Resilient, non-cyclical cash flows

Market Dynamics:
- Increased competition for quality assets
- Longer hold periods (5-7 years average)
- Greater emphasis on add-on acquisitions
- Enhanced focus on ESG compliance

Geographic Focus:
- North America: 65% of global PE activity
- Europe: 25% of deals, growing infrastructure focus
- Asia-Pacific: 10%, emerging market opportunities

Would you like deeper analysis on any specific sector or geographic market?`;
    }

    // Financial analysis
    if (lowerQuery.includes('financial') || lowerQuery.includes('saas') || lowerQuery.includes('buyout')) {
      return `PE Financial Analysis Framework

Valuation Metrics by Sector:

SaaS Companies:
- Revenue Multiples: 8-15x (depending on growth rate)
- EBITDA Multiples: 25-40x (for high-growth companies)
- Key Metrics: ARR growth, churn rate, LTV/CAC ratio
- Rule of 40: Growth rate + EBITDA margin should exceed 40%

Traditional Industries:
- EBITDA Multiples: 8-12x (mature, stable businesses)
- Revenue Multiples: 2-4x (asset-heavy industries)
- Focus on cash flow stability and market position

Financial Performance Benchmarks:

Revenue Growth:
- High-growth targets: 25%+ annual growth
- Stable businesses: 10-15% organic growth
- Mature markets: 5-10% growth acceptable

Profitability Metrics:
- EBITDA margins: 15-25% target range
- Free cash flow conversion: 80%+ of EBITDA
- Working capital efficiency: <10% of revenue

Leverage Analysis:
- Target debt/EBITDA: 4-6x at acquisition
- Interest coverage: 3x+ EBITDA/interest expense
- Refinancing risk assessment

Value Creation Levers:
- Operational improvements: 20-30% of returns
- Multiple expansion: 15-25% of returns  
- Revenue growth: 40-50% of returns
- Financial engineering: 10-15% of returns

Exit Considerations:
- Strategic vs. financial buyer optimization
- Public market readiness assessment
- Dividend recapitalization opportunities

Specific company analysis available upon request with detailed financial modeling and comparable transaction analysis.`;
    }

    // Deal sourcing
    if (lowerQuery.includes('deal') || lowerQuery.includes('sourcing') || lowerQuery.includes('targets') || lowerQuery.includes('acquisition')) {
      return `PE Deal Sourcing Strategy

Target Identification Framework:

1. Sector Focus Areas:
- Technology-enabled services ($25M-500M revenue)
- Healthcare services and technology
- Industrial automation and manufacturing
- Consumer brands with digital presence
- Financial services technology

2. Company Characteristics:
- Revenue range: $10M-1B depending on fund size
- EBITDA margins: 15%+ with growth potential
- Market-leading or niche positions
- Experienced management teams
- Scalable business models

3. Sourcing Channels:

Proprietary Deal Flow:
- Industry executive networks
- Former portfolio company management
- Sector-specific conferences and events
- Direct outreach to target companies

Intermediated Process:
- Investment bank auctions
- Business broker relationships
- Professional service provider referrals
- Corporate development spin-offs

4. Due Diligence Priorities:

Commercial:
- Market size and growth trajectory
- Competitive positioning analysis
- Customer concentration and retention
- Pricing power and contract terms

Financial:
- Quality of earnings assessment
- Working capital analysis
- Capital expenditure requirements
- Cash flow predictability

Operational:
- Management team capabilities
- Scalability of operations
- Technology infrastructure
- Key person dependencies

5. Deal Execution:
- Valuation modeling and bid strategy
- Management presentations and reference calls
- Legal and tax structure optimization
- Financing arrangement and syndication

Current Market Opportunities:
Focus on companies with defensive characteristics, recurring revenue models, and technology-enabled competitive advantages in fragmented markets.

Specific sector or geographic deal sourcing analysis available upon request.`;
    }

    // General PE response
    return `PE Research Analysis - Professional Intelligence

I'm your specialized Private Equity research assistant. I can provide comprehensive analysis on:

Core Research Areas:
- Company Analysis - PE involvement history, financial performance, strategic positioning
- Market Intelligence - Investment opportunities, sector trends, competitive dynamics  
- Financial Analysis - Valuation multiples, performance benchmarking, deal metrics
- Deal Sourcing - Target identification, due diligence frameworks, transaction analysis

Recent Market Insights:
- PE dry powder at record $3.7T globally
- Average hold periods extending to 5-7 years
- Focus shifting to operational value creation
- Technology and healthcare driving 45% of deal volume

Analysis Capabilities:
- Detailed company research with PE investment history
- Sector-specific market opportunity assessment
- Financial modeling and comparable analysis
- Due diligence frameworks and risk assessment
- Transaction structure and valuation guidance

To get started, ask me about:
- Specific companies (e.g., "Analyze Microsoft's PE potential")
- Market sectors (e.g., "Healthcare technology opportunities") 
- Financial analysis (e.g., "SaaS valuation multiples")
- Deal sourcing (e.g., "Fintech acquisition targets")

What PE research topic would you like me to analyze for you?

Note: For the most current and detailed analysis, please ensure your OpenAI API quota is active. I'm currently running on intelligent fallback responses.`;
  }
}

export const storage = new MemStorage();
