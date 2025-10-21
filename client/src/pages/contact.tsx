import { useState } from 'react';
import { useLocation } from 'wouter';
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from '@/components/ui/modern-card';
import { ModernContainer } from '@/components/ui/modern-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageTransition } from '@/components/ui/page-transition';
import { PrivateVaultLogo } from '@/components/ui/private-vault-logo';
import { Mail, Phone, MapPin, Send, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <ModernCard>
                  <ModernCardHeader>
                    <ModernCardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Email Us
                    </ModernCardTitle>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      For general inquiries and support
                    </p>
                    <a href="mailto:chandan@privatevault.ai" className="text-primary hover:underline">
                      chandan@privatevault.ai
                    </a>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard>
                  <ModernCardHeader>
                    <ModernCardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Phone Support
                    </ModernCardTitle>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Mon-Fri, 9:00 AM - 6:00 PM IST
                    </p>
                    <a href="tel:+919326176427" className="text-primary hover:underline">
                      +91-9326176427
                    </a>
                  </ModernCardContent>
                </ModernCard>

                <ModernCard>
                  <ModernCardHeader>
                    <ModernCardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Office Address
                    </ModernCardTitle>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <p className="text-sm text-muted-foreground font-medium mb-2">
                      Pentaprime Solutions LLP
                    </p>
                    <p className="text-sm text-muted-foreground">
                      D Wing 705, Ganga Estate<br />
                      Behind Atur Park<br />
                      Sion Trombay Road<br />
                      Chembur East, Mumbai 400071<br />
                      Maharashtra, India
                    </p>
                  </ModernCardContent>
                </ModernCard>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <ModernCard>
                  <ModernCardHeader>
                    <ModernCardTitle>Send us a Message</ModernCardTitle>
                    <ModernCardDescription>
                      Fill out the form below and we'll get back to you within 24 hours
                    </ModernCardDescription>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </ModernCardContent>
                </ModernCard>
              </div>
            </div>
          </div>
        </ModernContainer>
      </div>
    </PageTransition>
  );
}
