'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Phone,
  Mail,
  UserPlus,
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

import { leadApi } from '@/lib/api/leads';
import { LeadStatus, LeadPriority, LeadSource } from '@/lib/types/lead';

const StatusColorMap: Record<string, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
  [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800',
  [LeadStatus.QUALIFIED]: 'bg-indigo-100 text-indigo-800',
  [LeadStatus.PROPOSAL_SENT]: 'bg-purple-100 text-purple-800',
  [LeadStatus.NEGOTIATION]: 'bg-pink-100 text-pink-800',
  [LeadStatus.WON]: 'bg-green-100 text-green-800',
  [LeadStatus.LOST]: 'bg-red-100 text-red-800',
  [LeadStatus.NURTURING]: 'bg-gray-100 text-gray-800',
};

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['leads', search, statusFilter],
    queryFn: () => leadApi.getAll({ 
      search, 
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      limit: 50 
    }),
  });

  const leads = data?.data?.leads || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Lead Management</h2>
        <Button>
           <UserPlus className="mr-2 h-4 w-4" /> Add Lead
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads..." 
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Filter className="h-4 w-4 text-muted-foreground" />
           <Select 
              value={statusFilter} 
              onValueChange={(val) => setStatusFilter(val as LeadStatus | 'ALL')}
           >
              <SelectTrigger className="w-[180px]">
                 <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="ALL">All Statuses</SelectItem>
                 {Object.values(LeadStatus).map((status) => (
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
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading leads...
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                     <div className="flex flex-col">
                        <span>{lead.firstName} {lead.lastName}</span>
                        <span className="text-xs text-muted-foreground">{lead.email}</span>
                     </div>
                  </TableCell>
                  <TableCell>{lead.company || '--'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={StatusColorMap[lead.status]}>
                      {lead.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{lead.source?.replace('_', ' ') || 'N/A'}</TableCell>
                  <TableCell>
                     <Badge variant={lead.priority === 'URGENT' ? 'destructive' : 'secondary'}>
                        {lead.priority}
                     </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(lead.updatedAt), 'MMM d, yyyy')}</TableCell>
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
                           <Link href={`/dashboard/leads/${lead.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Phone className="mr-2 h-4 w-4" /> Log Call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Mail className="mr-2 h-4 w-4" /> Send Email
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
