import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer } from '@/components/ui/modern-layout';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/ui/page-transition';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { Shield, Lock, Key, Server, Eye, FileCheck, ArrowLeft, Download } from 'lucide-react';

export default function Whitepaper() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: Shield,
      title: 'End-to-End Encryption',
      content: 'All data is encrypted on your device before transmission using AES-256-GCM encryption, the same standard used by governments and militaries worldwide.'
    },
    {
      icon: Key,
      title: 'Client-Side Key Generation',
      content: 'Encryption keys are generated entirely on your device using cryptographically secure random number generation and never transmitted to our servers.'
    },
    {
      icon: Eye,
      title: 'Zero-Knowledge Architecture',
      content: 'We cannot access your unencrypted data. Even if compelled by law enforcement, we have no technical capability to decrypt your files.'
    },
    {
      icon: Server,
      title: 'Secure Storage',
      content: 'Encrypted data is stored on secure servers with multiple layers of protection, but remains encrypted at rest and can only be decrypted with your key.'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => setLocation('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <PrivateVaultLogo size="sm" />
            </button>
            <div className="flex items-center gap-4">
              <Button onClick={() => window.print()} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={() => setLocation('/')} variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </header>

        <ModernContainer className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Security Whitepaper
              </h1>
              <p className="text-xl text-muted-foreground">
                Technical Overview of PrivateVault.ai Security Architecture
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Version 1.0 | October 2025
              </p>
            </div>

            {/* Executive Summary */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>Executive Summary</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  PrivateVault.ai implements a zero-knowledge, end-to-end encrypted architecture that ensures 
                  complete data privacy. Our security model is built on the principle that we, as the service 
                  provider, should never have access to your unencrypted data. This whitepaper details the 
                  cryptographic methods, architectural decisions, and security practices that make this possible.
                </p>
              </ModernCardContent>
            </ModernCard>

            {/* Core Security Features */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Core Security Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {sections.map((section, index) => (
                  <ModernCard key={index}>
                    <ModernCardHeader>
                      <ModernCardTitle className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <section.icon className="h-5 w-5 text-primary" />
                        </div>
                        {section.title}
                      </ModernCardTitle>
                    </ModernCardHeader>
                    <ModernCardContent>
                      <p className="text-sm text-muted-foreground">{section.content}</p>
                    </ModernCardContent>
                  </ModernCard>
                ))}
              </div>
            </div>

            {/* Technical Implementation */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>1. Encryption Implementation</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1.1 Algorithm Selection</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    We use AES-256-GCM (Advanced Encryption Standard with 256-bit keys in Galois/Counter Mode) for all data encryption:
                  </p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>256-bit key length provides 2^256 possible keys</li>
                    <li>GCM mode provides both confidentiality and authenticity</li>
                    <li>NIST-approved and FIPS 140-2 compliant</li>
                    <li>Resistant to known cryptographic attacks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">1.2 Key Derivation</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    User encryption keys are derived using PBKDF2 (Password-Based Key Derivation Function 2):
                  </p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>100,000+ iterations for computational hardness</li>
                    <li>Unique salt per user prevents rainbow table attacks</li>
                    <li>SHA-256 as the underlying hash function</li>
                    <li>Keys never stored in plaintext</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">1.3 Initialization Vectors</h3>
                  <p className="text-sm text-muted-foreground">
                    Each encryption operation uses a unique, cryptographically random 96-bit initialization vector (IV) 
                    generated using the Web Crypto API's secure random number generator. IVs are stored alongside 
                    encrypted data but provide no information about the plaintext.
                  </p>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Architecture */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>2. Zero-Knowledge Architecture</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">2.1 Client-Side Operations</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    All cryptographic operations occur in the user's browser:
                  </p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Key generation using Web Crypto API</li>
                    <li>File encryption before upload</li>
                    <li>File decryption after download</li>
                    <li>Chat message encryption</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2.2 Server Responsibilities</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Our servers only handle encrypted data:
                  </p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Store encrypted files and metadata</li>
                    <li>Manage user authentication (passwords are hashed)</li>
                    <li>Route encrypted data between clients</li>
                    <li>Never access or store encryption keys</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2.3 Key Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Users are responsible for their encryption keys. Keys are stored locally in the browser's 
                    secure storage (IndexedDB) and can be exported for backup. If a key is lost, data cannot 
                    be recovered - this is by design to ensure true zero-knowledge security.
                  </p>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Data Flow */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>3. Data Flow Security</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">3.1 File Upload Process</h3>
                  <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-1">
                    <li>User selects file in browser</li>
                    <li>File is read and encrypted client-side using user's key</li>
                    <li>Encrypted file is uploaded to server via HTTPS</li>
                    <li>Server stores encrypted file without decryption capability</li>
                    <li>Metadata (filename, size) is stored separately, also encrypted</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.2 File Download Process</h3>
                  <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-1">
                    <li>User requests file from server</li>
                    <li>Server sends encrypted file via HTTPS</li>
                    <li>Browser receives encrypted data</li>
                    <li>File is decrypted client-side using user's key</li>
                    <li>Decrypted file is made available to user</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.3 AI Chat Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat messages are encrypted before being sent to AI providers. The AI processes encrypted 
                    context and returns encrypted responses. Decryption only occurs in the user's browser, 
                    ensuring conversation privacy.
                  </p>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Additional Security */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>4. Additional Security Measures</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">4.1 Transport Security</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>TLS 1.3 for all data in transit</li>
                    <li>HSTS (HTTP Strict Transport Security) enabled</li>
                    <li>Certificate pinning for API endpoints</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4.2 Authentication Security</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Passwords hashed with bcrypt (cost factor 12)</li>
                    <li>Secure session management with httpOnly cookies</li>
                    <li>CSRF protection on all state-changing operations</li>
                    <li>Rate limiting to prevent brute force attacks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4.3 Infrastructure Security</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Regular security audits and penetration testing</li>
                    <li>Automated vulnerability scanning</li>
                    <li>Encrypted database backups</li>
                    <li>Access logging and monitoring</li>
                  </ul>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Threat Model */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>5. Threat Model</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">5.1 Protected Against</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Server compromise - encrypted data remains secure</li>
                    <li>Network eavesdropping - TLS protects data in transit</li>
                    <li>Database breach - all sensitive data is encrypted</li>
                    <li>Malicious insiders - no access to encryption keys</li>
                    <li>Legal compulsion - we cannot decrypt user data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5.2 User Responsibilities</h3>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Secure key backup and storage</li>
                    <li>Strong password selection</li>
                    <li>Device security (malware protection)</li>
                    <li>Physical security of devices with keys</li>
                  </ul>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Compliance */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>6. Compliance & Standards</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  PrivateVault.ai's security architecture aligns with industry standards and regulations:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>GDPR compliant - data minimization and user control</li>
                  <li>NIST cryptographic standards</li>
                  <li>OWASP security best practices</li>
                  <li>SOC 2 Type II principles</li>
                </ul>
              </ModernCardContent>
            </ModernCard>

            {/* Conclusion */}
            <ModernCard className="mb-8">
              <ModernCardHeader>
                <ModernCardTitle>7. Conclusion</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  PrivateVault.ai's security architecture is designed with privacy as the foundational principle. 
                  By implementing true end-to-end encryption and zero-knowledge architecture, we ensure that your 
                  data remains private and secure, even from us. Our commitment to transparency means we openly 
                  document our security practices and welcome scrutiny from the security community.
                </p>
              </ModernCardContent>
            </ModernCard>

            {/* Contact */}
            <ModernCard className="bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Questions or Security Concerns?
                </ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  We take security seriously. If you have questions about our security practices or wish to 
                  report a security vulnerability, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> chandan@privatevault.ai</p>
                  <p><strong>Phone:</strong> +91-9326176427</p>
                  <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                </div>
              </ModernCardContent>
            </ModernCard>

            {/* Footer */}
            <div className="text-center mt-12 text-sm text-muted-foreground">
              <p>© 2025 Pentaprime Solutions LLP - All Rights Reserved</p>
              <p className="mt-2">This whitepaper is for informational purposes and subject to updates.</p>
            </div>
          </div>
        </ModernContainer>
      </div>
    </PageTransition>
  );
}
