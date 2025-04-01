
import { FC, ReactNode } from 'react';

interface ChatHeaderProps {
  nickname: string;
  currentRoom: string;
  children?: ReactNode;
}

const ChatHeader: FC<ChatHeaderProps> = ({ nickname, currentRoom, children }) => {
  return (
    <div className="border-b border-border p-3 flex items-center justify-between bg-card">
      <div>
        <h2 className="font-medium">{currentRoom}</h2>
        <p className="text-sm text-muted-foreground">Chatting as {nickname}</p>
      </div>
      {children}
    </div>
  );
};

export default ChatHeader;
