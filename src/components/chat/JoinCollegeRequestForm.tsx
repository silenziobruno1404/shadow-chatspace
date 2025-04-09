
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { College } from '@/store/store';
import { emailService } from '@/services/emailService';
import { Loader2, MailCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JoinCollegeRequestFormProps {
  college: College;
  onClose: () => void;
}

const JoinCollegeRequestForm = ({ college, onClose }: JoinCollegeRequestFormProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const { toast } = useToast();

  // Generate appropriate email placeholder based on college ID
  const getEmailPlaceholder = () => {
    const collegeId = college.id.toLowerCase();
    // Use the more common academic domain format for Indian colleges (.ac.in)
    return `your.email@${collegeId}.ac.in`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !nickname) {
      toast({
        title: "Missing information",
        description: "Please provide both your nickname and college email",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email domain
    const emailDomain = email.split('@')[1];
    if (!emailDomain) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the email domain is valid for this college
    const collegeId = college.id.toLowerCase();
    const validDomains = [
      `${collegeId}.edu`, 
      `${collegeId}.ac.in`,
      `${collegeId}.edu.in`,
      `${collegeId}-university.edu`,
      `${collegeId}-university.ac.in`,
      `${collegeId}.college.edu`
    ];
    
    const isValidDomain = validDomains.some(domain => 
      emailDomain.toLowerCase() === domain.toLowerCase()
    ) || emailDomain.toLowerCase().includes(collegeId);
    
    if (!isValidDomain) {
      toast({
        title: "Invalid email domain",
        description: `Your email must be from ${college.name}'s domain (e.g., ${collegeId}.ac.in or ${collegeId}.edu)`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await emailService.sendJoinRequest(
        nickname,
        email,
        college.id,
        college.name
      );
      
      if (success) {
        toast({
          title: "Request sent!",
          description: `Your request to join ${college.name} has been sent to moderators for approval.`,
        });
        onClose();
      } else {
        throw new Error("Failed to send request");
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was an error sending your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-1">Join {college.name} Group</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Request permission from {college.name} moderators to join their group.
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="nickname" className="text-sm font-medium">
            Your Nickname
          </label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            disabled={isSubmitting}
            className="mt-1"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Your College Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={getEmailPlaceholder()}
            disabled={isSubmitting}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Please use your official college email for verification
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <MailCheck className="mr-2 h-4 w-4" />
              Send Request
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default JoinCollegeRequestForm;
