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
import { EncryptionOnboarding } from "@/components/encryption-onboarding";
import { KeyImportPrompt } from "@/components/key-import-prompt";
import { EncryptionService } from "@/lib/encryption";
import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';

function Router() {
  const { isAuthenticated, loading, user } = useAuth();
  const [showEncryptionOnboarding, setShowEncryptionOnboarding] = useState(false);
  const [showKeyImportPrompt, setShowKeyImportPrompt] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const hasValidKey = EncryptionService.hasValidKey();
      const onboardingComplete = localStorage.getItem('vault_x_encryption_onboarding_complete') === 'true';
      const isNewUser = localStorage.getItem('vault_x_is_new_user') === 'true';
      
      if (isNewUser && !onboardingComplete) {
        // Show encryption onboarding for new users who haven't completed it
        setShowEncryptionOnboarding(true);
        setIsFirstTime(true);
      } else if (!hasValidKey && onboardingComplete) {
        // Show key import prompt for returning users who need their key
        setShowKeyImportPrompt(true);
      }
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your private vault...</p>
        </div>
      </div>
    );
  }

  // Show encryption onboarding for new users
  if (isAuthenticated && showEncryptionOnboarding) {
    return (
      <EncryptionOnboarding
        onComplete={() => setShowEncryptionOnboarding(false)}
        isFirstTime={isFirstTime}
      />
    );
  }

  // Show key import prompt for returning users without a key
  if (isAuthenticated && showKeyImportPrompt) {
    return (
      <KeyImportPrompt
        onComplete={() => setShowKeyImportPrompt(false)}
      />
    );
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Dashboard /> : <Onboarding />}
      </Route>
      <Route path="/dashboard">
        {isAuthenticated ? <Dashboard initialTab="dashboard" /> : <Onboarding />}
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
