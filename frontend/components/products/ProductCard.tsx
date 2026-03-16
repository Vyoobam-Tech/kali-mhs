'use client';

import Link from 'next/link';
import { Product, ProductCategoryLabel } from '@/lib/types/product';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:border-primary/50 transition-colors">
      <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images.find(img => img.isPrimary)?.url || product.images[0].url} 
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center">
             <FileText className="h-12 w-12 mb-2 opacity-20" />
             <span className="text-xs text-muted-foreground/50">No Image</span>
          </div>
        )}
        
        {/* Status Badge (if new or featured, etc. - simplified for now) */}
        {/* <Badge className="absolute top-2 right-2">New</Badge> */}
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="mb-2">
            <Badge variant="outline" className="text-xs font-normal">
              {ProductCategoryLabel[product.category]}
            </Badge>
        </div>
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
        </h3>
      </CardHeader>
      
      <CardContent className="p-4 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.shortDescription || 'No description available for this product.'}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-medium">
           {product.showPrice && product.basePrice ? (
             <span>₹{product.basePrice.toLocaleString()}</span>
           ) : (
             <span className="text-sm text-muted-foreground">RFQ Only</span>
           )}
        </div>
        
        <Button size="sm" variant="ghost" className="gap-2" asChild>
           <Link href={`/products/${product.slug}`}>
             View <Eye className="h-4 w-4" />
           </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
