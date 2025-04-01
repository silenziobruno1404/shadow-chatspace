
import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const ChatInputForm = () => {
  const { user, activeRoomId, addMessage } = useAppStore();
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !activeRoomId) return;

    addMessage({
      content: message.trim(),
      sender: user.nickname,
      roomId: activeRoomId,
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="min-h-10 resize-none bg-background"
          maxLength={500}
        />
        <Button type="submit" disabled={!message.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};

export default ChatInputForm;
