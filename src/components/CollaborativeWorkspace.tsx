import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Users, Eye, MessageSquare, Share2, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CollaboratorPresence {
  user_id: string;
  username: string;
  avatar_url?: string;
  cursor_position?: { x: number; y: number };
  active_file?: string;
  last_seen: string;
}

export const CollaborativeWorkspace = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedCode, setSharedCode] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Set up real-time presence tracking
    const channel = supabase.channel('collaborative-workspace')
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const collaboratorList: CollaboratorPresence[] = [];
        // Mock collaborators for demo - in real implementation, process actual presence data
        setCollaborators([]);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('New user joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .on('broadcast', { event: 'code-change' }, ({ payload }) => {
        setSharedCode(payload.code);
      })
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload]);
      });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: user.id,
          username: user.email?.split('@')[0] || 'Anonymous',
          avatar_url: user.user_metadata?.avatar_url,
          active_file: 'main.tsx',
          last_seen: new Date().toISOString()
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCodeChange = (code: string) => {
    setSharedCode(code);
    supabase.channel('collaborative-workspace').send({
      type: 'broadcast',
      event: 'code-change',
      payload: { code, user_id: user?.id }
    });
  };

  const startVideoCall = () => {
    // Integration with video calling service would go here
    console.log('Starting video call with collaborators');
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Collaborative Workspace
            <Badge variant="outline" className="bg-primary/10">
              {collaborators.length + 1} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Collaborators */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">You</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            {collaborators.map((collaborator) => (
              <div key={collaborator.user_id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={collaborator.avatar_url} />
                  <AvatarFallback>{collaborator.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{collaborator.username}</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsSharing(!isSharing)}
              variant={isSharing ? "default" : "outline"}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              {isSharing ? "Stop Sharing" : "Share Screen"}
            </Button>
            <Button onClick={startVideoCall} variant="outline" className="gap-2">
              <Video className="h-4 w-4" />
              Video Call
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Follow Mode
            </Button>
          </div>

          {/* Shared Code Editor */}
          {isSharing && (
            <div className="space-y-3">
              <h4 className="font-medium">Shared Code Editor</h4>
              <Textarea
                value={sharedCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Start typing code here... Changes are synced in real-time!"
                className="min-h-[200px] font-mono bg-muted/50"
              />
              <div className="text-xs text-muted-foreground">
                Real-time collaborative editing • {collaborators.length} others can see your changes
              </div>
            </div>
          )}

          {/* Quick Chat */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Quick Chat
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No messages yet. Start a conversation!</p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="mb-2">
                    <span className="font-medium text-xs">{msg.username}: </span>
                    <span className="text-sm">{msg.content}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};