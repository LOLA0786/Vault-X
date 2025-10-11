import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author?: string;
  readTime: string;
  category: 'Security' | 'Updates' | 'Tutorial' | 'News' | 'Feature';
  image?: string;
  featured?: boolean;
}

interface BlogSectionProps {
  posts?: BlogPost[];
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  showReadMore?: boolean;
  className?: string;
  onReadMore?: (postId: string) => void;
}

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Secure Your AI Workflows in 2025',
    excerpt: 'Best practices for keeping your AI interactions private and secure with end-to-end encryption.',
    date: 'Oct 1, 2025',
    author: 'Security Team',
    readTime: '5 min read',
    category: 'Security',
    featured: true
  },
  {
    id: '2',
    title: 'New AI Agent Features Released',
    excerpt: 'Create custom AI assistants with advanced personalities and multi-language support.',
    date: 'Sep 28, 2025',
    author: 'Product Team',
    readTime: '3 min read',
    category: 'Updates'
  },
  {
    id: '3',
    title: 'Zero-Knowledge Architecture Explained',
    excerpt: 'Understanding how VaultX protects your data without ever seeing your content.',
    date: 'Sep 25, 2025',
    author: 'Engineering Team',
    readTime: '7 min read',
    category: 'Tutorial'
  },
  {
    id: '4',
    title: 'File Encryption Best Practices',
    excerpt: 'Learn how to maximize security when uploading sensitive documents to VaultX.',
    date: 'Sep 20, 2025',
    author: 'Security Team',
    readTime: '4 min read',
    category: 'Security'
  }
];

const categoryColors = {
  Security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Updates: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Tutorial: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  News: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Feature: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
};

export function BlogSection({ 
  posts = defaultPosts,
  variant = 'default',
  showReadMore = true,
  className = '',
  onReadMore
}: BlogSectionProps) {
  
  if (variant === 'compact') {
    return (
      <div className={cn("space-y-4", className)}>
        {posts.slice(0, 3).map((post) => (
          <div key={post.id} className="flex items-center space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="outline" className={categoryColors[post.category]}>
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {post.date}
                </span>
              </div>
              <h4 className="font-semibold text-sm hover:text-primary cursor-pointer">
                {post.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{post.readTime}</p>
            </div>
            {showReadMore && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onReadMore?.(post.id)}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'featured') {
    const featured = posts.find(p => p.featured) || posts[0];
    return (
      <Card className={cn("bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20", className)}>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className={categoryColors[featured.category]}>
              {featured.category}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {featured.readTime}
            </div>
          </div>
          <CardTitle className="text-xl">{featured.title}</CardTitle>
          <CardDescription className="text-base">{featured.excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {featured.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {featured.date}
              </div>
            </div>
            {showReadMore && (
              <Button 
                variant="outline"
                onClick={() => onReadMore?.(featured.id)}
              >
                Read More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={categoryColors[post.category]}>
                  {post.category}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer">
                {post.title}
              </CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {post.author && (
                    <div className="flex items-center mb-1">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {post.date}
                  </div>
                </div>
                {showReadMore && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onReadMore?.(post.id)}
                  >
                    Read More
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className={categoryColors[post.category]}>
                  {post.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {post.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime}
                </div>
              </div>
              {post.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>
            <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
              {post.title}
            </CardTitle>
            <CardDescription className="text-base">{post.excerpt}</CardDescription>
          </CardHeader>
          {(post.author || showReadMore) && (
            <CardContent>
              <div className="flex items-center justify-between">
                {post.author && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                )}
                {showReadMore && (
                  <Button 
                    variant="outline"
                    onClick={() => onReadMore?.(post.id)}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

// Quick news widget for sidebar or compact spaces
export function NewsWidget({ className }: { className?: string }) {
  const latestPosts = defaultPosts.slice(0, 3);
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Latest Updates</CardTitle>
        <CardDescription>Stay informed about VaultX</CardDescription>
      </CardHeader>
      <CardContent>
        <BlogSection 
          posts={latestPosts}
          variant="compact"
          showReadMore={false}
        />
      </CardContent>
    </Card>
  );
}

export default BlogSection;