
import { useEffect, useRef } from 'react';
import { useAppStore, Message } from '@/store/store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatMessages = () => {
  const { messages, activeRoomId, user } = useAppStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Filter messages for the current room
  const roomMessages = messages.filter(
    (message) => message.roomId === activeRoomId
  );

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages]);

  const renderTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      {roomMessages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm">Be the first to start the conversation!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {roomMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender === user.nickname}
              timestamp={renderTimestamp(message.timestamp)}
              isVerified={message.sender === user.nickname && 
                          user.isVerified && 
                          user.college !== null &&
                          activeRoomId?.includes(user.college.id)}
            />
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </ScrollArea>
  );
};

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  timestamp: string;
  isVerified?: boolean;
}

const MessageBubble = ({ message, isCurrentUser, timestamp, isVerified }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2 max-w-3xl",
        isCurrentUser ? "ml-auto" : "mr-auto"
      )}
    >
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            isCurrentUser ? "text-primary" : "text-muted-foreground"
          )}>
            {isCurrentUser ? "You" : message.sender}
          </span>
          {isVerified && (
            <div className="flex items-center text-xs text-green-600">
              <ShieldCheck className="h-3 w-3 mr-0.5" />
              <span>verified</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {timestamp}
          </span>
        </div>
        
        <div className={cn(
          "mt-1 p-3 rounded-lg",
          isCurrentUser
            ? "bg-primary/20 text-foreground"
            : "bg-secondary text-foreground"
        )}>
          {message.content}
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary" />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
