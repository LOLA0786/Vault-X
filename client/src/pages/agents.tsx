import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { EncryptionService } from '@/lib/encryption';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SecurityBadge, SecurityStatus, EncryptionIndicator, SecurityIcon } from '@/components/ui/security-badge';
import { DashboardLayout } from '@/components/dashboard-layout';
import { 
  Bot, 
  Plus, 
  Trash2, 
  Settings, 
  
  User, 
  LogOut,
  Shield,
  Lock,
  Eye,
  Key,
  Database,
  Zap,
  CheckCircle,
  Edit3,
  Clock,
  Brain,
  ArrowRight,
  Sparkles,
  Fingerprint,
  ShieldCheck,
  MessageSquare,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AgentCreationForm } from '@/components/agent-creation-form';
import { AiAgent } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
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

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/ai-agents/${agentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/user', user?.id] });
        toast({
          title: "Agent deleted",
          description: "The AI agent has been permanently removed",
        });
        setAgentToDelete(null);
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the agent",
        variant: "destructive",
      });
    }
  };

  const handleAgentCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/user', user?.id] });
    setIsCreateDialogOpen(false);
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="w-full p-4 lg:p-6">
        <div className="space-y-6 lg:space-y-8">
          {/* Enhanced Agents Header */}
          <div className="bg-gradient-to-br from-security-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 border border-security-200 dark:border-slate-600 rounded-xl p-4 lg:p-6 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-4 lg:gap-0">
              <div className="flex items-center gap-4">
                <SecurityIcon type="bot" size="lg" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
                  <p className="text-base text-muted-foreground">Create and manage your private, encrypted AI assistants</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <SecurityStatus status="encrypted" message={`${agents.length} agents encrypted`} />
                <SecurityBadge variant="secure" size="lg" animated>
                  Privacy Protected
                </SecurityBadge>
              </div>
            </div>
            
            {/* Agent Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card variant="professional">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{agents.length}</p>
                      <p className="text-sm text-muted-foreground">Active Agents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="professional">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-security-500 to-security-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">100%</p>
                      <p className="text-sm text-muted-foreground">Encrypted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="professional">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">AI</p>
                      <p className="text-sm text-muted-foreground">Powered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="professional">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">24/7</p>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Agent Button */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your AI Agents</h2>
              <p className="text-sm text-muted-foreground">Manage your private, encrypted AI assistants</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="security" className="group">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Agent
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <AgentCreationForm onCreated={handleAgentCreated} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Agents Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="professional">
                  <CardContent className="p-4 lg:p-6">
                    <div className="animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : processedAgents.length === 0 ? (
            <Card variant="professional">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">No AI agents yet</h3>
                <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first AI agent to start having secure, encrypted conversations. All agent data is protected with client-side encryption.
                </p>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  variant="security"
                  className="group"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Agent
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {processedAgents.map((agent) => (
                <Card key={agent.id} variant="professional" className="group hover:transform hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">{agent.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <EncryptionIndicator isEncrypted={true} showLabel={false} size="sm" />
                            <span className="text-xs text-muted-foreground">Encrypted</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <SecurityBadge variant="encrypted" size="sm" animated>
                          Private
                        </SecurityBadge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {agent.decryptedDescription}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Created {new Date(agent.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                                                 <Lock className="h-3 w-3 text-emerald-600" />
                         <span className="text-emerald-600 font-medium">AES-256</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors duration-200"
                        onClick={() => {
                          setActiveTab('chat');
                          setLocation('/chat');
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAgentToDelete(agent.id)}
                        className="sm:w-auto w-full text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-950 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-2 sm:mr-0" />
                        <span className="sm:hidden">Delete Agent</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Security Notice */}
          <Card variant="professional">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-security-500 to-security-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground mb-2">Privacy & Security</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    All AI agents are encrypted with your personal encryption key. Agent descriptions, system prompts, and conversation history are never accessible to our servers.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="h-3 w-3" />
                      <span>Client-side Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Zero-Knowledge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      <span>AES-256 Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!agentToDelete} onOpenChange={() => setAgentToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete AI Agent</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this AI agent? This action cannot be undone and all encrypted data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => agentToDelete && handleDeleteAgent(agentToDelete)}
                className="bg-danger-600 hover:bg-danger-700"
              >
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>
    </DashboardLayout>
  );
}