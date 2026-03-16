'use client';

import { CMSPage } from '@/lib/types/cms';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DynamicPageClientProps {
  page: CMSPage;
}

export function DynamicPageClient({ page }: DynamicPageClientProps) {
  return (
    <div className="container py-16">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          {page.category && (
            <Badge variant="secondary" className="mb-4">
              {page.category}
            </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {page.title}
          </h1>
          
          {page.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">
              {page.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {page.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(page.publishedAt), 'MMMM d, yyyy')}
              </div>
            )}
            {page.tags && page.tags.length > 0 && (
              <div className="flex gap-2">
                {page.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {page.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={page.featuredImage} 
              alt={page.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content || '' }}
        />
      </article>
    </div>
  );
}
