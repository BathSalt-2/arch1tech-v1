import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Laptop,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Cloud,
  Settings
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'laptop';
  os: string;
  lastSync: Date;
  isOnline: boolean;
  syncProgress: number;
  storage: {
    used: number;
    total: number;
  };
}

interface SyncStatus {
  isActive: boolean;
  progress: number;
  currentFile?: string;
  filesRemaining: number;
  speed: string;
  eta: string;
}

interface OfflineData {
  projects: number;
  files: number;
  size: string;
  lastUpdated: Date;
}

export const CrossPlatformSync = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isActive: false,
    progress: 0,
    filesRemaining: 0,
    speed: '0 MB/s',
    eta: '0s'
  });
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    projects: 5,
    files: 127,
    size: '89.2 MB',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000)
  });

  useEffect(() => {
    // Mock device data
    const mockDevices: Device[] = [
      {
        id: '1',
        name: 'MacBook Pro',
        type: 'laptop',
        os: 'macOS 14.1',
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        isOnline: true,
        syncProgress: 100,
        storage: { used: 2.4, total: 8.0 }
      },
      {
        id: '2',
        name: 'iPhone 15 Pro',
        type: 'mobile',
        os: 'iOS 17.1',
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        isOnline: true,
        syncProgress: 85,
        storage: { used: 1.2, total: 4.0 }
      },
      {
        id: '3',
        name: 'iPad Air',
        type: 'tablet',
        os: 'iPadOS 17.1',
        lastSync: new Date(Date.now() - 30 * 60 * 1000),
        isOnline: false,
        syncProgress: 67,
        storage: { used: 0.8, total: 2.0 }
      },
      {
        id: '4',
        name: 'Gaming PC',
        type: 'desktop',
        os: 'Windows 11',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOnline: true,
        syncProgress: 92,
        storage: { used: 5.2, total: 16.0 }
      }
    ];

    setDevices(mockDevices);

    // Check network status
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'desktop': return <Monitor className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      case 'laptop': return <Laptop className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const startSync = async (deviceId?: string) => {
    setSyncStatus({
      isActive: true,
      progress: 0,
      currentFile: 'components/Dashboard.tsx',
      filesRemaining: 23,
      speed: '0 MB/s',
      eta: 'Calculating...'
    });

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncStatus(prev => {
        const newProgress = Math.min(prev.progress + Math.random() * 10, 100);
        const remaining = Math.max(prev.filesRemaining - Math.floor(Math.random() * 3), 0);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            isActive: false,
            progress: 100,
            filesRemaining: 0,
            speed: '0 MB/s',
            eta: 'Complete'
          };
        }

        return {
          ...prev,
          progress: newProgress,
          filesRemaining: remaining,
          speed: `${(Math.random() * 5 + 1).toFixed(1)} MB/s`,
          eta: `${Math.floor(Math.random() * 30 + 10)}s`
        };
      });
    }, 500);
  };

  const enableOfflineMode = () => {
    // In real implementation, this would download necessary files for offline use
    setOfflineData(prev => ({
      ...prev,
      lastUpdated: new Date()
    }));
    alert('Offline mode enabled. Your projects have been cached locally.');
  };

  const clearOfflineData = () => {
    setOfflineData({
      projects: 0,
      files: 0,
      size: '0 MB',
      lastUpdated: new Date()
    });
    alert('Offline data cleared.');
  };

  const getConnectionStatus = () => {
    if (isOfflineMode) return { icon: <WifiOff className="h-4 w-4 text-red-500" />, text: 'Offline', color: 'text-red-500' };
    return { icon: <Wifi className="h-4 w-4 text-green-500" />, text: 'Online', color: 'text-green-500' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Cross-Platform Sync & Offline Mode
            </CardTitle>
            <div className="flex items-center gap-2">
              {connectionStatus.icon}
              <span className={`text-sm font-medium ${connectionStatus.color}`}>
                {connectionStatus.text}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sync Status */}
          {syncStatus.isActive && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Syncing: {syncStatus.currentFile}</span>
                    <span>{syncStatus.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={syncStatus.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{syncStatus.filesRemaining} files remaining</span>
                    <span>{syncStatus.speed} • ETA: {syncStatus.eta}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Offline Mode Alert */}
          {isOfflineMode && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                You're currently offline. Changes will sync when connection is restored.
              </AlertDescription>
            </Alert>
          )}

          {/* Sync Controls */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <h3 className="font-medium">Auto-Sync</h3>
              <p className="text-sm text-muted-foreground">
                Automatically sync changes across all devices
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Switch 
                checked={autoSync} 
                onCheckedChange={setAutoSync}
                disabled={isOfflineMode}
              />
              <Button 
                onClick={() => startSync()} 
                disabled={syncStatus.isActive || isOfflineMode}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Sync Now
              </Button>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connected Devices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <Card key={device.id} className={`${device.isOnline ? 'border-green-200' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.type)}
                        <div>
                          <h4 className="font-medium">{device.name}</h4>
                          <p className="text-sm text-muted-foreground">{device.os}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${device.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-xs text-muted-foreground">
                          {device.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sync Progress</span>
                          <span>{device.syncProgress}%</span>
                        </div>
                        <Progress value={device.syncProgress} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Storage</span>
                          <span>{device.storage.used.toFixed(1)}GB / {device.storage.total.toFixed(1)}GB</span>
                        </div>
                        <Progress value={(device.storage.used / device.storage.total) * 100} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last sync: {device.lastSync.toLocaleTimeString()}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => startSync(device.id)}
                          disabled={!device.isOnline || syncStatus.isActive}
                        >
                          Sync
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Offline Mode Controls */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Offline Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-primary">{offlineData.projects}</div>
                  <div className="text-sm text-muted-foreground">Projects Cached</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-primary">{offlineData.files}</div>
                  <div className="text-sm text-muted-foreground">Files Available</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-primary">{offlineData.size}</div>
                  <div className="text-sm text-muted-foreground">Storage Used</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">
                    {offlineData.lastUpdated.toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={enableOfflineMode} 
                    variant="outline" 
                    className="gap-2"
                    disabled={isOfflineMode}
                  >
                    <Download className="h-4 w-4" />
                    Cache for Offline
                  </Button>
                  <Button 
                    onClick={clearOfflineData} 
                    variant="outline" 
                    className="gap-2"
                  >
                    Clear Cache
                  </Button>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Offline mode allows you to continue working on your projects even without an internet connection. 
                  Changes will be automatically synced when you're back online.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Sync Statistics */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sync Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-600">98.7%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">1.2s</div>
                  <div className="text-sm text-muted-foreground">Avg Sync Time</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">847</div>
                  <div className="text-sm text-muted-foreground">Files Synced Today</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-600">15.2 GB</div>
                  <div className="text-sm text-muted-foreground">Data Transferred</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};