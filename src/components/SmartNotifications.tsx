import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Bell, 
  BellOff, 
  Settings, 
  Smartphone,
  Mail,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Filter,
  Volume2,
  X
} from "lucide-react";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'project' | 'system' | 'social' | 'security' | 'performance';
  read: boolean;
  actionRequired: boolean;
  contextData?: any;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  priority_filter: 'all' | 'medium' | 'high' | 'urgent';
  quiet_hours: { start: string; end: string; enabled: boolean };
  frequency: number; // 1-5 scale
  categories: Record<string, boolean>;
}

export const SmartNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    priority_filter: 'medium',
    quiet_hours: { start: '22:00', end: '08:00', enabled: true },
    frequency: 3,
    categories: {
      project: true,
      system: true,
      social: false,
      security: true,
      performance: true
    }
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');

  useEffect(() => {
    // Mock notifications - in real implementation, these would come from your backend
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'High CPU Usage Detected',
        message: 'Your application is using 89% CPU. Consider optimizing your code.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        priority: 'high',
        category: 'performance',
        read: false,
        actionRequired: true,
        contextData: { cpu_usage: 89, project_id: 'proj_123' }
      },
      {
        id: '2',
        type: 'success',
        title: 'Build Completed Successfully',
        message: 'Your project "E-commerce App" has been deployed to production.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        priority: 'medium',
        category: 'project',
        read: false,
        actionRequired: false
      },
      {
        id: '3',
        type: 'info',
        title: 'New Collaboration Request',
        message: 'Sarah Chen wants to collaborate on your "AI Dashboard" project.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: 'medium',
        category: 'social',
        read: true,
        actionRequired: true
      },
      {
        id: '4',
        type: 'error',
        title: 'Security Alert',
        message: 'Suspicious login attempt detected from unknown location.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        priority: 'urgent',
        category: 'security',
        read: false,
        actionRequired: true
      }
    ];

    setNotifications(mockNotifications);

    // Simulate AI learning from user behavior
    const learningInterval = setInterval(() => {
      // AI adjusts notification settings based on user interaction patterns
      setSettings(prev => ({
        ...prev,
        frequency: Math.max(1, Math.min(5, prev.frequency + (Math.random() - 0.5) * 0.1))
      }));
    }, 30000);

    return () => clearInterval(learningInterval);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-purple-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.read) return false;
    if (filter === 'important' && notif.priority === 'low') return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (category: string, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: enabled }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Smart Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'unread' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
              <Button 
                variant={filter === 'important' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('important')}
              >
                Important
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-sm">AI Insights</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your behavior, you're most active during morning hours. 
                We've optimized your notification timing for maximum productivity.
              </p>
            </CardContent>
          </Card>

          {/* Notification List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all hover:shadow-md ${!notification.read ? 'border-primary/40 bg-primary/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.priority}
                          </Badge>
                          {notification.actionRequired && (
                            <Badge variant="default" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Settings Panel */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm font-medium">Enable Notifications</span>
                    </div>
                    <Switch 
                      checked={settings.enabled} 
                      onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Sound Alerts</span>
                    </div>
                    <Switch 
                      checked={settings.sound} 
                      onCheckedChange={(checked) => handleSettingChange('sound', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="text-sm font-medium">Desktop Notifications</span>
                    </div>
                    <Switch 
                      checked={settings.desktop} 
                      onCheckedChange={(checked) => handleSettingChange('desktop', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">Email Notifications</span>
                    </div>
                    <Switch 
                      checked={settings.email} 
                      onCheckedChange={(checked) => handleSettingChange('email', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority Filter</label>
                    <Select 
                      value={settings.priority_filter} 
                      onValueChange={(value) => handleSettingChange('priority_filter', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="medium">Medium & Above</SelectItem>
                        <SelectItem value="high">High & Urgent Only</SelectItem>
                        <SelectItem value="urgent">Urgent Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Notification Frequency: {settings.frequency}/5
                    </label>
                    <Slider
                      value={[settings.frequency]}
                      onValueChange={([value]) => handleSettingChange('frequency', value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      AI automatically adjusts based on your usage patterns
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Controls */}
              <div>
                <h4 className="font-medium mb-3">Notification Categories</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Switch
                        id={category}
                        checked={enabled}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                      />
                      <label htmlFor={category} className="text-sm capitalize">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Quiet Hours</h4>
                  <Switch 
                    checked={settings.quiet_hours.enabled}
                    onCheckedChange={(checked) => 
                      handleSettingChange('quiet_hours', { ...settings.quiet_hours, enabled: checked })
                    }
                  />
                </div>
                {settings.quiet_hours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Start Time</label>
                      <input 
                        type="time" 
                        value={settings.quiet_hours.start}
                        onChange={(e) => 
                          handleSettingChange('quiet_hours', { 
                            ...settings.quiet_hours, 
                            start: e.target.value 
                          })
                        }
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">End Time</label>
                      <input 
                        type="time" 
                        value={settings.quiet_hours.end}
                        onChange={(e) => 
                          handleSettingChange('quiet_hours', { 
                            ...settings.quiet_hours, 
                            end: e.target.value 
                          })
                        }
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};