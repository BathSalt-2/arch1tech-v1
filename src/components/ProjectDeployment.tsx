import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Upload, 
  ExternalLink, 
  Github, 
  Globe, 
  Rocket,
  Package,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ProjectDeployment = () => {
  const [deploymentTarget, setDeploymentTarget] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [deploymentConfig, setDeploymentConfig] = useState({
    siteName: '',
    buildCommand: 'npm run build',
    outputDir: 'dist',
    envVars: ''
  });
  const { toast } = useToast();

  const deploymentTargets = [
    { id: 'vercel', name: 'Vercel', icon: ExternalLink, description: 'Deploy to Vercel with automatic builds' },
    { id: 'netlify', name: 'Netlify', icon: Globe, description: 'Deploy to Netlify with continuous deployment' },
    { id: 'github-pages', name: 'GitHub Pages', icon: Github, description: 'Deploy to GitHub Pages for free hosting' },
    { id: 'render', name: 'Render', icon: Rocket, description: 'Deploy to Render with automatic SSL' }
  ];

  const handleDownloadProject = async () => {
    setIsDownloading(true);
    try {
      // Simulate creating and downloading project ZIP
      const projectFiles = [
        'package.json',
        'src/App.tsx',
        'src/index.css',
        'src/main.tsx',
        'index.html',
        'vite.config.ts',
        'tailwind.config.ts',
        'README.md'
      ];

      // Create a mock ZIP content
      const zipContent = JSON.stringify({
        files: projectFiles,
        timestamp: new Date().toISOString(),
        projectName: 'arch1tech-project'
      }, null, 2);

      // Create and trigger download
      const blob = new Blob([zipContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'arch1tech-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Project Downloaded",
        description: "Your project has been packaged and downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeploy = async () => {
    if (!deploymentTarget) {
      toast({
        title: "Select Platform",
        description: "Please select a deployment platform first.",
        variant: "destructive"
      });
      return;
    }

    setIsDeploying(true);
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const selectedTarget = deploymentTargets.find(t => t.id === deploymentTarget);
      
      toast({
        title: "Deployment Initiated",
        description: `Your project is being deployed to ${selectedTarget?.name}. You'll receive a notification when it's complete.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy project. Please check your configuration and try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Project Deployment
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Download your project or deploy it to popular hosting platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download Section */}
        <Card className="holographic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Download Project
            </CardTitle>
            <CardDescription>
              Package your project into a ZIP file for manual deployment or backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Project Package Contents</Label>
              <div className="flex flex-wrap gap-2">
                {['Source Code', 'Assets', 'Configuration', 'Dependencies', 'Documentation'].map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleDownloadProject}
              disabled={isDownloading}
              className="w-full"
              variant="neon"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Packaging...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Project ZIP
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Deployment Section */}
        <Card className="holographic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Deploy Project
            </CardTitle>
            <CardDescription>
              Deploy your project to a hosting platform with automatic builds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Deployment Platform</Label>
              <Select value={deploymentTarget} onValueChange={setDeploymentTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deployment platform" />
                </SelectTrigger>
                <SelectContent>
                  {deploymentTargets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      <div className="flex items-center gap-2">
                        <target.icon className="w-4 h-4" />
                        {target.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {deploymentTarget && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    placeholder="my-awesome-site"
                    value={deploymentConfig.siteName}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="buildCommand">Build Command</Label>
                    <Input
                      id="buildCommand"
                      value={deploymentConfig.buildCommand}
                      onChange={(e) => setDeploymentConfig(prev => ({ ...prev, buildCommand: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outputDir">Output Directory</Label>
                    <Input
                      id="outputDir"
                      value={deploymentConfig.outputDir}
                      onChange={(e) => setDeploymentConfig(prev => ({ ...prev, outputDir: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="envVars">Environment Variables</Label>
                  <Textarea
                    id="envVars"
                    placeholder="NODE_ENV=production&#10;API_URL=https://api.example.com"
                    value={deploymentConfig.envVars}
                    onChange={(e) => setDeploymentConfig(prev => ({ ...prev, envVars: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={handleDeploy}
              disabled={isDeploying || !deploymentTarget}
              className="w-full"
              variant="pulse"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Deploy Project
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Status */}
      <Card className="holographic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Recent Deployments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-green-500" />
                <div>
                  <p className="font-medium">Production Site</p>
                  <p className="text-sm text-muted-foreground">Deployed to Vercel</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500/20 text-green-700">
                  Live
                </Badge>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="font-medium">Staging Environment</p>
                  <p className="text-sm text-muted-foreground">Building on Netlify</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                  Building
                </Badge>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDeployment;