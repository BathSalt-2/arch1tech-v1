import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  GraduationCap, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Video, 
  FileText, 
  Code,
  Trophy,
  Clock,
  Star,
  Brain,
  CheckCircle,
  Play,
  Lock,
  Lightbulb
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
  maxLevel: number;
  experience: number;
  category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'ai' | 'design';
}

interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'exercise' | 'project';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  completed: boolean;
  rating: number;
  thumbnail?: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  nextLesson: string;
  progress: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export const LearningPathAI = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [recommendations, setRecommendations] = useState<LearningResource[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - in real implementation, this would come from AI analysis
    const mockSkills: Skill[] = [
      { name: 'React', level: 7, maxLevel: 10, experience: 850, category: 'frontend' },
      { name: 'TypeScript', level: 6, maxLevel: 10, experience: 720, category: 'frontend' },
      { name: 'Node.js', level: 5, maxLevel: 10, experience: 480, category: 'backend' },
      { name: 'Python', level: 4, maxLevel: 10, experience: 320, category: 'backend' },
      { name: 'AI/ML', level: 3, maxLevel: 10, experience: 180, category: 'ai' },
      { name: 'Docker', level: 2, maxLevel: 10, experience: 95, category: 'devops' }
    ];

    const mockPaths: LearningPath[] = [
      {
        id: '1',
        title: 'Advanced React Patterns',
        description: 'Master advanced React concepts including hooks, context, and performance optimization',
        totalLessons: 15,
        completedLessons: 8,
        estimatedTime: '6 weeks',
        difficulty: 'advanced',
        skills: ['React', 'JavaScript', 'Performance'],
        nextLesson: 'Custom Hooks Deep Dive',
        progress: 53
      },
      {
        id: '2',
        title: 'Full-Stack TypeScript',
        description: 'Build end-to-end applications with TypeScript, React, and Node.js',
        totalLessons: 20,
        completedLessons: 3,
        estimatedTime: '8 weeks',
        difficulty: 'intermediate',
        skills: ['TypeScript', 'React', 'Node.js'],
        nextLesson: 'Setting up Express with TypeScript',
        progress: 15
      },
      {
        id: '3',
        title: 'AI-Powered Applications',
        description: 'Learn to integrate AI and machine learning into web applications',
        totalLessons: 12,
        completedLessons: 0,
        estimatedTime: '10 weeks',
        difficulty: 'advanced',
        skills: ['Python', 'TensorFlow', 'API Integration'],
        nextLesson: 'Introduction to Machine Learning',
        progress: 0
      }
    ];

    const mockRecommendations: LearningResource[] = [
      {
        id: '1',
        title: 'React Performance Optimization Techniques',
        type: 'video',
        duration: '45 min',
        difficulty: 'advanced',
        skills: ['React', 'Performance'],
        completed: false,
        rating: 4.8,
        thumbnail: '/api/placeholder/300/200'
      },
      {
        id: '2',
        title: 'Building a REST API with Node.js',
        type: 'exercise',
        duration: '2 hours',
        difficulty: 'intermediate',
        skills: ['Node.js', 'Express', 'API Design'],
        completed: false,
        rating: 4.6
      },
      {
        id: '3',
        title: 'TypeScript Advanced Types',
        type: 'article',
        duration: '15 min',
        difficulty: 'advanced',
        skills: ['TypeScript'],
        completed: true,
        rating: 4.9
      }
    ];

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'React Master',
        description: 'Complete 50 React exercises',
        icon: '⚛️',
        unlocked: true,
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Code Streak',
        description: 'Code for 7 consecutive days',
        icon: '🔥',
        unlocked: false,
        progress: 5,
        maxProgress: 7
      },
      {
        id: '3',
        name: 'Full Stack Developer',
        description: 'Complete both frontend and backend paths',
        icon: '🏗️',
        unlocked: false,
        progress: 1,
        maxProgress: 2
      }
    ];

    setSkills(mockSkills);
    setLearningPaths(mockPaths);
    setRecommendations(mockRecommendations);
    setAchievements(mockAchievements);
  }, []);

  const getResourceIcon = (type: LearningResource['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'exercise': return <Code className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: Skill['category']) => {
    switch (category) {
      case 'frontend': return 'bg-blue-500';
      case 'backend': return 'bg-green-500';
      case 'mobile': return 'bg-purple-500';
      case 'devops': return 'bg-orange-500';
      case 'ai': return 'bg-pink-500';
      case 'design': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const startLearning = (resourceId: string) => {
    setRecommendations(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, completed: true }
          : resource
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            AI-Powered Learning Path Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Skills Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Skills Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Card key={skill.name} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(skill.category)}`} />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <Badge variant="outline">
                        Level {skill.level}
                      </Badge>
                    </div>
                    <Progress value={(skill.level / skill.maxLevel) * 100} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      {skill.experience} XP • {skill.category}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((resource) => (
                <Card key={resource.id} className={`transition-all hover:shadow-md ${resource.completed ? 'border-green-200 bg-green-50/50' : ''}`}>
                  <CardContent className="p-4">
                    {resource.thumbnail && (
                      <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={resource.thumbnail} 
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">{resource.title}</h4>
                        {resource.completed && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        {getResourceIcon(resource.type)}
                        <span className="capitalize">{resource.type}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{resource.duration}</span>
                        <span>•</span>
                        <div className={`w-2 h-2 rounded-full ${getDifficultyColor(resource.difficulty)}`} />
                        <span className="capitalize">{resource.difficulty}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{resource.rating}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {resource.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        onClick={() => startLearning(resource.id)}
                        disabled={resource.completed}
                        size="sm" 
                        className="w-full gap-2"
                        variant={resource.completed ? "outline" : "default"}
                      >
                        {resource.completed ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3" />
                            Start Learning
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Personalized Learning Paths
            </h3>
            <div className="space-y-3">
              {learningPaths.map((path) => (
                <Card key={path.id} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{path.title}</h4>
                        <p className="text-sm text-muted-foreground">{path.description}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(path.difficulty)}`} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>{path.completedLessons} / {path.totalLessons} lessons</span>
                        <span>{path.progress}% complete</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {path.estimatedTime}
                          </div>
                          <span className="capitalize">{path.difficulty}</span>
                        </div>
                        <div className="flex gap-1">
                          {path.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Next: </span>
                          <span className="text-xs font-medium">{path.nextLesson}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          {path.progress === 0 ? 'Start Path' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`${achievement.unlocked ? 'border-yellow-200 bg-yellow-50/50' : 'border-gray-200'}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium mb-1">{achievement.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
                    
                    {achievement.unlocked ? (
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Unlocked {achievement.unlockedAt?.toLocaleDateString()}
                      </div>
                    ) : achievement.progress !== undefined ? (
                      <div className="space-y-1">
                        <Progress value={(achievement.progress / (achievement.maxProgress || 1)) * 100} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {achievement.progress} / {achievement.maxProgress}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        Locked
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium">AI Learning Insights</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• You learn best during morning hours (9-11 AM) based on your activity patterns</p>
                    <p>• Your JavaScript skills are advancing rapidly - consider tackling advanced React patterns next</p>
                    <p>• You're 73% more likely to complete video-based learning compared to text articles</p>
                    <p>• Backend development could complement your frontend skills well for full-stack capability</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};