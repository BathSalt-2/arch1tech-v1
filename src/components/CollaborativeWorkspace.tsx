import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Users, Eye, MessageSquare, Share2, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DOMPurify from "dompurify";

interface CollaboratorPresence {
  user_id: string;
  username: string;
  avatar_url?: string;
  cursor_position?: { x: number; y: number };
  active_file?: string;
  last_seen: string;
}

// Maximum allowed sizes for broadcasts
const MAX_CODE_LENGTH = 100000;
const MAX_MESSAGE_LENGTH = 1000;

// Validate and sanitize incoming broadcast payloads
const validateCodePayload = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;
  if (typeof p.code !== 'string') return null;
  if (p.code.length > MAX_CODE_LENGTH) return null;
  return p.code;
};

const validateMessagePayload = (payload: unknown): { username: string; content: string } | null => {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;
  if (typeof p.username !== 'string' || typeof p.content !== 'string') return null;
  if (p.content.length > MAX_MESSAGE_LENGTH) return null;
  if (p.username.length > 100) return null;
  return {
    username: DOMPurify.sanitize(p.username.slice(0, 100)),
    content: DOMPurify.sanitize(p.content.slice(0, MAX_MESSAGE_LENGTH))
  };
};

export const CollaborativeWorkspace = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const [sharedCode, setSharedCode] = useState("");
  const [messages, setMessages] = useState<Array<{ username: string; content: string }>>([]);
  const { user } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user) return;

    // Generate a unique workspace ID - in production, this would come from
    // a workspace/project entity the user has verified access to
    // For now, we use user-specific channel as a security measure
    const workspaceChannelName = `workspace:user:${user.id}`;

    // Set up real-time presence tracking with user-scoped channel
    const channel = supabase.channel(workspaceChannelName, {
      config: {
        presence: {
          key: user.id, // Server validates this matches auth token
        },
      },
    })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const collaboratorList: CollaboratorPresence[] = [];
        
        // Process presence state - server validates identity
        Object.keys(presenceState).forEach((key) => {
          if (key !== user.id) {
            const presences = presenceState[key];
            if (presences && presences.length > 0) {
              const presence = presences[0] as Record<string, unknown>;
              // Validate presence data structure
              if (
                typeof presence.user_id === 'string' &&
                typeof presence.username === 'string' &&
                typeof presence.last_seen === 'string'
              ) {
                collaboratorList.push({
                  user_id: presence.user_id,
                  username: presence.username,
                  avatar_url: typeof presence.avatar_url === 'string' ? presence.avatar_url : undefined,
                  active_file: typeof presence.active_file === 'string' ? presence.active_file : undefined,
                  last_seen: presence.last_seen,
                });
              }
            }
          }
        });
        
        setCollaborators(collaboratorList);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('New user joined workspace');
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left workspace');
      })
      .on('broadcast', { event: 'code-change' }, ({ payload }) => {
        // Validate and sanitize incoming code
        const validatedCode = validateCodePayload(payload);
        if (validatedCode !== null) {
          setSharedCode(validatedCode);
        }
      })
      .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
        // Validate and sanitize incoming messages
        const validatedMessage = validateMessagePayload(payload);
        if (validatedMessage) {
          setMessages(prev => [...prev.slice(-99), validatedMessage]); // Keep last 100 messages
        }
      });

    channelRef.current = channel;

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Track presence with verified user info
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
      channelRef.current = null;
    };
  }, [user]);

  const handleCodeChange = useCallback((code: string) => {
    if (!user || !channelRef.current) return;
    
    // Validate code length before sending
    if (code.length > MAX_CODE_LENGTH) {
      console.warn('Code too long, truncating');
      code = code.slice(0, MAX_CODE_LENGTH);
    }
    
    setSharedCode(code);
    
    // Send via the existing channel reference
    // Note: In production, sensitive operations should go through database
    // with RLS instead of direct broadcasts
    channelRef.current.send({
      type: 'broadcast',
      event: 'code-change',
      payload: { code }
      // Note: Don't include user_id in payload - receivers should use presence for identity
    });
  }, [user]);

  const startVideoCall = () => {
    // Integration with video calling service would go here
    console.log('Starting video call with collaborators');
  };

  if (!user) {
    return (
      <div className="p-6">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <p className="text-muted-foreground">Please sign in to use the collaborative workspace.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <span className="text-sm">{DOMPurify.sanitize(collaborator.username)}</span>
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
                maxLength={MAX_CODE_LENGTH}
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
