import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/ui/footer';

export default function TermsConditions() {
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
            <CardTitle className="text-3xl font-bold text-center">Terms & Conditions</CardTitle>
            <p className="text-center text-muted-foreground">
              Last updated: September 14, 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Private Vault, a service provided by Pentaprime Solutions LLP 
                ("Company", "we", "us", or "our"), you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Private Vault is a secure, encrypted file storage and AI-powered assistant platform that provides:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Client-side AES-256 encryption for all user content</li>
                  <li>Secure file storage and management</li>
                  <li>AI-powered chat and document analysis</li>
                  <li>Zero-knowledge architecture ensuring privacy</li>
                  <li>Cross-platform accessibility</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Responsibilities</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.1 Account Creation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You must provide accurate and complete information when creating an account. 
                    You are responsible for maintaining the security of your account credentials 
                    and encryption keys.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">3.2 Encryption Key Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You are solely responsible for managing your encryption keys. Loss of encryption 
                    keys will result in permanent loss of access to your encrypted data. We cannot 
                    recover lost encryption keys due to our zero-knowledge architecture.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">3.3 Prohibited Uses</h3>
                  <p className="text-muted-foreground leading-relaxed">You agree not to use the service for:</p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                    <li>Illegal activities or content</li>
                    <li>Violating intellectual property rights</li>
                    <li>Distributing malware or harmful code</li>
                    <li>Harassment, abuse, or harmful behavior</li>
                    <li>Unauthorized access to systems or data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.1 Subscription Plans</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our service offers various subscription plans with different features and storage limits. 
                    Pricing is clearly displayed on our website and may be subject to change with notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">4.2 Payment Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Payments are processed securely through Razorpay and other authorized payment processors. 
                    All transactions are subject to verification and approval.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">4.3 Refund Policy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Refunds are processed according to our Refund & Cancellation Policy. Please refer to 
                    that document for detailed information about refund timelines and eligibility.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data and Privacy</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to protecting your privacy and data security:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All user content is encrypted client-side before transmission</li>
                  <li>We cannot access or decrypt your stored content</li>
                  <li>Data processing complies with applicable privacy laws</li>
                  <li>Users maintain full control over their data</li>
                  <li>Data deletion is permanent and irreversible</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain high service availability but cannot guarantee 100% uptime. 
                Scheduled maintenance will be announced in advance when possible. We are not liable 
                for service interruptions beyond our reasonable control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The Private Vault service, including its design, functionality, and content, is owned by 
                  Pentaprime Solutions LLP and protected by intellectual property laws. Users retain ownership 
                  of their uploaded content but grant us necessary rights to provide the service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, Pentaprime Solutions LLP shall not be liable for any 
                  indirect, incidental, special, or consequential damages arising from your use of the service. 
                  Our total liability shall not exceed the amount paid by you for the service in the past 12 months.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Either party may terminate this agreement at any time. Upon termination, your access to the 
                  service will cease, and your data may be deleted according to our data retention policy. 
                  You may export your data before termination.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Material changes will be 
                communicated to users via email or service notifications. Continued use of the service 
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <div className="bg-muted p-6 rounded-lg space-y-3">
                <p className="font-medium">Pentaprime Solutions LLP</p>
                <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> chandan@privatevault.ai </p>
                  <p><strong>Phone:</strong> +91-9326176427</p>
                  <p><strong>Address:</strong> D Wing 705, Ganga Estate, Behind Atur Park, Sion Trombay Road, Chembur East, Mumbai 400071, Maharashtra, India</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  For any questions about these Terms & Conditions, please contact us using the 
                  information provided above.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>

      <Footer currentPage="terms" />
    </div>
  );
}
