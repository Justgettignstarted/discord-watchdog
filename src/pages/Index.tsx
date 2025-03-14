
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DiscordToken, 
  ReportData, 
  ReportReason,
  validateToken, 
  sendReport 
} from '../utils/discordUtils';

const Index = () => {
  const [tokens, setTokens] = useState<DiscordToken[]>([]);
  const [newToken, setNewToken] = useState('');
  const [reportData, setReportData] = useState<ReportData>({
    guildId: '',
    channelId: '',
    messageId: '',
    reason: ReportReason.IllegalContent
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportsSent, setReportsSent] = useState(0);
  const { toast } = useToast();

  const handleAddToken = async () => {
    if (!newToken.trim()) return;

    setIsProcessing(true);
    const isValid = await validateToken(newToken);
    
    setTokens(prev => [...prev, {
      id: crypto.randomUUID(),
      value: newToken,
      isValid
    }]);
    
    setNewToken('');
    setIsProcessing(false);
    
    toast({
      title: isValid ? "Token Added Successfully" : "Invalid Token",
      description: isValid ? 
        "The token has been validated and added to the list." : 
        "The provided token is invalid or has been revoked.",
      variant: isValid ? "default" : "destructive"
    });
  };

  const handleRemoveToken = (id: string) => {
    setTokens(prev => prev.filter(token => token.id !== id));
  };

  const startReporting = async () => {
    if (!reportData.guildId || !reportData.channelId || !reportData.messageId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setReportsSent(0);

    const validTokens = tokens.filter(token => token.isValid);
    if (validTokens.length === 0) {
      toast({
        title: "No Valid Tokens",
        description: "Please add at least one valid token to continue.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    let successCount = 0;
    const totalAttempts = validTokens.length * 10; // 10 reports per token

    for (const token of validTokens) {
      for (let i = 0; i < 10; i++) {
        const success = await sendReport(
          token.value,
          reportData.channelId,
          reportData.guildId,
          reportData.messageId,
          reportData.reason
        );
        if (success) successCount++;
        setReportsSent(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      }
    }

    setIsProcessing(false);
    toast({
      title: "Operation Complete",
      description: `Successfully sent ${successCount} out of ${totalAttempts} reports.`,
      variant: successCount > 0 ? "default" : "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge 
            variant="secondary" 
            className="animate-slide-down"
          >
            Discord Watchdog
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight animate-slide-up">
            Content Reporting Tool
          </h1>
          <p className="text-muted-foreground animate-slide-up">
            Efficiently manage and report content violations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Token Management Card */}
          <Card className="glass-panel animate-scale-in">
            <CardHeader>
              <CardTitle>Token Management</CardTitle>
              <CardDescription>Add and validate Discord tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Discord token"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  className="input-field"
                />
                <Button 
                  onClick={handleAddToken}
                  disabled={!newToken || isProcessing}
                  className="button-primary"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : 'Add'}
                </Button>
              </div>
              <div className="space-y-2">
                {tokens.map(token => (
                  <div 
                    key={token.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-2">
                      {token.isValid ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive" />
                      )}
                      <span className="font-mono text-sm">
                        {token.value.slice(0, 12)}...
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveToken(token.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Configuration Card */}
          <Card className="glass-panel animate-scale-in">
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Configure report parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Guild ID"
                value={reportData.guildId}
                onChange={(e) => setReportData(prev => ({ ...prev, guildId: e.target.value }))}
                className="input-field"
              />
              <Input
                placeholder="Channel ID"
                value={reportData.channelId}
                onChange={(e) => setReportData(prev => ({ ...prev, channelId: e.target.value }))}
                className="input-field"
              />
              <Input
                placeholder="Message ID"
                value={reportData.messageId}
                onChange={(e) => setReportData(prev => ({ ...prev, messageId: e.target.value }))}
                className="input-field"
              />
              <Select
                value={reportData.reason}
                onValueChange={(value) => setReportData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportReason.IllegalContent}>Illegal Content</SelectItem>
                  <SelectItem value={ReportReason.Harassment}>Harassment</SelectItem>
                  <SelectItem value={ReportReason.SpamOrPhishing}>Spam or Phishing</SelectItem>
                  <SelectItem value={ReportReason.SelfHarm}>Self-Harm</SelectItem>
                  <SelectItem value={ReportReason.NSFWContent}>NSFW Content</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
            <CardFooter>
              <Button 
                className="button-primary w-full"
                onClick={startReporting}
                disabled={isProcessing || tokens.length === 0}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing... ({reportsSent})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Start Reporting</span>
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Status Section */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in">
          <p>
            {isProcessing ? (
              `Processing reports... ${reportsSent} reports sent`
            ) : (
              tokens.length > 0 ? (
                `${tokens.filter(t => t.isValid).length} valid tokens ready`
              ) : (
                'Add tokens to begin'
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
