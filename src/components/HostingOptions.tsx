
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HostingOptions = () => {
  const hostingOptions = [
    {
      name: 'Netlify',
      description: 'Easy deployment with continuous integration from GitHub.',
      url: 'https://www.netlify.com/',
    },
    {
      name: 'Vercel',
      description: 'Optimized for React apps with serverless functions support.',
      url: 'https://vercel.com/',
    },
    {
      name: 'GitHub Pages',
      description: 'Free hosting for static websites directly from your GitHub repository.',
      url: 'https://pages.github.com/',
    },
    {
      name: 'Cloudflare Pages',
      description: 'Fast, secure hosting with global CDN and zero cold starts.',
      url: 'https://pages.cloudflare.com/',
    },
    {
      name: 'Firebase Hosting',
      description: 'Backed by Google with global CDN delivery and easy deployment.',
      url: 'https://firebase.google.com/products/hosting',
    },
  ];

  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <h3 className="text-xl font-medium mb-4 text-primary">Hosting Options</h3>
      <div className="space-y-3">
        {hostingOptions.map((option) => (
          <div key={option.name} className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{option.name}</h4>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={option.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <span>Visit</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HostingOptions;
