
import { useState } from 'react';
import { useAppStore, College } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail } from 'lucide-react';
import { mockColleges } from '@/data/mockColleges';
import CollegeSelect from './CollegeSelect';

const LoginForm = () => {
  const { login, setColleges, isLoading, setIsLoading } = useAppStore();
  const { toast } = useToast();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [programLevel, setProgramLevel] = useState<'undergraduate' | 'postgraduate'>('undergraduate');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [joinAsGuest, setJoinAsGuest] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

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

    // Verify college email if a college is selected and not joining as guest
    if (selectedCollege && !joinAsGuest && !isEmailVerified) {
      if (!email.trim()) {
        toast({
          title: "Email required",
          description: "Please enter your college email address",
          variant: "destructive",
        });
        return;
      }

      // Check if email matches the college domain
      const expectedDomain = `@${selectedCollege.id}.edu`;
      if (!email.endsWith(expectedDomain)) {
        toast({
          title: "Invalid email domain",
          description: `Please use an email from domain ${expectedDomain}`,
          variant: "destructive",
        });
        return;
      }

      // In a real app, we would send a verification code to the user's email
      // For this demo, we'll simulate it with a simple form
      if (!showVerificationInput) {
        setShowVerificationInput(true);
        // Simulate sending verification code
        toast({
          title: "Verification code sent",
          description: `A verification code has been sent to ${email}`,
        });
        return;
      }
      
      // Simple verification (in a real app, this would check against a server)
      if (verificationCode !== '123456') {
        toast({
          title: "Invalid verification code",
          description: "Please enter the correct verification code",
          variant: "destructive",
        });
        return;
      }
      
      setIsEmailVerified(true);
    }

    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Pass email only if it's verified, otherwise null
      const userEmail = selectedCollege && !joinAsGuest && isEmailVerified ? email : null;
      login(nickname, userEmail, joinAsGuest ? null : selectedCollege);
      
      toast({
        title: "Welcome to ShadowNet!",
        description: `You've logged in as ${nickname}${
          selectedCollege ? ` from ${selectedCollege.name}` : ' (Guest)'
        }${isEmailVerified ? ' (Verified)' : ''}`,
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

  // For demo purposes, use 123456 as the verification code
  const handleRequestVerificationCode = () => {
    if (!email.trim() || !selectedCollege) return;
    
    const expectedDomain = `@${selectedCollege.id}.edu`;
    if (!email.endsWith(expectedDomain)) {
      toast({
        title: "Invalid email domain",
        description: `Please use an email from domain ${expectedDomain}`,
        variant: "destructive",
      });
      return;
    }

    setShowVerificationInput(true);
    toast({
      title: "Verification code sent",
      description: `For demo purposes, use code: 123456`,
    });
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

          {selectedCollege && !joinAsGuest && (
            <div className="space-y-2">
              <Label htmlFor="email">College Email</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder={`your.email@${selectedCollege.id}.edu`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background flex-1"
                  disabled={isLoading || isEmailVerified}
                />
                {!isEmailVerified && !showVerificationInput && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleRequestVerificationCode}
                    disabled={!email || isLoading}
                  >
                    Verify
                  </Button>
                )}
              </div>
              {isEmailVerified && (
                <div className="text-xs text-green-600 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  Email verified
                </div>
              )}
            </div>
          )}

          {showVerificationInput && !isEmailVerified && (
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="bg-background"
                disabled={isLoading}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                For demo purposes, use code: 123456
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="guestMode"
              checked={joinAsGuest}
              onChange={() => {
                setJoinAsGuest(!joinAsGuest);
                if (!joinAsGuest) {
                  setSelectedCollege(null);
                  setEmail('');
                  setIsEmailVerified(false);
                  setShowVerificationInput(false);
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
          disabled={isLoading || 
                   (!nickname.trim()) || 
                   (!joinAsGuest && !selectedCollege) ||
                   (selectedCollege && !joinAsGuest && !isEmailVerified && showVerificationInput)}
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
