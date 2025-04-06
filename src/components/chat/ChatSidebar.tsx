
import { useAppStore } from '@/store/store';
import { Globe, School, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const ChatSidebar = () => {
  const { rooms, activeRoomId, user, setActiveRoom } = useAppStore();

  // Filter rooms
  // If user has a college, show global room and that college's room
  // If user is a guest, only show global room
  const visibleRooms = rooms.filter(room => 
    room.college === null || (user.college && room.college === user.college.id)
  );

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
      </ScrollArea>
      
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>All messages are anonymous and temporary.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
