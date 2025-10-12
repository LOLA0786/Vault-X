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
import Chat from "@/pages/chat";
import History from "@/pages/history";
import Settings from "@/pages/settings";
import KeyInfo from "@/pages/key-info";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import RefundPolicy from "@/pages/refund-policy";
import Pricing from "@/pages/pricing";
import AdminDashboard from "@/pages/admin-dashboard";
import SubscriptionRequired from "@/pages/subscription-required";
import { ProtectedRoute } from "@/components/protected-route";
import { EncryptionOnboarding } from "@/components/encryption-onboarding";
import { KeyImportPrompt } from "@/components/key-import-prompt";
import { EncryptionService } from "@/lib/encryption";
import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Key, Shield } from 'lucide-react';
import { GlobalBackground } from "@/components/ui/global-background";
import { PageTransition } from "@/components/ui/page-transition";
import { FullPageLoading } from "@/components/ui/modern-loading";

function Router() {
  const { isAuthenticated, loading, user, showLogoutDialog, setShowLogoutDialog, confirmLogout } = useAuth();
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
        setShowKeyImportPrompt(false);
        setIsFirstTime(true);
      } else if (!hasValidKey) {
        // Show key import prompt for ALL users who don't have a valid key
        // This ensures it shows immediately after login if no key is present
        setShowKeyImportPrompt(true);
        setShowEncryptionOnboarding(false);
      } else {
        // User has a valid key, hide all prompts
        setShowKeyImportPrompt(false);
        setShowEncryptionOnboarding(false);
      }
    } else {
      // User not authenticated, reset all states
      setShowKeyImportPrompt(false);
      setShowEncryptionOnboarding(false);
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return <FullPageLoading message="Loading your private vault..." />;
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
    <PageTransition>
      <GlobalBackground parallax />
      <Switch>
        <Route path="/">
          {isAuthenticated ? <Dashboard /> : <Onboarding />}
        </Route>
        <Route path="/dashboard">
          {isAuthenticated ? <Dashboard initialTab="dashboard" /> : <Onboarding />}
        </Route>
        <Route path="/agents">
          {isAuthenticated ? (
            <ProtectedRoute requireSubscription={true}>
              <Agents />
            </ProtectedRoute>
          ) : <Onboarding />}
        </Route>
        <Route path="/vault">
          {isAuthenticated ? (
            <ProtectedRoute requireSubscription={true}>
              <Dashboard initialTab="vault" />
            </ProtectedRoute>
          ) : <Onboarding />}
        </Route>
        <Route path="/chat">
          {isAuthenticated ? (
            <ProtectedRoute requireSubscription={true}>
              <Chat />
            </ProtectedRoute>
          ) : <Onboarding />}
        </Route>
        <Route path="/history">
          {isAuthenticated ? (
            <ProtectedRoute requireSubscription={true}>
              <History />
            </ProtectedRoute>
          ) : <Onboarding />}
        </Route>
        <Route path="/key-info">
          {isAuthenticated ? <KeyInfo /> : <Onboarding />}
        </Route>
        <Route path="/settings">
          {isAuthenticated ? <Settings /> : <Onboarding />}
        </Route>
        <Route path="/pricing" component={Pricing} />
        <Route path="/subscription-required">
          {isAuthenticated ? <SubscriptionRequired /> : <Onboarding />}
        </Route>
        <Route path="/admin">
          {isAuthenticated ? <AdminDashboard /> : <Onboarding />}
        </Route>

        {/* Legal Pages - Publicly Accessible */}
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-conditions" component={TermsConditions} />
        <Route path="/refund-policy" component={RefundPolicy} />
        

        <Route component={NotFound} />
      </Switch>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-sm">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-medium mb-2">
                  <Shield className="w-4 h-4" />
                  Security Warning
                </div>
                <p className="text-amber-700 dark:text-amber-300 text-xs">
                  Logging out will remove your encryption key from this device.
                </p>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="font-medium">Your data will become unreadable unless you:</p>
                <div className="space-y-1 ml-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-3 h-3" />
                    <span>Export your encryption key backup first, OR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Clear corrupted data after logout</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              className="flex-1 text-xs h-8"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs h-8"
              onClick={confirmLogout}
            >
              Logout Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
