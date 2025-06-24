import { Building, BarChart3, TrendingUp, Search, Brain } from "lucide-react";

interface WelcomeScreenProps {
  onSampleQuestion: (question: string) => void;
}

const sampleQuestions = [
  {
    icon: Building,
    title: "Company Analysis",
    description: "Analyze PE involvement history of a target company",
    question: "Analyze the PE involvement history of Slack Technologies"
  },
  {
    icon: BarChart3,
    title: "Market Intelligence", 
    description: "Explore market opportunities and trends",
    question: "What are the key market opportunities in fintech for PE firms in 2024?"
  },
  {
    icon: TrendingUp,
    title: "Financial Analysis",
    description: "Compare financial metrics and performance", 
    question: "Compare the financial performance of recent SaaS buyouts"
  },
  {
    icon: Search,
    title: "Deal Sourcing",
    description: "Find and evaluate potential targets",
    question: "Identify potential acquisition targets in healthcare technology"
  }
];

export default function WelcomeScreen({ onSampleQuestion }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="text-center max-w-2xl animate-fade-in">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 pe-gradient"
        >
          <Brain className="text-white w-8 h-8" />
        </div>
        
        <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--pe-text)" }}>
          Welcome to PE Research AI
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your intelligent assistant for private equity research and analysis. 
          Ask questions about target companies, market intelligence, deal sourcing, and financial performance.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {sampleQuestions.map((item, index) => (
            <button
              key={index}
              onClick={() => onSampleQuestion(item.question)}
              className="p-4 bg-white border rounded-xl hover:shadow-md transition-all duration-200 text-left group hover:border-orange-500"
              style={{ borderColor: "var(--pe-border)" }}
            >
              <div className="flex items-start space-x-3">
                <item.icon 
                  className="mt-1 group-hover:scale-110 transition-transform w-5 h-5" 
                  style={{ color: "var(--pe-primary)" }}
                />
                <div>
                  <h3 className="font-medium mb-1" style={{ color: "var(--pe-text)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
