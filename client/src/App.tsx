import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Dashboard from "@/pages/dashboard";
import Onboarding from "@/pages/onboarding";
import NotFound from "@/pages/not-found";
import Agents from "@/pages/agents";
import { ThemeProvider } from 'next-themes';

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your secure vault...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Dashboard /> : <Onboarding />}
      </Route>
      <Route path="/agents">
        {isAuthenticated ? <Agents /> : <Onboarding />}
      </Route>
      <Route path="/vault">
        {isAuthenticated ? <Dashboard initialTab="vault" /> : <Onboarding />}
      </Route>
      <Route path="/chat">
        {isAuthenticated ? <Dashboard initialTab="chat" /> : <Onboarding />}
      </Route>
      <Route path="/history">
        {isAuthenticated ? <Dashboard initialTab="history" /> : <Onboarding />}
      </Route>
      <Route path="/key-info">
        {isAuthenticated ? <Dashboard initialTab="key-info" /> : <Onboarding />}
      </Route>
      <Route path="/settings">
        {isAuthenticated ? <Dashboard initialTab="settings" /> : <Onboarding />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
