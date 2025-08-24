import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { EncryptionService } from '@/lib/encryption';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bot, 
  Brain, 
  Dna, 
  Activity, 
  ChefHat, 
  Pencil, 
  Code, 
  Calculator, 
  GraduationCap, 
  PlusCircle,
  Sparkles,
  Zap,
  Star,
  Settings,
  MoreHorizontal,
  CheckCircle,
  Clock,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AiAgent } from '@shared/schema';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AgentCreationForm } from './agent-creation-form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SecurityBadge, SecurityIcon } from '@/components/ui/security-badge';
import { cn } from '@/lib/utils';

type AgentWithDecrypted = AiAgent & {
  decryptedDescription: string;
  decryptedSystemPrompt: string;
};

interface AgentListProps {
  onSelectAgent: (agent: AgentWithDecrypted | null) => void;
  selectedAgentId?: string | null;
  className?: string;
}

export function AgentList({ onSelectAgent, selectedAgentId, className }: AgentListProps) {
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: agents = [], isLoading, isError } = useQuery<AiAgent[]>({
    queryKey: ['/api/ai-agents/user', user?.id],
    enabled: !!user?.id,
  });

  // Process agents to include decrypted content
  const processedAgents: AgentWithDecrypted[] = agents.map(agent => {
    try {
      const decryptedDescription = EncryptionService.decrypt(agent.encryptedDescription);
      const decryptedSystemPrompt = EncryptionService.decrypt(agent.encryptedSystemPrompt);
      return {
        ...agent,
        decryptedDescription,
        decryptedSystemPrompt
      } as AgentWithDecrypted;
    } catch (error) {
      console.error('Failed to decrypt agent data:', error);
      return {
        ...agent,
        decryptedDescription: 'Failed to decrypt description',
        decryptedSystemPrompt: ''
      } as AgentWithDecrypted;
    }
  });

  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case 'robot': return <Bot className="h-6 w-6" />;
      case 'brain': return <Brain className="h-6 w-6" />;
      case 'dna': return <Dna className="h-6 w-6" />;
      case 'doctor': return <Activity className="h-6 w-6" />;
      case 'chef': return <ChefHat className="h-6 w-6" />;
      case 'teacher': return <GraduationCap className="h-6 w-6" />;
      case 'code': return <Code className="h-6 w-6" />;
      case 'pen': return <Pencil className="h-6 w-6" />;
      case 'calculator': return <Calculator className="h-6 w-6" />;
      default: return <Bot className="h-6 w-6" />;
    }
  };

  const getAgentColor = (iconName: string | null) => {
    switch (iconName) {
      case 'robot': return 'from-blue-500 to-blue-600';
      case 'brain': return 'from-purple-500 to-purple-600';
      case 'dna': return 'from-green-500 to-green-600';
      case 'doctor': return 'from-red-500 to-red-600';
      case 'chef': return 'from-orange-500 to-orange-600';
      case 'teacher': return 'from-indigo-500 to-indigo-600';
      case 'code': return 'from-cyan-500 to-cyan-600';
      case 'pen': return 'from-pink-500 to-pink-600';
      case 'calculator': return 'from-teal-500 to-teal-600';
      default: return 'from-primary-500 to-primary-600';
    }
  };

  const handleSelectAgent = (agent: AgentWithDecrypted | null) => {
    onSelectAgent(agent);
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Agents</h3>
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-4">AI Agents</h3>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p>Failed to load AI agents</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Agents</h3>
            <p className="text-sm text-muted-foreground">Specialized AI assistants</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <AgentCreationForm onCreated={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[400px] rounded-lg border bg-card/50">
          <div className="p-4 space-y-3">
            {/* Default Agent */}
            <Card 
              className={cn(
                "group cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                selectedAgentId === null 
                  ? "border-primary/50 bg-primary/5 shadow-lg" 
                  : "border-border hover:border-primary/30"
              )}
              onClick={() => handleSelectAgent(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">Default AI Assistant</h4>
                      {selectedAgentId === null && (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      General purpose AI with no special instructions
                    </p>
                    <div className="flex items-center gap-2">
                      <SecurityBadge variant="secure" size="xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Encrypted
                      </SecurityBadge>
                      <Badge variant="outline" size="sm" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Ready
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Custom Agents */}
            {processedAgents.map((agent) => (
              <Card 
                key={agent.id}
                className={cn(
                  "group cursor-pointer transition-all duration-200 hover:shadow-md border-2",
                  selectedAgentId === agent.id 
                    ? "border-primary/50 bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/30"
                )}
                onClick={() => handleSelectAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br",
                      getAgentColor(agent.icon)
                    )}>
                      {getIconComponent(agent.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{agent.name}</h4>
                        <div className="flex items-center gap-2">
                          {selectedAgentId === agent.id && (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Agent options</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {agent.decryptedDescription}
                      </p>
                      <div className="flex items-center gap-2">
                        <SecurityBadge variant="encrypted" size="xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Private
                        </SecurityBadge>
                        <Badge variant="outline" size="sm" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {processedAgents.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">No custom agents yet</h4>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create your first AI agent to specialize your assistant for specific tasks and domains.
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Agent
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Stats */}
        {processedAgents.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Agents</span>
              <Badge variant="outline" className="text-xs">
                {processedAgents.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Active</span>
              <Badge variant="default" className="text-xs">
                {selectedAgentId ? 'Custom' : 'Default'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
