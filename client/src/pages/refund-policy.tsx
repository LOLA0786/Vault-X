import { Shield, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Footer } from '@/components/ui/footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Private Vault</h1>
                <p className="text-sm text-muted-foreground">by Pentaprime Solutions LLP</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Refund & Cancellation Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              Last updated: September 14, 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            
            {/* Quick Reference */}
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Quick Reference:</strong> Domestic refunds: 7-10 business days | International refunds: 10-15 business days
              </AlertDescription>
            </Alert>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Refund Eligibility</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Pentaprime Solutions LLP offers refunds under the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Service disruption for more than 48 consecutive hours due to technical issues on our end</li>
                  <li>Billing errors or duplicate charges</li>
                  <li>Cancellation within 7 days of initial subscription (pro-rated refund)</li>
                  <li>Failure to deliver promised service features (case-by-case basis)</li>
                  <li>Account termination due to our policy violations (partial refund may apply)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Non-Refundable Items</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The following are not eligible for refunds:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Partial month subscriptions after the 7-day cancellation period</li>
                  <li>Data recovery services or attempts</li>
                  <li>Third-party service integrations or add-ons</li>
                  <li>Refunds requested due to user error or misunderstanding of service features</li>
                  <li>Cancellations after significant service usage (determined case-by-case)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Refund Processing Timeline</h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Domestic Refunds (India)
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>Processing Time:</strong> 7-10 business days</p>
                      <p><strong>Method:</strong> Original payment method</p>
                      <p><strong>Notification:</strong> Email confirmation sent</p>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-green-600" />
                      International Refunds
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong>Processing Time:</strong> 10-15 business days</p>
                      <p><strong>Method:</strong> Original payment method</p>
                      <p><strong>Additional:</strong> Currency conversion may apply</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. How to Request a Refund</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  To request a refund, please follow these steps:
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                  <li>
                    <strong>Contact Support:</strong> Email us at chandan@privatevault.ai with your refund request
                  </li>
                  <li>
                    <strong>Provide Information:</strong> Include your account email, transaction ID, and reason for refund
                  </li>
                  <li>
                    <strong>Wait for Review:</strong> Our team will review your request within 2-3 business days
                  </li>
                  <li>
                    <strong>Receive Confirmation:</strong> You'll receive an email confirming approval or denial
                  </li>
                  <li>
                    <strong>Processing:</strong> Approved refunds will be processed according to the timeline above
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Subscription Cancellation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">5.1 How to Cancel</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You can cancel your subscription at any time through your account settings or by 
                    contacting our support team. Cancellation takes effect at the end of your current billing cycle.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">5.2 Access After Cancellation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    After cancellation, you'll retain access to your account until the end of your paid period. 
                    Your data will be retained for 30 days after subscription expiry for potential reactivation.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">5.3 Data Export</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We recommend exporting your data before cancellation. After the 30-day retention period, 
                    all data will be permanently deleted and cannot be recovered.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Partial Refunds</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  In certain circumstances, we may offer partial refunds:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Pro-rated refunds for unused subscription periods (within 7 days of purchase)</li>
                  <li>Service credit for significant downtime or service issues</li>
                  <li>Account upgrades or downgrades (difference refunded/charged)</li>
                  <li>Billing adjustments for pricing errors</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Chargeback Policy</h2>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please contact us before initiating a chargeback. Chargebacks may result in immediate account suspension.
                  </AlertDescription>
                </Alert>
                <p className="text-muted-foreground leading-relaxed">
                  If you initiate a chargeback without first contacting us, your account may be suspended 
                  pending resolution. We prefer to resolve disputes directly and will work with you to 
                  find a satisfactory solution.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Force Majeure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are not liable for delays in refund processing due to circumstances beyond our control, 
                including but not limited to natural disasters, government actions, banking system failures, 
                or other force majeure events.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Refund & Cancellation Policy from time to time. Material changes will be 
                communicated to active subscribers via email. The updated policy will apply to all future 
                transactions and refund requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <div className="bg-muted p-6 rounded-lg space-y-3">
                <p className="font-medium">Pentaprime Solutions LLP</p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> chandan@privatevault.ai </p>
                  <p><strong>Phone:</strong> +91-9326176427</p>
                  <p><strong>Address:</strong> D Wing 705, Ganga Estate, Behind Atur Park, Sion Trombay Road, Chembur East, Mumbai 400071, Maharashtra, India</p>
                  <p><strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  For refund requests or questions about this policy, please contact us using the 
                  information provided above. We aim to respond to all refund requests within 2-3 business days.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>

      <Footer currentPage="refund" />
    </div>
  );
}
