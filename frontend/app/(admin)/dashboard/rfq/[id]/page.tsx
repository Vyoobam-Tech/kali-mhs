'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft, Mail, Phone, MapPin, Building, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { rfqApi } from '@/lib/api/rfq';
import { RFQStatus } from '@/lib/types/rfq';

export default function AdminRFQDetailPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['rfq', params.id],
    queryFn: () => rfqApi.getOne(params.id),
  });

  const rfq = data?.data?.rfq;

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => rfqApi.updateStatus(params.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfq', params.id] });
      toast.success('Status updated successfully');
    },
    onError: (error) => {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    }
  });

  if (isLoading) {
     return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!rfq) {
     return <div>RFQ not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/rfq">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
           <h2 className="text-3xl font-bold tracking-tight">RFQ {rfq.rfqNumber}</h2>
           <p className="text-muted-foreground">
              Submitted on {format(new Date(rfq.createdAt), 'PPP')}
           </p>
        </div>
        <div className="flex items-center gap-2">
           <Select 
              defaultValue={rfq.status} 
              onValueChange={(val) => updateStatusMutation.mutate(val)}
              disabled={updateStatusMutation.isPending}
           >
              <SelectTrigger className="w-[180px]">
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 {Object.values(RFQStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                       {status.replace('_', ' ')}
                    </SelectItem>
                 ))}
              </SelectContent>
           </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Main Content: Items */}
         <div className="md:col-span-2 space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Requested Items</CardTitle>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Product</TableHead>
                           <TableHead>Category</TableHead>
                           <TableHead className="text-right">Quantity</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {rfq.items.map((item, idx) => (
                           <TableRow key={idx}>
                              <TableCell>
                                 <div className="font-medium">{item.productName}</div>
                                 {item.notes && <div className="text-xs text-muted-foreground mt-1">Note: {item.notes}</div>}
                              </TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                 {item.quantity} {item.unit}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Project Details</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <div className="text-sm font-medium text-muted-foreground">Project Name</div>
                        <div>{rfq.project.projectName || 'N/A'}</div>
                     </div>
                     <div>
                        <div className="text-sm font-medium text-muted-foreground">Type</div>
                        <div>{rfq.project.projectType}</div>
                     </div>
                  </div>
                  <Separator />
                  <div>
                     <div className="text-sm font-medium text-muted-foreground mb-1">Description / Requirements</div>
                     <p className="text-sm whitespace-pre-wrap">
                        {rfq.project.description || rfq.notes || 'No additional details provided.'}
                     </p>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar: Customer Info */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {rfq.contact.firstName[0]}{rfq.contact.lastName[0]}
                     </div>
                     <div>
                        <div className="font-medium">{rfq.contact.firstName} {rfq.contact.lastName}</div>
                        <div className="text-sm text-muted-foreground">{rfq.contact.designation || 'Customer'}</div>
                     </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3 text-sm">
                     <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${rfq.contact.email}`} className="hover:underline">{rfq.contact.email}</a>
                     </div>
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${rfq.contact.phone}`} className="hover:underline">{rfq.contact.phone}</a>
                     </div>
                     {rfq.contact.company && (
                        <div className="flex items-center gap-2">
                           <Building className="h-4 w-4 text-muted-foreground" />
                           <span>{rfq.contact.company}</span>
                        </div>
                     )}
                     {(rfq.contact.city || rfq.contact.address) && (
                        <div className="flex items-start gap-2">
                           <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                           <span>
                              {rfq.contact.address && <div>{rfq.contact.address}</div>}
                              {rfq.contact.city && <span>{rfq.contact.city}</span>}
                           </span>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
            
            <Card>
               <CardHeader>
                   <CardTitle>Internal Notes</CardTitle>
               </CardHeader>
               <CardContent>
                   <p className="text-sm text-muted-foreground italic">
                       Internal notes functionality coming soon. 
                   </p>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
