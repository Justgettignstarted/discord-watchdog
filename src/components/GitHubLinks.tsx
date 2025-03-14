
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from 'lucide-react';

const GitHubLinks = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => window.open("https://github.com/kiIogram/Discord-Report-Bot/issues", "_blank")}
      >
        <Github className="h-4 w-4" />
        Report Bug
        <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
      </Button>
      <Button 
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => window.open("https://github.com/kiIogram/Discord-Report-Bot/issues", "_blank")}
      >
        <Github className="h-4 w-4" />
        Request Feature
        <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
      </Button>
    </div>
  );
};

export default GitHubLinks;
