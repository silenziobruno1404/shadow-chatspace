
import { MessageSquare, UserCircle } from 'lucide-react';
import { useAppStore } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  nickname: string;
  currentRoom: string;
}

const ChatHeader = ({ nickname, currentRoom }: ChatHeaderProps) => {
  const { activeRoomId, rooms, user } = useAppStore();
  const navigate = useNavigate();
  
  // Determine if the active room is a college room
  const activeRoom = rooms.find(room => room.id === activeRoomId);
  const isCollegeRoom = activeRoom?.college !== null;
  
  // Check if we should show the verified badge
  // Only show verified badge if user is in a college room and the college matches the user's college
  const showVerifiedBadge = isCollegeRoom && 
                            user.college && 
                            activeRoom?.college === user.college.id && 
                            user.isVerified;

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 py-2 bg-card">
      <div className="flex items-center">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold">ShadowNet</h1>
        </div>
        
        <div className="hidden md:block h-6 w-px bg-border mx-2"></div>
        
        <div className="text-sm hidden md:flex items-center gap-1">
          <span className="text-muted-foreground">Room: </span>
          <span className="font-medium">{currentRoom}</span>
          {isCollegeRoom && (
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full ml-2">
              College Room
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Chatting as: </span>
          <span className="font-medium text-primary">{nickname}</span>
          {showVerifiedBadge && (
            <Badge variant="outline" className="ml-1.5 text-xs bg-green-100 text-green-800 border-green-300">
              Verified
            </Badge>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goToProfile}
          className="ml-2"
        >
          <UserCircle className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Profile</span>
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
