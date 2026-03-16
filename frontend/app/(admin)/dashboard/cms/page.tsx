'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Eye, 
  Plus,
  FileText
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { cmsApi } from '@/lib/api/cms';
import { ContentStatus, PageType } from '@/lib/types/cms';

const StatusColorMap: Record<string, string> = {
  [ContentStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [ContentStatus.PUBLISHED]: 'bg-green-100 text-green-800',
  [ContentStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
  [ContentStatus.ARCHIVED]: 'bg-red-100 text-red-800',
};

export default function CMSPage() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['cms-pages', search],
    queryFn: () => cmsApi.getAll({ search, limit: 100 }),
  });

  const pages = data?.data?.pages || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
        <Button asChild>
          <Link href="/dashboard/cms/new">
            <Plus className="mr-2 h-4 w-4" /> Create Page
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center py-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search pages..." 
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
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading pages...
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No pages found.
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">
                     <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {page.title}
                     </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {page.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={StatusColorMap[page.status]}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">/{page.slug}</TableCell>
                  <TableCell>{format(new Date(page.updatedAt), 'MMM d, yyyy')}</TableCell>
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
                        <DropdownMenuItem asChild>
                           <Link href={`/dashboard/cms/${page.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href={`/${page.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" /> View Live
                           </Link>
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
