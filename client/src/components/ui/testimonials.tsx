import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
  rating: number;
  verified?: boolean;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
  variant?: 'default' | 'compact' | 'featured';
  showRating?: boolean;
  className?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Data Analyst',
    company: 'TechCorp',
    quote: 'VaultX keeps my sensitive data secure while making AI analysis effortless. The encryption gives me peace of mind.',
    rating: 5,
    verified: true
  },
  {
    id: '2', 
    name: 'Michael Chen',
    role: 'Security Engineer', 
    company: 'CyberShield Inc',
    quote: 'Finally, an AI platform I can trust with confidential documents. The zero-knowledge architecture is impressive.',
    rating: 5,
    verified: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'StartupXYZ',
    quote: 'Custom AI agents have transformed our workflow. We can now process documents 10x faster securely.',
    rating: 5,
    verified: true
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Legal Counsel',
    company: 'LawFirm Pro',
    quote: 'Client confidentiality is paramount. VaultX ensures our sensitive legal documents remain completely private.',
    rating: 5,
    verified: true
  }
];

export function Testimonials({ 
  testimonials = defaultTestimonials, 
  variant = 'default',
  showRating = true,
  className = ''
}: TestimonialsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-4 ${className}`}>
        {testimonials.slice(0, 2).map((testimonial) => (
          <div key={testimonial.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm italic">"{testimonial.quote}"</p>
              <p className="text-xs text-muted-foreground mt-1">
                - {testimonial.name}, {testimonial.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'featured') {
    const featured = testimonials[0];
    return (
      <Card className={`bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 ${className}`}>
        <CardContent className="p-8 text-center">
          <Quote className="w-12 h-12 text-primary/40 mx-auto mb-4" />
          <p className="text-lg italic mb-6">"{featured.quote}"</p>
          <div className="flex items-center justify-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={featured.avatar} alt={featured.name} />
              <AvatarFallback>{featured.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{featured.name}</p>
              <p className="text-sm text-muted-foreground">{featured.role} at {featured.company}</p>
              {showRating && (
                <div className="flex items-center space-x-1 mt-1">
                  {renderStars(featured.rating)}
                </div>
              )}
            </div>
          </div>
          {featured.verified && (
            <Badge variant="secondary" className="mt-4">
              ✓ Verified User
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                  {testimonial.verified && (
                    <Badge variant="outline" className="text-xs">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                {showRating && (
                  <div className="flex items-center space-x-1 mb-3">
                    {renderStars(testimonial.rating)}
                  </div>
                )}
                <p className="italic">"{testimonial.quote}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Testimonials;