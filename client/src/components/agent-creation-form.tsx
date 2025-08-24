import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { EncryptionService } from '@/lib/encryption';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bot, 
  Save, 
  Plus, 
  AlertCircle, 
  Sparkles, 
  Shield, 
  Zap, 
  Brain, 
  Dna, 
  Activity, 
  ChefHat, 
  Pencil, 
  Code, 
  Calculator, 
  GraduationCap,
  CheckCircle,
  Loader2,
  Eye
} from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '@/components/ui/badge';
import { SecurityBadge } from '@/components/ui/security-badge';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  systemPrompt: z.string().min(10, 'System prompt must be at least 10 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  icon: z.string().default('robot'),
});

export function AgentCreationForm({ onCreated }: { onCreated?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedIcon, setSelectedIcon] = useState('robot');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      systemPrompt: '',
      description: '',
      icon: 'robot',
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user) throw new Error('You must be logged in to create an agent');

      // Encrypt sensitive data
      const encryptedSystemPrompt = EncryptionService.encrypt(values.systemPrompt);
      const encryptedDescription = EncryptionService.encrypt(values.description);

      const response = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: values.name,
          encryptedSystemPrompt,
          encryptedDescription,
          icon: values.icon,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create agent');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'AI Agent created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-agents/user', user?.id] });
      form.reset();
      onCreated?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create agent',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAgentMutation.mutate(values);
  };

  const iconOptions = [
    { value: 'robot', label: 'Robot', icon: Bot, color: 'from-blue-500 to-blue-600' },
    { value: 'brain', label: 'Brain', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { value: 'dna', label: 'DNA', icon: Dna, color: 'from-green-500 to-green-600' },
    { value: 'doctor', label: 'Doctor', icon: Activity, color: 'from-red-500 to-red-600' },
    { value: 'chef', label: 'Chef', icon: ChefHat, color: 'from-orange-500 to-orange-600' },
    { value: 'teacher', label: 'Teacher', icon: GraduationCap, color: 'from-indigo-500 to-indigo-600' },
    { value: 'code', label: 'Code', icon: Code, color: 'from-cyan-500 to-cyan-600' },
    { value: 'pen', label: 'Writer', icon: Pencil, color: 'from-pink-500 to-pink-600' },
    { value: 'calculator', label: 'Math', icon: Calculator, color: 'from-teal-500 to-teal-600' },
  ];

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(opt => opt.value === iconName);
    if (!option) return Bot;
    return option.icon;
  };

  const getIconColor = (iconName: string) => {
    const option = iconOptions.find(opt => opt.value === iconName);
    return option?.color || 'from-primary-500 to-primary-600';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-950 dark:to-purple-950 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Create Custom AI Agent</CardTitle>
              <CardDescription className="text-base">
                Design a specialized AI assistant with unique personality and expertise
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Agent Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Agent Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Dietitian Assistant, Code Mentor, Writing Coach" 
                        className="h-12 text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Choose a distinctive name that reflects your agent's purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icon Selection */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Agent Icon</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-3">
                        {iconOptions.map((iconOption) => {
                          const IconComponent = iconOption.icon;
                          const isSelected = field.value === iconOption.value;
                          return (
                            <div
                              key={iconOption.value}
                              className={cn(
                                "flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                isSelected
                                  ? "border-primary/50 bg-primary/5 shadow-md"
                                  : "border-border hover:border-primary/30 hover:bg-muted/50"
                              )}
                              onClick={() => {
                                field.onChange(iconOption.value);
                                setSelectedIcon(iconOption.value);
                              }}
                            >
                              <div className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg mb-2 bg-gradient-to-br",
                                iconOption.color
                              )}>
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-sm font-medium text-center">{iconOption.label}</span>
                              {isSelected && (
                                <CheckCircle className="h-4 w-4 text-primary mt-1" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm">
                      Select an icon that represents your agent's domain
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., An AI assistant specialized in providing nutritional advice, meal planning, and dietary recommendations based on scientific research" 
                        className="min-h-[80px] text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Briefly describe what this agent does and its expertise area
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* System Prompt */}
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">System Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., You are a professional dietitian with expertise in nutrition science. You provide evidence-based dietary advice, create personalized meal plans, and help users understand nutritional concepts. Always prioritize health and safety in your recommendations..." 
                        className="min-h-[120px] text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Define the personality, expertise, and behavior of your AI agent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview */}
              <div className="p-4 bg-muted/30 rounded-lg border">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Agent Preview
                </h4>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shadow-md bg-gradient-to-br",
                    getIconColor(form.watch('icon'))
                  )}>
                    {(() => {
                      const IconComponent = getIconComponent(form.watch('icon'));
                      return <IconComponent className="h-5 w-5 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">
                      {form.watch('name') || 'Your Agent Name'}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {form.watch('description') || 'Agent description will appear here'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-security-50 dark:bg-security-950/20 rounded-lg border border-security-200 dark:border-security-800">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-security-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-security-900 dark:text-security-100 mb-1">
                      End-to-End Encrypted
                    </h4>
                    <p className="text-sm text-security-700 dark:text-security-300">
                      Your agent's instructions and description are encrypted locally before being stored. 
                      Only you can decrypt and access this information.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={createAgentMutation.isPending}
              >
                {createAgentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Create AI Agent
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
