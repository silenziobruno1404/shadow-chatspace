
import { useState } from 'react';
import { useAppStore, College } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { mockColleges } from '@/data/mockColleges';
import CollegeSelect from './CollegeSelect';

const LoginForm = () => {
  const { login, setColleges, isLoading, setIsLoading } = useAppStore();
  const { toast } = useToast();
  const [nickname, setNickname] = useState('');
  const [programLevel, setProgramLevel] = useState<'undergraduate' | 'postgraduate'>('undergraduate');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [joinAsGuest, setJoinAsGuest] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      toast({
        title: "Nickname required",
        description: "Please enter a nickname to continue",
        variant: "destructive",
      });
      return;
    }

    if (!joinAsGuest && !selectedCollege) {
      toast({
        title: "College required",
        description: "Please select a college or join as guest",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      login(nickname, joinAsGuest ? null : selectedCollege);
      
      toast({
        title: "Welcome to ShadowNet!",
        description: `You've logged in as ${nickname}${
          selectedCollege ? ` from ${selectedCollege.name}` : ' (Guest)'
        }`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "There was an error logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgramLevelChange = (value: string) => {
    const level = value as 'undergraduate' | 'postgraduate';
    setProgramLevel(level);
    setSelectedCollege(null);

    // In a real app, we'd fetch colleges based on the program level
    // For now, we'll filter our mock data
    const filteredColleges = mockColleges.filter(
      college => college.level === level
    );
    setColleges(filteredColleges);
  };

  return (
    <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-xl border border-border animate-fade-in">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-1">ShadowNet</h2>
        <p className="text-muted-foreground">Anonymous chat for college students</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nickname">Choose your shadow name</Label>
          <Input
            id="nickname"
            placeholder="Anonymous Fox, Midnight Owl, etc."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-background"
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="h-px flex-1 bg-border"></div>
            <span className="px-3 text-sm text-muted-foreground">Join a College Room</span>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <Tabs 
            defaultValue="undergraduate" 
            onValueChange={handleProgramLevelChange}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
              <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
            </TabsList>

            <TabsContent value="undergraduate" className="mt-0">
              <CollegeSelect 
                programLevel="undergraduate" 
                selectedCollege={selectedCollege}
                onSelectCollege={setSelectedCollege}
                disabled={isLoading || joinAsGuest}
              />
            </TabsContent>

            <TabsContent value="postgraduate" className="mt-0">
              <CollegeSelect 
                programLevel="postgraduate"
                selectedCollege={selectedCollege}
                onSelectCollege={setSelectedCollege}
                disabled={isLoading || joinAsGuest}
              />
            </TabsContent>
          </Tabs>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="guestMode"
              checked={joinAsGuest}
              onChange={() => {
                setJoinAsGuest(!joinAsGuest);
                if (!joinAsGuest) {
                  setSelectedCollege(null);
                }
              }}
              className="rounded text-primary focus:ring-primary"
              disabled={isLoading}
            />
            <Label htmlFor="guestMode" className="cursor-pointer">
              Join the global room only (as guest)
            </Label>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || (!nickname.trim()) || (!joinAsGuest && !selectedCollege)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Enter ShadowNet'
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
