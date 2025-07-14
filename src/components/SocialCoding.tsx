import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Trophy, 
  Star, 
  MessageCircle, 
  Share2, 
  Heart, 
  Award,
  Code,
  GitBranch,
  Eye,
  ThumbsUp,
  Calendar,
  Filter
} from "lucide-react";

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
  likes: number;
  comments: number;
  tags: string[];
  timestamp: Date;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  timeLimit: string;
  prize: string;
  startDate: Date;
  endDate: Date;
  tags: string[];
}

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar: string;
    expertise: string[];
  };
  rating: number;
  comment: string;
  timestamp: Date;
  helpful: number;
}

export const SocialCoding = () => {
  const [activeTab, setActiveTab] = useState<'community' | 'challenges' | 'reviews'>('community');
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newSnippet, setNewSnippet] = useState({ title: '', code: '', language: 'javascript' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - in real implementation, fetch from backend
    const mockSnippets: CodeSnippet[] = [
      {
        id: '1',
        title: 'React Custom Hook for API Calls',
        code: `const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData).finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading };
};`,
        language: 'javascript',
        author: { name: 'Sarah Chen', avatar: '/api/placeholder/32/32', reputation: 1250 },
        likes: 42,
        comments: 8,
        tags: ['react', 'hooks', 'api'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        difficulty: 'intermediate'
      },
      {
        id: '2',
        title: 'CSS Grid Auto-Fit Layout',
        code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}`,
        language: 'css',
        author: { name: 'Alex Rodriguez', avatar: '/api/placeholder/32/32', reputation: 890 },
        likes: 28,
        comments: 4,
        tags: ['css', 'grid', 'responsive'],
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        difficulty: 'beginner'
      }
    ];

    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Build a Real-time Chat App',
        description: 'Create a real-time chat application using WebSockets and your preferred frontend framework.',
        difficulty: 'medium',
        participants: 127,
        timeLimit: '7 days',
        prize: '$500 + Certificate',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: ['websockets', 'fullstack', 'realtime']
      },
      {
        id: '2',
        title: 'AI-Powered Code Formatter',
        description: 'Develop an intelligent code formatter that can understand context and improve code readability.',
        difficulty: 'hard',
        participants: 45,
        timeLimit: '14 days',
        prize: '$1000 + Mentorship',
        startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        tags: ['ai', 'nlp', 'tools']
      }
    ];

    const mockReviews: Review[] = [
      {
        id: '1',
        reviewer: { 
          name: 'Dr. Emily Watson', 
          avatar: '/api/placeholder/32/32',
          expertise: ['React', 'Node.js', 'Architecture']
        },
        rating: 5,
        comment: 'Excellent code structure and clean implementation. The error handling is particularly well done.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        helpful: 12
      },
      {
        id: '2',
        reviewer: { 
          name: 'Michael Zhang', 
          avatar: '/api/placeholder/32/32',
          expertise: ['TypeScript', 'Testing', 'Performance']
        },
        rating: 4,
        comment: 'Good approach overall. Consider adding type safety and unit tests for better maintainability.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        helpful: 8
      }
    ];

    setCodeSnippets(mockSnippets);
    setChallenges(mockChallenges);
    setReviews(mockReviews);
  }, []);

  const handleLike = (snippetId: string) => {
    setCodeSnippets(prev => prev.map(snippet => 
      snippet.id === snippetId 
        ? { ...snippet, likes: snippet.likes + 1 }
        : snippet
    ));
  };

  const shareSnippet = (snippetId: string) => {
    // Implementation for sharing functionality
    console.log('Sharing snippet:', snippetId);
  };

  const submitSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) return;
    
    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      code: newSnippet.code,
      language: newSnippet.language,
      author: { name: 'You', avatar: '/api/placeholder/32/32', reputation: 500 },
      likes: 0,
      comments: 0,
      tags: [],
      timestamp: new Date(),
      difficulty: 'intermediate'
    };

    setCodeSnippets(prev => [snippet, ...prev]);
    setNewSnippet({ title: '', code: '', language: 'javascript' });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
      case 'beginner': return 'bg-green-500';
      case 'medium':
      case 'intermediate': return 'bg-yellow-500';
      case 'hard':
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Social Coding Community
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'community' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('community')}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              Community
            </Button>
            <Button 
              variant={activeTab === 'challenges' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('challenges')}
              className="gap-2"
            >
              <Trophy className="h-4 w-4" />
              Challenges
            </Button>
            <Button 
              variant={activeTab === 'reviews' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('reviews')}
              className="gap-2"
            >
              <Star className="h-4 w-4" />
              Peer Reviews
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {activeTab === 'community' && (
            <div className="space-y-6">
              {/* Share New Snippet */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg">Share a Code Snippet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Snippet title..."
                    value={newSnippet.title}
                    onChange={(e) => setNewSnippet(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <div className="flex gap-4">
                    <Select value={newSnippet.language} onValueChange={(value) => setNewSnippet(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Paste your code here..."
                    value={newSnippet.code}
                    onChange={(e) => setNewSnippet(prev => ({ ...prev, code: e.target.value }))}
                    className="font-mono min-h-[120px]"
                  />
                  <Button onClick={submitSnippet} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Snippet
                  </Button>
                </CardContent>
              </Card>

              {/* Filter */}
              <div className="flex items-center gap-4">
                <Filter className="h-4 w-4" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Code Snippets */}
              <div className="space-y-4">
                {codeSnippets.map((snippet) => (
                  <Card key={snippet.id} className="border-muted">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{snippet.title}</h3>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={snippet.author.avatar} />
                                <AvatarFallback>{snippet.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{snippet.author.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {snippet.author.reputation} rep
                              </Badge>
                            </div>
                            <Badge className={`text-xs ${getDifficultyColor(snippet.difficulty)}`}>
                              {snippet.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {snippet.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <pre className="bg-muted/50 p-3 rounded-lg overflow-x-auto text-sm">
                        <code>{snippet.code}</code>
                      </pre>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLike(snippet.id)}
                            className="gap-1"
                          >
                            <Heart className="h-4 w-4" />
                            {snippet.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {snippet.comments}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => shareSnippet(snippet.id)}
                            className="gap-1"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          {snippet.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="border-muted">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <p className="text-muted-foreground">{challenge.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {challenge.participants} participants
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {challenge.timeLimit}
                          </div>
                          <Badge className={`${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{challenge.prize}</div>
                        <div className="text-xs text-muted-foreground">
                          Ends {challenge.endDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {challenge.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="gap-2">
                        <Trophy className="h-4 w-4" />
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Request a Code Review</h3>
                  <Textarea placeholder="Paste your code or provide a GitHub link..." className="mb-3" />
                  <Button className="gap-2">
                    <Eye className="h-4 w-4" />
                    Request Review
                  </Button>
                </CardContent>
              </Card>

              {reviews.map((review) => (
                <Card key={review.id} className="border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={review.reviewer.avatar} />
                        <AvatarFallback>{review.reviewer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.reviewer.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {review.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {review.reviewer.expertise.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {review.helpful} helpful
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};