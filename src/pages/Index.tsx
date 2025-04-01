
import { useState } from 'react';
import { useAppStore } from '@/store/store';
import LoginForm from '@/components/auth/LoginForm';
import ChatLayout from '@/components/chat/ChatLayout';
import HostingOptions from '@/components/HostingOptions';

const Index = () => {
  const { user } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      {user.loggedIn ? (
        <ChatLayout />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
          <LoginForm />
          <div className="w-full max-w-md">
            <HostingOptions />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
