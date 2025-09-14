import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/ui/footer';

export default function PrivacyPolicy() {
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
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">
              Last updated: September 14, 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.1 Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, 
                    use our services, or contact us for support. This may include your email address, 
                    name, and any other information you choose to provide.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">1.2 Usage Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information about how you use our service, including your interactions 
                    with features, preferences, and technical data such as IP address, browser type, 
                    and device information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">1.3 Encrypted Content</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All your files and conversations are encrypted client-side using AES-256 encryption 
                    before being stored on our servers. We cannot access or decrypt your content.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, 
                  except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                  <li>With service providers who assist us in operating our service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or 
                  destruction. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>AES-256 client-side encryption for all user content</li>
                  <li>Secure data transmission using HTTPS/TLS</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Zero-knowledge architecture - we cannot access your encrypted data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request correction of inaccurate information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your information for as long as your account is active or as needed to 
                provide you services. We will delete your information upon account deletion, except 
                where we are required to retain it for legal, regulatory, or legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any material 
                changes by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <div className="bg-muted p-6 rounded-lg space-y-3">
                <p className="font-medium">Pentaprime Solutions LLP</p>
                <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> chandan@privatevault.ai </p>
                  <p><strong>Phone:</strong> +91-9326176427</p>
                  <p><strong>Address:</strong> D Wing 705, Ganga Estate, Behind Atur Park, Sion Trombay Road, Chembur East, Mumbai 400071, Maharashtra, India</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us using the 
                  information provided above.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>

      <Footer currentPage="privacy" />
    </div>
  );
}
