import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Home, Search, Lock } from 'lucide-react';
import { useLocation } from 'wouter';
import { SecurityIcon } from '@/components/ui/security-badge';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="card-professional shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="relative mx-auto mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Shield className="text-white h-12 w-12" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-warning-500 to-warning-600 rounded-full flex items-center justify-center shadow-lg">
                <Search className="text-white h-4 w-4" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold mb-4">
              404 - Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              The secure page you're looking for doesn't exist or has been moved
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Security Notice */}
            <div className="p-6 bg-gradient-to-r from-security-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-security-200 dark:border-slate-600">
              <div className="flex items-start gap-4">
                <SecurityIcon type="shield" size="md" />
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Security Check</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your security session is still active. All your encrypted data remains protected and secure.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      <span>Session Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-3 w-3" />
                      <span>Data Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setLocation('/')}
                className="btn-security group flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
                <ArrowLeft className="h-4 w-4 ml-2 group-hover:-translate-x-1 transition-transform duration-200" />
              </Button>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                                  className="flex-1 border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                If you believe this is an error, please contact our security team
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
