'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, ProductCategoryLabel } from '@/lib/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { ChevronRight, Download, FileText, ShoppingCart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useRouter } from 'next/navigation';
import { useRFQStore } from '@/lib/store/rfqStore';
import { toast } from 'sonner';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useRFQStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || null
  );

  const handleAddToQuote = () => {
     addItem({
        id: product.id,
        productName: product.name,
        category: product.category,
        quantity: 1, // Default to 1
        unit: product.priceUnit || 'Units'
     });
     toast.success('Added to Quote', {
        description: `${product.name} has been added to your RFQ list.`,
        action: {
           label: 'View List',
           onClick: () => router.push('/rfq')
        }
     });
  };

  return (
    <div className="container py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Column: Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden border flex items-center justify-center relative">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="object-contain w-full h-full"
              />
            ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                    <FileText className="h-20 w-20 mb-4 opacity-20" />
                    <span>No Image Available</span>
                </div>
            )}
             {/* 3D Model Badge Placeholder */}
             {product.model3D && (
                 <Badge variant="secondary" className="absolute top-4 right-4 pointer-events-none">
                     3D Model Available
                 </Badge>
             )}
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`
                    relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0
                    ${selectedImage === img.url ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'}
                  `}
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img src={img.url} alt={img.alt || product.name} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <Badge>{ProductCategoryLabel[product.category]}</Badge>
               {product.status === 'ACTIVE' && <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-slate-100">
                {product.name}
            </h1>
            {product.sku && (
                <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>
            )}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          <Separator />

          <div>
             {product.showPrice && product.basePrice ? (
               <div className="flex items-baseline gap-2 mb-6">
                 <span className="text-3xl font-bold">₹{product.basePrice.toLocaleString()}</span>
                 {product.priceUnit && (
                    <span className="text-muted-foreground">/ {product.priceUnit}</span>
                 )}
               </div>
             ) : (
               <div className="mb-6">
                 <span className="text-xl font-medium text-primary">Request for Pricing</span>
                 <p className="text-sm text-muted-foreground mt-1">
                    Contact us for a custom quote based on your requirements.
                 </p>
               </div>
             )}

             <div className="flex flex-col sm:flex-row gap-4">
               <Button size="lg" className="flex-1 text-base">
                 <ShoppingCart className="mr-2 h-5 w-5" />
                 {product.showPrice ? 'Add to Quote' : 'Request Quote'}
               </Button>
               <Button size="lg" variant="outline" className="flex-1 text-base">
                 <Share2 className="mr-2 h-5 w-5" />
                 Share Product
               </Button>
             </div>
          </div>
          
          <Card className="bg-muted/50 border-none shadow-none">
             <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                      <span className="font-semibold block mb-1">Lead Time</span>
                      <span className="text-muted-foreground">3-5 Business Days</span>
                   </div>
                   <div>
                      <span className="font-semibold block mb-1">Warranty</span>
                      <span className="text-muted-foreground">5 Years Manufacturer</span>
                   </div>
                   <div>
                      <span className="font-semibold block mb-1">Min. Order</span>
                      <span className="text-muted-foreground">1 Unit / 100 Sq. Ft.</span>
                   </div>
                   <div>
                      <span className="font-semibold block mb-1">Certifications</span>
                      <span className="text-muted-foreground">ISO 9001:2015</span>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="specs" className="space-y-8">
        <TabsList className="w-full justify-start rounded-none border-b h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="specs" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger 
            value="desc"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Description
          </TabsTrigger>
          <TabsTrigger 
            value="docs"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            Documents & Downloads
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="specs" className="pt-6">
           <div className="max-w-3xl">
              <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
              {product.specifications && product.specifications.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      {product.specifications.map((spec, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium bg-muted/40 w-[200px]">{spec.name}</TableCell>
                          <TableCell>{spec.value} {spec.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
           </div>
        </TabsContent>
        
        <TabsContent value="desc" className="pt-6">
          <div className="prose dark:prose-invert max-w-4xl">
             <h3 className="text-lg font-semibold mb-4">Product Details</h3>
             {product.fullDescription ? (
               <div className="whitespace-pre-wrap leading-7">
                  {product.fullDescription}
               </div>
             ) : (
                <p className="text-muted-foreground">No detailed description available.</p>
             )}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="pt-6">
           <div className="max-w-3xl space-y-4">
              <h3 className="text-lg font-semibold mb-4">Downloads</h3>
              {product.documents && product.documents.length > 0 ? (
                 <div className="grid gap-4">
                    {product.documents.map((doc, idx) => (
                       <Card key={idx} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="flex items-center p-4">
                             <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 text-primary">
                                <FileText className="h-5 w-5" />
                             </div>
                             <div className="flex-1">
                                <h4 className="font-medium">{doc.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                   {doc.fileType} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                </p>
                             </div>
                             <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-2" /> Download
                             </Button>
                          </CardContent>
                       </Card>
                    ))}
                 </div>
              ) : (
                 <p className="text-muted-foreground">No documents available for download.</p>
              )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
