import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernInput } from '@/components/ui/modern-input';
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
import { Bot, Save, Plus, AlertCircle } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
    { value: 'robot', label: 'Robot' },
    { value: 'brain', label: 'Brain' },
    { value: 'dna', label: 'DNA' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'chef', label: 'Chef' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'code', label: 'Code' },
    { value: 'pen', label: 'Writer' },
    { value: 'calculator', label: 'Math' },
  ];

  return (
    <ModernCard variant="gradient" className="w-full">
      <ModernCardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Bot className="h-8 w-8 text-white" />
        </div>
        <ModernCardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create Custom AI Agent
        </ModernCardTitle>
        <ModernCardDescription className="text-lg">
          Create a specialized AI agent with a specific personality or expertise
        </ModernCardDescription>
      </ModernCardHeader>
      <ModernCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Agent Name</FormLabel>
                  <FormControl>
                    <ModernInput 
                      variant="outlined"
                      inputSize="lg"
                      placeholder="e.g., Dietitian Assistant" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    A distinctive name for your AI agent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., An AI assistant specialized in providing nutritional advice and diet plans"
                      className="min-h-[100px] rounded-xl border-2 border-border hover:border-primary/30 focus:border-primary text-base p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    Briefly describe what this agent does
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., You are a professional dietitian with expertise in nutrition science..."
                      className="min-h-[150px] rounded-xl border-2 border-border hover:border-primary/30 focus:border-primary text-base p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">
                    The instructions that define how the AI agent behaves
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Icon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-2 border-border hover:border-primary/30 focus:border-primary text-base">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-sm">
                    Choose an icon to represent your agent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="premium"
              size="xl"
              className="w-full shadow-2xl"
              disabled={createAgentMutation.isPending}
            >
              {createAgentMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Agent...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Create Agent
                </>
              )}
            </Button>
          </form>
        </Form>
      </ModernCardContent>
    </ModernCard>
  );
}
