'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash, 
  Eye,
  FileBox 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { productApi } from '@/lib/api/products';
import { ProductCategoryLabel, ProductStatus } from '@/lib/types/product';
import { format } from 'date-fns';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => productApi.getAll({ search, limit: 100 }), // Simple client-side search/limit for now
  });

  const products = data?.data?.products || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center py-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      {product.sku && <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{ProductCategoryLabel[product.category]}</TableCell>
                  <TableCell>
                    <Badge variant={
                      product.status === ProductStatus.ACTIVE ? 'default' : 
                      product.status === ProductStatus.DRAFT ? 'secondary' : 'outline'
                    }>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.showPrice && product.basePrice 
                      ? `₹${product.basePrice.toLocaleString()}` 
                      : <span className="text-muted-foreground text-xs font-italic">Hidden</span>
                    }
                  </TableCell>
                  <TableCell>{format(new Date(product.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/products/${product.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                           </Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                           <Link href={`/products/${product.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" /> View Live
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text- destructive font-medium text-red-600">
                           <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
