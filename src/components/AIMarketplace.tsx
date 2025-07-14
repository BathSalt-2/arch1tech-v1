import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Star, 
  Download, 
  TrendingUp, 
  Bot, 
  MessageSquare, 
  Brain,
  Zap,
  Shield,
  Code,
  Database,
  Users
} from "lucide-react";

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  price: 'free' | 'premium';
  icon: any;
  tags: string[];
  complexity: 'low' | 'medium' | 'high';
}

export function AIMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const agentTemplates: AgentTemplate[] = [
    {
      id: "customer-support",
      name: "Customer Support Bot",
      description: "Handle customer inquiries with natural language understanding and CRM integration",
      category: "customer-service",
      rating: 4.8,
      downloads: 1250,
      price: "free",
      icon: MessageSquare,
      tags: ["crm", "support", "multilingual"],
      complexity: "medium"
    },
    {
      id: "data-analyst",
      name: "AI Data Analyst",
      description: "Analyze complex datasets and generate insights with natural language queries",
      category: "analytics",
      rating: 4.9,
      downloads: 890,
      price: "premium",
      icon: TrendingUp,
      tags: ["sql", "visualization", "reporting"],
      complexity: "high"
    },
    {
      id: "code-reviewer",
      name: "Code Review Assistant",
      description: "Automated code review with security scanning and best practice suggestions",
      category: "development",
      rating: 4.7,
      downloads: 2100,
      price: "free",
      icon: Code,
      tags: ["security", "quality", "automation"],
      complexity: "high"
    },
    {
      id: "personal-assistant",
      name: "Personal AI Assistant",
      description: "Manage schedules, emails, and tasks with intelligent prioritization",
      category: "productivity",
      rating: 4.6,
      downloads: 3200,
      price: "free",
      icon: Bot,
      tags: ["scheduling", "email", "productivity"],
      complexity: "low"
    },
    {
      id: "content-generator",
      name: "Content Creator AI",
      description: "Generate marketing content, blog posts, and social media with brand voice",
      category: "marketing",
      rating: 4.5,
      downloads: 1800,
      price: "premium",
      icon: Brain,
      tags: ["content", "seo", "social-media"],
      complexity: "medium"
    },
    {
      id: "fraud-detector",
      name: "Fraud Detection Engine",
      description: "Real-time fraud detection with machine learning and rule-based engines",
      category: "security",
      rating: 4.9,
      downloads: 670,
      price: "premium",
      icon: Shield,
      tags: ["ml", "real-time", "monitoring"],
      complexity: "high"
    }
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "customer-service", name: "Customer Service" },
    { id: "analytics", name: "Analytics" },
    { id: "development", name: "Development" },
    { id: "productivity", name: "Productivity" },
    { id: "marketing", name: "Marketing" },
    { id: "security", name: "Security" }
  ];

  const filteredAgents = agentTemplates.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-neon-green';
      case 'medium': return 'text-neon-cyan';
      case 'high': return 'text-neon-purple';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
          <Database className="w-4 h-4 text-midnight-blue" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient-neural">AI Marketplace</h1>
          <p className="text-sm text-muted-foreground">Pre-built agent templates</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search agents, tags, or capabilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-muted/20 border-neon-cyan/20 focus:border-neon-cyan/50"
        />
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "neon" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-cyan">{agentTemplates.length}</div>
          <div className="text-xs text-muted-foreground">Total Agents</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-green">
            {agentTemplates.filter(a => a.price === 'free').length}
          </div>
          <div className="text-xs text-muted-foreground">Free</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-purple">
            {agentTemplates.reduce((sum, a) => sum + a.downloads, 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Downloads</div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="space-y-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="holographic-border">
            <div className="holographic-content">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center">
                      <agent.icon className="w-5 h-5 text-midnight-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground">{agent.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{agent.downloads}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={agent.price === 'free' ? 'secondary' : 'outline'}>
                      {agent.price}
                    </Badge>
                    <Badge variant="outline" className={getComplexityColor(agent.complexity)}>
                      {agent.complexity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {agent.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {agent.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="neon" size="sm" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Deploy
                  </Button>
                  <Button variant="ghost" size="sm">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="border-muted">
          <CardContent className="p-8 text-center">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No agents found matching your criteria.</p>
            <Button variant="ghost" className="mt-2" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}>
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Community Section */}
      <Card className="border-neon-green/30 bg-neon-green/5">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-midnight-blue" />
            </div>
            <div>
              <p className="text-sm font-medium">Join the Community</p>
              <p className="text-xs text-muted-foreground">
                Share your agents • Get feedback • Collaborate with others
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}