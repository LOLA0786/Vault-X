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
  PlusCircle 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AiAgent } from '@shared/schema';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AgentCreationForm } from './agent-creation-form';

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

  const handleSelectAgent = (agent: AgentWithDecrypted | null) => {
    onSelectAgent(agent);
  };

  if (isLoading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-medium mb-4">AI Agents</h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 rounded-md border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={className}>
        <h3 className="text-lg font-medium mb-4">AI Agents</h3>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Failed to load AI agents</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">AI Agents</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <AgentCreationForm onCreated={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-2">
        <div className="space-y-2">
          <div 
            className={`flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
              selectedAgentId === null ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={() => handleSelectAgent(null)}
          >
            <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="font-medium">Default AI Assistant</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Standard AI with no special instructions</p>
            </div>
          </div>
          
          {processedAgents.map((agent) => (
            <div 
              key={agent.id}
              className={`flex items-start p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                selectedAgentId === agent.id ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
              onClick={() => handleSelectAgent(agent)}
            >
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                {getIconComponent(agent.icon)}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <p className="font-medium">{agent.name}</p>
                  {selectedAgentId === agent.id && (
                    <Badge variant="outline" className="ml-2 text-xs">Active</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{agent.decryptedDescription}</p>
              </div>
            </div>
          ))}

          {processedAgents.length === 0 && (
            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
              <p>No custom agents yet</p>
              <p className="text-sm mt-1">Create your first agent to specialize your AI assistant</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
