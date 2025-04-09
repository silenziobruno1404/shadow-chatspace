
import { useState } from 'react';
import { useAppStore } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftCircle, Mail, ShieldCheck, CheckCircle, User } from 'lucide-react';
import { emailService } from '@/services/emailService';

const Profile = () => {
  const { user, setUser } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleSendVerificationEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!user.college) {
      toast({
        title: "Error",
        description: "You need to be associated with a college to verify your email",
        variant: "destructive",
      });
      return;
    }

    // Check if email domain matches college
    const emailDomain = email.split('@')[1];
    const expectedDomain = `${user.college.id}.edu`; // Simple check assuming college emails end with .edu
    
    if (!emailDomain || emailDomain !== expectedDomain) {
      toast({
        title: "Error",
        description: `Your email must be from your college's domain (${expectedDomain})`,
        variant: "destructive",
      });
      return;
    }

    setIsSendingCode(true);

    try {
      // Generate a random 6 digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store code temporarily in state (in a real app, this would be handled securely on a server)
      sessionStorage.setItem('verificationCode', code);
      
      // Send verification email
      const subject = "ShadowNet Email Verification";
      const body = `
        Your verification code for ShadowNet is: ${code}
        
        Please enter this code on the profile page to complete your verification.
        
        Thank you,
        ShadowNet Team
      `;
      
      const result = await emailService.sendEmail({
        to: email,
        subject,
        body
      });
      
      if (result) {
        toast({
          title: "Verification code sent",
          description: "Please check your email for the verification code",
        });
        
        // Update email in store
        setUser({ email });
        
        // Show verification code input
        setShowVerification(true);
      } else {
        throw new Error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "There was a problem sending the verification code",
        variant: "destructive",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyEmail = () => {
    setIsVerifying(true);
    
    try {
      // Get stored code from session storage
      const storedCode = sessionStorage.getItem('verificationCode');
      
      if (verificationCode === storedCode) {
        // Update user verification status
        setUser({ isVerified: true });
        
        // Clean up session storage
        sessionStorage.removeItem('verificationCode');
        
        toast({
          title: "Email verified!",
          description: "Your college email has been successfully verified",
          variant: "default",
        });
        
        setShowVerification(false);
      } else {
        toast({
          title: "Invalid code",
          description: "The verification code is incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      toast({
        title: "Error",
        description: "There was a problem verifying your email",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-xl mx-auto py-4">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/')}
        >
          <ArrowLeftCircle className="mr-2 h-4 w-4" />
          Back to Chat
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Profile</CardTitle>
              {user.isVerified && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified</span>
                </Badge>
              )}
            </div>
            <CardDescription>
              Manage your profile and verify your college email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-card/50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">{user.nickname}</div>
                <div className="text-sm text-muted-foreground">
                  {user.college ? user.college.name : 'No college selected'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">College Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  placeholder="your.name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={user.isVerified || showVerification}
                  className="flex-1"
                />
                {!user.isVerified && !showVerification && (
                  <Button 
                    onClick={handleSendVerificationEmail} 
                    disabled={isSendingCode}
                  >
                    {isSendingCode ? "Sending..." : "Verify"}
                  </Button>
                )}
              </div>
              {user.email && (
                <p className="text-xs text-muted-foreground">
                  {user.isVerified 
                    ? "Email verified" 
                    : "Email not yet verified"}
                </p>
              )}
            </div>
            
            {showVerification && (
              <div className="space-y-2 p-4 border rounded-lg border-primary/20 bg-primary/5">
                <Label htmlFor="verification-code">Verification Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="verification-code"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleVerifyEmail} 
                    disabled={isVerifying || verificationCode.length !== 6}
                  >
                    {isVerifying ? "Verifying..." : "Submit"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the verification code sent to your email
                </p>
              </div>
            )}
            
            {user.isVerified && (
              <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-md">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">Your college email has been verified.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-xs text-muted-foreground">
              <p>Email verification helps verify your college affiliation</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
