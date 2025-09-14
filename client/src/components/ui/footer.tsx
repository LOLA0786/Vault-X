import { Link } from 'wouter';

interface FooterProps {
  currentPage?: 'privacy' | 'terms' | 'refund';
}

export function Footer({ currentPage }: FooterProps) {
  return (
    <footer className="relative border-t border-border bg-card mt-auto z-0">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-6">
          {/* Legal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm">
            <Link 
              href="/terms-conditions" 
              className={`relative z-10 cursor-pointer hover:text-primary transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 ${
                currentPage === 'terms' ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Terms & Conditions
            </Link>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <Link 
              href="/privacy-policy" 
              className={`relative z-10 cursor-pointer hover:text-primary transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 ${
                currentPage === 'privacy' ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <Link 
              href="/refund-policy" 
              className={`relative z-10 cursor-pointer hover:text-primary transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 ${
                currentPage === 'refund' ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              Refund & Cancellation Policy
            </Link>
          </div>
          
          {/* Company Info */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              © {new Date().getFullYear()} Pentaprime Solutions LLP. All rights reserved.
            </p>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a href="mailto:chandan@privatevault.ai" className="hover:text-primary transition-colors">
                    chandan@privatevault.ai
                  </a>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Phone:</span>
                  <a href="tel:+919326176427" className="hover:text-primary transition-colors">
                    +91-9326176427
                  </a>
                </div>
              </div>
             
            </div>
            <p className="text-xs text-muted-foreground">
              🔐 Secure AI-powered file storage with client-side encryption
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
