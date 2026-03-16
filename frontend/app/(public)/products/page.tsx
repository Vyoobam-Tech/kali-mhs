'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api/products';
import { ProductCategory, ProductCategoryLabel, ProductStatus } from '@/lib/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | undefined>(undefined);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['public-products', selectedCategory, search],
    queryFn: () => productApi.getAll({ 
      category: selectedCategory, 
      search: search || undefined,
      status: ProductStatus.ACTIVE, // Only show active products to public
      limit: 50 
    }),
  });

  const products = data?.data?.products || [];

  const categories = Object.keys(ProductCategory) as ProductCategory[];

  const resetFilters = () => {
    setSelectedCategory(undefined);
    setSearch('');
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 space-y-6">
          <div>
             <h3 className="font-semibold text-lg mb-4">Categories</h3>
             <ScrollArea className="h-[calc(100vh-200px)]">
               <div className="space-y-2 pr-4">
                 <Button
                   variant={selectedCategory === undefined ? 'secondary' : 'ghost'}
                   className="w-full justify-start font-normal"
                   onClick={() => setSelectedCategory(undefined)}
                 >
                   All Categories
                 </Button>
                 {categories.map((category) => (
                   <Button
                     key={category}
                     variant={selectedCategory === category ? 'secondary' : 'ghost'}
                     className="w-full justify-start font-normal truncate"
                     onClick={() => setSelectedCategory(category)}
                     title={ProductCategoryLabel[category]}
                   >
                     {ProductCategoryLabel[category]}
                   </Button>
                 ))}
               </div>
             </ScrollArea>
          </div>
        </div>

        {/* Mobile Filter Sheet & Main Content */}
        <div className="flex-1 space-y-6">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-[250px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search..." 
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                 </div>
                 
                 {/* Mobile Filter Button */}
                 <Sheet>
                   <SheetTrigger asChild>
                     <Button variant="outline" size="icon" className="md:hidden">
                       <Filter className="h-4 w-4" />
                     </Button>
                   </SheetTrigger>
                   <SheetContent side="left">
                     <SheetHeader>
                       <SheetTitle>Categories</SheetTitle>
                       <SheetDescription>Filter products by category</SheetDescription>
                     </SheetHeader>
                     <ScrollArea className="h-[calc(100vh-150px)] mt-4">
                       <div className="space-y-2">
                         <Button
                           variant={selectedCategory === undefined ? 'secondary' : 'ghost'}
                           className="w-full justify-start"
                           onClick={() => setSelectedCategory(undefined)}
                         >
                           All Categories
                         </Button>
                         {categories.map((category) => (
                           <Button
                             key={category}
                             variant={selectedCategory === category ? 'secondary' : 'ghost'}
                             className="w-full justify-start"
                             onClick={() => setSelectedCategory(category)}
                           >
                              {ProductCategoryLabel[category]}
                           </Button>
                         ))}
                       </div>
                     </ScrollArea>
                   </SheetContent>
                 </Sheet>
              </div>
           </div>

           {/* Active Filters Display */}
           {(selectedCategory || search) && (
              <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground">Active filters:</span>
                 {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {ProductCategoryLabel[selectedCategory]}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(undefined)} />
                    </Badge>
                 )}
                 {search && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {search}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch('')} />
                    </Badge>
                 )}
                 <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                   Clear all
                 </Button>
              </div>
           )}

           {/* Product Grid */}
           {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                   <div key={i} className="space-y-4">
                      <Skeleton className="h-[250px] w-full rounded-xl" />
                      <div className="space-y-2">
                         <Skeleton className="h-4 w-[250px]" />
                         <Skeleton className="h-4 w-[200px]" />
                      </div>
                   </div>
                ))}
             </div>
           ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-muted/20">
                 <h3 className="text-lg font-semibold mt-4">No products found</h3>
                 <p className="text-muted-foreground mt-2 max-w-sm">
                    {search || selectedCategory 
                      ? "Try adjusting your search or filters to find what you're looking for." 
                      : "We are currently updating our catalog. Please check back later."}
                 </p>
                 <Button variant="link" onClick={resetFilters} className="mt-4">
                    Clear Filters
                 </Button>
              </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                   <ProductCard key={product.id} product={product} />
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
