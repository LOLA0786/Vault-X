import { useState } from 'react';
import { useLocation } from 'wouter';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer } from '@/components/ui/modern-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/ui/page-transition';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { Search, HelpCircle, Lock, CreditCard, FileText, Settings, MessageSquare, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HelpCenter() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: Lock,
      title: 'Security & Encryption',
      description: 'Learn about our security features',
      color: 'text-green-600'
    },
    {
      icon: CreditCard,
      title: 'Billing & Subscriptions',
      description: 'Manage your subscription',
      color: 'text-blue-600'
    },
    {
      icon: FileText,
      title: 'File Management',
      description: 'Upload and organize files',
      color: 'text-purple-600'
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Customize your account',
      color: 'text-orange-600'
    }
  ];

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click the "Get Started" button on the homepage, enter your email and password, and follow the encryption key setup process. Your account will be created instantly.'
        },
        {
          q: 'What is the encryption key?',
          a: 'Your encryption key is a unique cryptographic key that encrypts all your data. It\'s generated on your device and never sent to our servers, ensuring only you can access your files.'
        },
        {
          q: 'How do I backup my encryption key?',
          a: 'Go to Settings > Key Management and click "Export Key". Save the downloaded file in a secure location. You\'ll need this key to access your data if you lose access to your device.'
        }
      ]
    },
    {
      category: 'Subscriptions & Billing',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, and UPI payments through Razorpay. All payments are processed securely.'
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Yes, you can cancel your subscription at any time from the Settings page. You\'ll continue to have access until the end of your billing period.'
        },
        {
          q: 'What happens to my data if I cancel?',
          a: 'Your data remains encrypted and stored. You can still access it with the free tier limitations. To regain full access, simply resubscribe.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, contact support for a full refund within 30 days of purchase.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          q: 'How secure is my data?',
          a: 'Your data is encrypted end-to-end using AES-256 encryption. The encryption key never leaves your device, so even we cannot access your files.'
        },
        {
          q: 'What if I lose my encryption key?',
          a: 'Unfortunately, if you lose your encryption key, your data cannot be recovered. This is by design to ensure maximum security. Always keep a backup of your key in a safe place.'
        },
        {
          q: 'Do you share my data with third parties?',
          a: 'No, we never share your data with third parties. Your encrypted data is stored securely on our servers, but only you have the key to decrypt it.'
        },
        {
          q: 'Is my data encrypted during upload?',
          a: 'Yes, files are encrypted on your device before being uploaded. They remain encrypted during transit and at rest on our servers.'
        }
      ]
    },
    {
      category: 'File Management',
      questions: [
        {
          q: 'What file types can I upload?',
          a: 'You can upload any file type. There are no restrictions on file formats.'
        },
        {
          q: 'What are the file size limits?',
          a: 'File size limits depend on your plan: Starter (100MB), Personal (500MB), Pro (2GB), Enterprise (5GB).'
        },
        {
          q: 'How do I organize my files?',
          a: 'Use the Vault feature to organize files into folders. You can create, rename, and delete folders as needed.'
        },
        {
          q: 'Can I share files with others?',
          a: 'File sharing is coming soon! Currently, files are private to your account only.'
        }
      ]
    },
    {
      category: 'AI Features',
      questions: [
        {
          q: 'What can I do with AI chat?',
          a: 'Our AI chat can answer questions, help with tasks, analyze documents, and more. It has access to your encrypted files (with your permission) for context-aware assistance.'
        },
        {
          q: 'What are AI Agents?',
          a: 'AI Agents are specialized assistants you can create for specific tasks. Each agent can have its own personality, knowledge base, and capabilities.'
        },
        {
          q: 'How many AI chats can I have?',
          a: 'Chat limits depend on your plan: Starter (200/month), Personal (800/month), Pro (3,000/month), Enterprise (10,000/month).'
        }
      ]
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          faq =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => setLocation('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <PrivateVaultLogo size="sm" />
            </button>
            <Button onClick={() => setLocation('/')} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </header>

        <ModernContainer className="py-12">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Help Center
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Find answers to common questions and learn how to get the most out of PrivateVault.ai
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
            </div>

            {/* Categories */}
            {!searchQuery && (
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {categories.map((category, index) => (
                  <ModernCard key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <ModernCardHeader>
                      <ModernCardTitle className="flex items-center gap-3">
                        <category.icon className={`h-6 w-6 ${category.color}`} />
                        {category.title}
                      </ModernCardTitle>
                      <ModernCardDescription>
                        {category.description}
                      </ModernCardDescription>
                    </ModernCardHeader>
                  </ModernCard>
                ))}
              </div>
            )}

            {/* FAQs */}
            <div className="space-y-8">
              {filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                  <ModernCard>
                    <ModernCardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                            <AccordionTrigger className="px-6 hover:no-underline">
                              <span className="text-left font-medium">{faq.q}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 text-muted-foreground">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ModernCardContent>
                  </ModernCard>
                </div>
              ))}
            </div>

            {/* Still Need Help */}
            <ModernCard className="mt-12 bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
              <ModernCardHeader className="text-center">
                <ModernCardTitle className="flex items-center justify-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Still Need Help?
                </ModernCardTitle>
                <ModernCardDescription>
                  Can't find what you're looking for? Our support team is here to help.
                </ModernCardDescription>
              </ModernCardHeader>
              <ModernCardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setLocation('/contact')} variant="default">
                  Contact Support
                </Button>
              </ModernCardContent>
            </ModernCard>
          </div>
        </ModernContainer>
      </div>
    </PageTransition>
  );
}
