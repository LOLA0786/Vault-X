import * as React from "react"
import { cn } from "@/lib/utils"
import { Shield, Heart, Lock, Globe, Github, Twitter, Mail } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"

interface ModernFooterProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}

export function ModernFooter({ className, variant = 'default' }: ModernFooterProps) {
  const currentYear = new Date().getFullYear()

  if (variant === 'minimal') {
    return (
      <footer className={cn(
        "border-t border-border/50 bg-background/80 backdrop-blur-xl",
        className
      )}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                © {currentYear} Private Vault. All rights reserved.
              </span>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Lock className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
          </div>
        </div>
      </footer>
    )
  }

  if (variant === 'detailed') {
    return (
      <footer className={cn(
        "border-t border-border/50 bg-gradient-to-b from-background to-muted/20",
        className
      )}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Private Vault
                  </h3>
                  <p className="text-xs text-muted-foreground">Secure AI Assistant</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your private, encrypted AI workspace with client-side security and zero-knowledge architecture.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Lock className="w-3 h-3 mr-1" />
                  AES-256
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <Globe className="w-3 h-3 mr-1" />
                  Zero-Knowledge
                </Badge>
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">AI Agents</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">File Vault</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-conditions" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</a></li>
              </ul>
              <div className="flex items-center space-x-2 pt-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Private Vault. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for privacy
              </span>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // Default variant
  return (
    <footer className={cn(
      "border-t border-border/50 bg-background/80 backdrop-blur-xl",
      className
    )}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Section - Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Private Vault
              </h3>
              <p className="text-sm text-muted-foreground">Your Secure AI Assistant</p>
            </div>
          </div>

          {/* Center Section - Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-conditions" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="/refund-policy" className="hover:text-foreground transition-colors">
              Refund Policy
            </a>
          </div>

          {/* Right Section - Security & Copyright */}
          <div className="flex flex-col items-center lg:items-end space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Lock className="w-3 h-3 mr-1" />
                AES-256 Encrypted
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              © {currentYear} Private Vault. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}