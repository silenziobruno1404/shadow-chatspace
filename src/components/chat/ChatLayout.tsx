
import { useAppStore } from '@/store/store';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInputForm from './ChatInputForm';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatLayout = () => {
  const { user, activeRoomId, rooms, logout } = useAppStore();
  const { toast } = useToast();

  const activeRoom = rooms.find(room => room.id === activeRoomId);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out from your account.",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <ChatHeader 
        nickname={user.nickname} 
        currentRoom={activeRoom?.name || 'No Room Selected'} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden border-l border-border">
          {activeRoomId ? (
            <>
              <ChatMessages />
              <ChatInputForm />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-md">
                <h3 className="text-xl font-medium text-primary mb-2">
                  No chat room selected
                </h3>
                <p className="text-muted-foreground mb-4">
                  Select a chat room from the sidebar to start chatting
                </p>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 border-t border-border flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-primary">{user.nickname}</span>
          {user.college && (
            <span> · {user.college.name}</span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatLayout;
