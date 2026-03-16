'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  FileText,
  Filter
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { rfqApi } from '@/lib/api/rfq';
import { RFQStatus, RFQPriority } from '@/lib/types/rfq';

const StatusBadgeMap: Record<string, string> = {
  [RFQStatus.DRAFT]: 'bg-gray-200 text-gray-800',
  [RFQStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
  [RFQStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
  [RFQStatus.QUOTED]: 'bg-purple-100 text-purple-800',
  [RFQStatus.ACCEPTED]: 'bg-green-100 text-green-800',
  [RFQStatus.REJECTED]: 'bg-red-100 text-red-800',
  [RFQStatus.EXPIRED]: 'bg-gray-100 text-gray-600',
};

export default function AdminRFQsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RFQStatus | 'ALL'>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-rfqs', search, statusFilter],
    queryFn: () => rfqApi.getAll({ 
      search, 
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      limit: 50 
    }),
  });

  const rfqs = data?.data?.rfqs || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">RFQ Management</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by customer, company..." 
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Filter className="h-4 w-4 text-muted-foreground" />
           <Select 
              value={statusFilter} 
              onValueChange={(val) => setStatusFilter(val as RFQStatus | 'ALL')}
           >
              <SelectTrigger className="w-[180px]">
                 <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="ALL">All Statuses</SelectItem>
                 {Object.values(RFQStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                       {status.replace('_', ' ')}
                    </SelectItem>
                 ))}
              </SelectContent>
           </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : rfqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No RFQs found.
                </TableCell>
              </TableRow>
            ) : (
              rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">
                     {rfq.rfqNumber || '---'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{rfq.contact.firstName} {rfq.contact.lastName}</span>
                      <span className="text-xs text-muted-foreground">{rfq.contact.company || rfq.contact.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     {rfq.project.projectName || 'Untitled Project'}
                     <div className="text-xs text-muted-foreground">{rfq.project.projectType}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={StatusBadgeMap[rfq.status]}>
                      {rfq.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge variant={rfq.priority === RFQPriority.URGENT ? 'destructive' : 'secondary'}>
                        {rfq.priority}
                     </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(rfq.createdAt), 'MMM d, yyyy')}</TableCell>
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
                           <Link href={`/dashboard/rfq/${rfq.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                           </Link>
                        </DropdownMenuItem>
                        {/* Future: Generate Quote PDF */}
                        <DropdownMenuItem disabled>
                           <FileText className="mr-2 h-4 w-4" /> Generate Quote
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
