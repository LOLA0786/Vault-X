import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid, GridItem } from '@/components/ui/grid';
import { Button } from '@/components/ui/button';
import { SecurityBadge, SecurityStatus, TrustScore, SecurityIcon } from '@/components/ui/security-badge';
import { 
  Database, 
  MessageSquare, 
  Shield, 
  Activity,
  ArrowRight,
  HardDrive,
  Key,
  Eye
} from 'lucide-react';

interface DashboardOverviewProps {
  filesCount: number;
  chatSessionsCount: number;
  onNavigate: (tab: string) => void;
}

export function DashboardOverview({ filesCount, chatSessionsCount, onNavigate }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Enhanced Dashboard Header */}
      <div className="bg-gradient-to-br from-security-50 to-primary-50 dark:from-slate-800 dark:to-slate-700 border border-security-200 dark:border-slate-600 rounded-xl p-6 shadow-lg shadow-security-500/10 dark:shadow-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <SecurityIcon type="shield" size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
              <p className="text-base text-muted-foreground">Your vault security overview and system status</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SecurityStatus status="secure" message="All systems operational" />
            <SecurityBadge variant="secure" size="lg" animated>Secure</SecurityBadge>
          </div>
        </div>
        
        {/* Enhanced Security Stats Grid */}
        <Grid cols={4} gap="lg" className="mb-8">
          <GridItem>
            <Card variant="professional" hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{filesCount}</p>
                    <p className="text-sm text-muted-foreground font-medium">Files Secured</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card variant="professional" hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{chatSessionsCount}</p>
                    <p className="text-sm text-muted-foreground font-medium">Chat Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card variant="professional" hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-security-500 to-security-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">100%</p>
                    <p className="text-sm text-muted-foreground font-medium">Encrypted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card variant="professional" hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">24/7</p>
                    <p className="text-sm text-muted-foreground font-medium">Monitoring</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GridItem>
        </Grid>

        {/* Security Status Overview */}
        <Grid cols={2} gap="lg">
          <GridItem>
            <Card variant="professional">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <SecurityIcon type="shield" size="md" />
                  <h3 className="text-lg font-semibold text-foreground">Security Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Encryption</span>
                    <SecurityBadge variant="secure" size="sm">Active</SecurityBadge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Key Management</span>
                    <SecurityBadge variant="verified" size="sm">Secure</SecurityBadge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Data Protection</span>
                    <SecurityBadge variant="encrypted" size="sm">Protected</SecurityBadge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card variant="professional">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <SecurityIcon type="shield" size="md" />
                  <h3 className="text-lg font-semibold text-foreground">System Health</h3>
                </div>
                <TrustScore score={98} label="Overall Security" size="md" />
              </CardContent>
            </Card>
          </GridItem>
        </Grid>
      </div>

      {/* Quick Actions */}
      <Grid cols={3} gap="lg">
        <GridItem>
          <Card variant="professional" hover className="group cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => onNavigate('vault')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <SecurityIcon type="database" size="lg" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">File Vault</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload and manage encrypted files</p>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary-50 dark:group-hover:bg-primary-950">
                    Access Vault
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card variant="professional" hover className="group cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => onNavigate('chat')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <SecurityIcon type="bot" size="lg" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">AI Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">Secure conversations with AI agents</p>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary-50 dark:group-hover:bg-primary-950">
                    Start Chat
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card variant="professional" hover className="group cursor-pointer transition-all duration-300 hover:scale-105" onClick={() => onNavigate('settings')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <SecurityIcon type="key" size="lg" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Security Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage encryption keys and preferences</p>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary-50 dark:group-hover:bg-primary-950">
                    Configure
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}