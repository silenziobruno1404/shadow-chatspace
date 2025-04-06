
import { MessageSquare } from 'lucide-react';

interface ChatHeaderProps {
  nickname: string;
  currentRoom: string;
}

const ChatHeader = ({ nickname, currentRoom }: ChatHeaderProps) => {
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
        
        <div className="text-sm hidden md:block">
          <span className="text-muted-foreground">Room: </span>
          <span className="font-medium">{currentRoom}</span>
        </div>
      </div>
      
      <div className="text-sm">
        <span className="text-muted-foreground">Chatting as: </span>
        <span className="font-medium text-primary">{nickname}</span>
      </div>
    </header>
  );
};

export default ChatHeader;
