import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Code,
  Zap,
  Target,
  Brain,
  Clock,
  Award,
  Calendar,
  AlertTriangle
} from "lucide-react";

interface ProjectMetrics {
  name: string;
  performance: number;
  bugs: number;
  completion: number;
  users: number;
}

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

export const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("performance");
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetrics[]>([]);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  // Mock data - in real implementation, this would come from your analytics service
  useEffect(() => {
    const mockMetrics: ProjectMetrics[] = [
      { name: "E-commerce App", performance: 92, bugs: 3, completion: 85, users: 1250 },
      { name: "Analytics Dashboard", performance: 88, bugs: 1, completion: 95, users: 890 },
      { name: "Social Platform", performance: 76, bugs: 8, completion: 60, users: 2100 },
      { name: "Mobile Game", performance: 94, bugs: 2, completion: 70, users: 3500 },
      { name: "AI Chatbot", performance: 91, bugs: 4, completion: 80, users: 750 }
    ];

    const mockPredictions: PredictionData[] = [
      { metric: "User Growth", current: 1250, predicted: 1680, confidence: 87, trend: 'up' },
      { metric: "Performance Score", current: 88, predicted: 91, confidence: 92, trend: 'up' },
      { metric: "Bug Count", current: 15, predicted: 8, confidence: 78, trend: 'down' },
      { metric: "Completion Rate", current: 78, predicted: 85, confidence: 84, trend: 'up' }
    ];

    const mockInsights = [
      "Performance has improved 12% over the last week",
      "User engagement peaks on weekends",
      "Mobile traffic accounts for 68% of total visits",
      "API response times are 23% faster than last month",
      "Code quality score increased by 15 points"
    ];

    setProjectMetrics(mockMetrics);
    setPredictions(mockPredictions);
    setInsights(mockInsights);
  }, [timeRange]);

  const performanceData = [
    { name: 'Mon', performance: 85, bugs: 12, users: 120 },
    { name: 'Tue', performance: 88, bugs: 8, users: 150 },
    { name: 'Wed', performance: 92, bugs: 5, users: 180 },
    { name: 'Thu', performance: 89, bugs: 7, users: 165 },
    { name: 'Fri', performance: 94, bugs: 3, users: 200 },
    { name: 'Sat', performance: 91, bugs: 4, users: 190 },
    { name: 'Sun', performance: 93, bugs: 2, users: 210 }
  ];

  const bugDistribution = [
    { name: 'Critical', value: 2, color: '#ef4444' },
    { name: 'High', value: 5, color: '#f97316' },
    { name: 'Medium', value: 12, color: '#eab308' },
    { name: 'Low', value: 8, color: '#22c55e' }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      case 'bugs': return <AlertTriangle className="h-4 w-4" />;
      case 'completion': return <Target className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Advanced Analytics & Predictive Insights
            </CardTitle>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Total Users</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">8,490</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% from last week
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Avg Performance</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">91.2%</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +3.2% improvement
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Active Issues</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">27</div>
                  <div className="flex items-center gap-1 text-sm text-red-600">
                    <TrendingDown className="h-3 w-3" />
                    -18% from last week
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +5.8% improvement
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="performance" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bug Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={bugDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {bugDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Project Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectMetrics}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                  <Bar dataKey="completion" fill="#10b981" name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predictive Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(prediction.metric)}
                        <span className="font-medium">{prediction.metric}</span>
                        {getTrendIcon(prediction.trend)}
                      </div>
                      <Badge variant="outline">
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: {prediction.current}</span>
                        <span>Predicted: {prediction.predicted}</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{insight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};