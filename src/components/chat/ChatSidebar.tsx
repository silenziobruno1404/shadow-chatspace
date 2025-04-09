
import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { College, Room } from '@/store/store';
import { Globe, School, Users, PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import JoinCollegeRequestForm from './JoinCollegeRequestForm';
import { mockColleges } from '@/data/mockColleges';

const ChatSidebar = () => {
  const { rooms, activeRoomId, user, setActiveRoom } = useAppStore();
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  // Filter rooms
  // If user has a college, show global room and that college's room
  // If user is a guest, only show global room
  const visibleRooms = rooms.filter(room => 
    room.college === null || (user.college && room.college === user.college.id)
  );

  // Get all colleges that the user is not part of
  const otherColleges = mockColleges.filter(
    college => !user.college || college.id !== user.college.id
  );

  const handleJoinRequest = (college: College) => {
    setSelectedCollege(college);
    setIsJoinDialogOpen(true);
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
          {visibleRooms.map(room => (
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

        {user.loggedIn && (
          <>
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-muted-foreground">Other Colleges</h3>
            </div>
            <div className="p-2">
              {otherColleges.map(college => (
                <div
                  key={college.id}
                  className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 opacity-70" />
                    <span className="truncate text-sm">{college.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleJoinRequest(college)}
                    className="h-6 px-2"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Join</span>
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>All messages are anonymous and temporary.</p>
        </div>
      </div>

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedCollege && (
            <JoinCollegeRequestForm
              college={selectedCollege}
              onClose={() => setIsJoinDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSidebar;
