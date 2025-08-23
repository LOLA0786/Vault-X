import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { EncryptionService } from '@/lib/encryption';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Plus, Trash2, Settings, Bot as BotIcon, User, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AgentCreationForm } from '@/components/agent-creation-form';
import { AiAgent } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Sidebar } from '@/components/ui/sidebar';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AgentWithDecrypted = AiAgent & {
  decryptedDescription: string;
  decryptedSystemPrompt: string;
};

export default function AgentsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('agents');

  const handleTabChange = (tab: string) => {
    // Client-side navigation for known routes
    if (tab === 'dashboard') {
      setLocation('/');
      return;
    }
    if (tab === 'vault') {
      setLocation('/vault');
      setActiveTab('vault');
      return;
    }
    if (tab === 'chat') {
      setLocation('/chat');
      setActiveTab('chat');
      return;
    }
    if (tab === 'history') {
      setLocation('/history');
      setActiveTab('history');
      return;
    }
    if (tab === 'settings') {
      setLocation('/settings');
      setActiveTab('settings');
      return;
    }

    // default: set local active tab
    setActiveTab(tab);
  };

  const { data: agents = [], isLoading } = useQuery<AiAgent[]>({
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

  const handleDeleteAgent = async () => {
    if (!agentToDelete) return;
    
    try {
      const response = await fetch(`/api/ai-agents/${agentToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast({
          title: 'Agent deleted',
          description: 'The agent has been successfully deleted',
        });
        queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/user', user?.id] });
      } else {
        throw new Error('Failed to delete agent');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the agent',
        variant: 'destructive',
      });
    } finally {
      setAgentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        className="fixed h-full bg-sidebar text-sidebar-foreground dark:bg-sidebar dark:text-sidebar-foreground"
      />

      <div className="flex-1 ml-64 overflow-hidden bg-background text-foreground">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground capitalize">
                AI Agents
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage your custom AI assistants
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="text-white h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground" data-testid="user-email">
                  {user?.email}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto bg-background text-foreground" style={{ height: 'calc(100vh - 88px)' }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Create and manage custom AI agents with specialized capabilities
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <AgentCreationForm onCreated={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="bg-gray-100 dark:bg-gray-800 h-32"></CardHeader>
                  <CardContent className="py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-2/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : processedAgents.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <BotIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Agents Created Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Create your first custom AI agent to provide specialized assistance in your conversations.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedAgents.map((agent) => (
                <Card key={agent.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>{agent.name}</CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setAgentToDelete(agent.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {agent.decryptedDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Tabs defaultValue="prompt">
                      <TabsList className="w-full">
                        <TabsTrigger value="prompt" className="flex-1">System Prompt</TabsTrigger>
                        <TabsTrigger value="usage" className="flex-1">Usage</TabsTrigger>
                      </TabsList>
                      <TabsContent value="prompt" className="mt-4">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {agent.decryptedSystemPrompt}
                        </div>
                      </TabsContent>
                      <TabsContent value="usage" className="mt-4">
                        <div className="text-sm text-gray-500">
                          <p>Created: {new Date(agent.createdAt).toLocaleDateString()}</p>
                          <p>Last updated: {new Date(agent.updatedAt).toLocaleDateString()}</p>
                          <p className="mt-3">
                            To use this agent, select it when starting a new chat session.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <AlertDialog open={!!agentToDelete} onOpenChange={(open) => !open && setAgentToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the AI agent
                  and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAgent} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
