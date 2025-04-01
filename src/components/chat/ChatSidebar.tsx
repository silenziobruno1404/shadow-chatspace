
import { useAppStore, Room } from '@/store/store';
import { Globe, School, Users, Plus, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ChatSidebar = () => {
  const { rooms, activeRoomId, user, setActiveRoom, requestToJoinRoom, joinRequests } = useAppStore();
  const { toast } = useToast();
  const [isRequestingJoin, setIsRequestingJoin] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // User's joined rooms
  const userRooms = rooms.filter(room => 
    user.joinedRooms.includes(room.id)
  );
  
  // Available college rooms that user hasn't joined
  const availableRooms = rooms.filter(room => 
    room.college !== null && !user.joinedRooms.includes(room.id)
  );

  // Check if user has a pending request for a room
  const hasPendingRequest = (roomId: string) => {
    return joinRequests.some(req => 
      req.userId === user.id && 
      req.roomId === roomId && 
      req.status === 'pending'
    );
  };

  const handleRequestJoin = (roomId: string) => {
    setIsRequestingJoin(true);
    try {
      requestToJoinRoom(roomId);
      toast({
        title: "Join request sent",
        description: "Your request to join this college room has been sent to moderators.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send join request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingJoin(false);
      setShowJoinDialog(false);
    }
  };

  return (
    <div className="w-64 border-r border-border flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Chat Rooms</span>
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">YOUR ROOMS</h3>
            {userRooms.map(room => (
              <button
                key={room.id}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md flex items-center gap-2 mb-1 transition-colors",
                  activeRoomId === room.id
                    ? "bg-primary/15 text-primary"
                    : "hover:bg-secondary/80 text-foreground"
                )}
                onClick={() => setActiveRoom(room.id)}
              >
                {room.college === null ? (
                  <Globe className="h-4 w-4 opacity-70" />
                ) : (
                  <School className="h-4 w-4 opacity-70" />
                )}
                <span className="truncate">{room.name}</span>
              </button>
            ))}
          </div>

          {availableRooms.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3">OTHER COLLEGE ROOMS</h3>
              {availableRooms.map(room => (
                <div 
                  key={room.id}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-secondary/50 mb-1"
                >
                  <School className="h-4 w-4 opacity-70 mr-2" />
                  <span className="truncate flex-1 text-sm">{room.name}</span>
                  
                  {hasPendingRequest(room.id) ? (
                    <Button variant="ghost" size="sm" disabled className="h-7 px-2">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Pending
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setShowJoinDialog(true);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>All messages are anonymous and temporary.</p>
        </div>
      </div>

      {/* Join Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join College Room</DialogTitle>
            <DialogDescription>
              Your request will be reviewed by the room moderators. You will receive a notification when your request is approved.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm">
              Are you sure you want to request to join{" "}
              <span className="font-medium">{rooms.find(r => r.id === selectedRoomId)?.name}</span>?
            </p>
            <div className="flex items-center space-x-2 justify-end">
              <Button variant="outline" onClick={() => setShowJoinDialog(false)}>Cancel</Button>
              <Button 
                onClick={() => selectedRoomId && handleRequestJoin(selectedRoomId)}
                disabled={isRequestingJoin}
              >
                {isRequestingJoin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSidebar;
