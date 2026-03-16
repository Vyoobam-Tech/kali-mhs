'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft, Mail, Phone, Calendar, Loader2, MessageSquare, Briefcase, MapPin } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

import { leadApi } from '@/lib/api/leads';
import { LeadStatus, ActivityType } from '@/lib/types/lead';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['lead', params.id],
    queryFn: () => leadApi.getOne(params.id),
  });

  const lead = data?.data?.lead;

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => leadApi.update(params.id, { status: status as LeadStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', params.id] });
      toast.success('Status updated successfully');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const addActivityMutation = useMutation({
    mutationFn: (newActivity: any) => leadApi.addActivity(params.id, newActivity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', params.id] });
      setNote('');
      toast.success('Activity logged');
    },
    onError: () => toast.error('Failed to log activity'),
  });

  const handleAddNote = () => {
    if (!note.trim()) return;
    addActivityMutation.mutate({
       type: ActivityType.NOTE,
       subject: 'Note added manually',
       description: note,
    });
  };

  if (isLoading) {
     return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!lead) {
     return <div>Lead not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/leads">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
           <h2 className="text-3xl font-bold tracking-tight">{lead.firstName} {lead.lastName}</h2>
           <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span className="text-xs">{lead.source}</span>
              <span>•</span>
              <span className="text-xs">Created {format(new Date(lead.createdAt), 'PPP')}</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <Select 
              defaultValue={lead.status} 
              onValueChange={(val) => updateStatusMutation.mutate(val)}
              disabled={updateStatusMutation.isPending}
           >
              <SelectTrigger className="w-[180px]">
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 {Object.values(LeadStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                       {status.replace('_', ' ')}
                    </SelectItem>
                 ))}
              </SelectContent>
           </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Left Col: Info */}
         <div className="space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Contact Info</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {lead.firstName[0]}{lead.lastName[0]}
                     </div>
                     <div>
                        <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                        <div className="text-sm text-muted-foreground">{lead.designation || 'N/A'}</div>
                     </div>
                  </div>
                  <Separator />
                  <div className="space-y-3 text-sm">
                     <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${lead.email}`} className="hover:underline text-blue-600">{lead.email}</a>
                     </div>
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone || 'N/A'}</a>
                     </div>
                     {lead.company && (
                        <div className="flex items-center gap-2">
                           <Briefcase className="h-4 w-4 text-muted-foreground" />
                           <span>{lead.company}</span>
                        </div>
                     )}
                     {(lead.city || lead.country) && (
                        <div className="flex items-center gap-2">
                           <MapPin className="h-4 w-4 text-muted-foreground" />
                           <span>{lead.city}, {lead.country}</span>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

             <Card>
               <CardHeader>
                  <CardTitle>Requirements</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  {lead.interestedProducts && lead.interestedProducts.length > 0 && (
                     <div>
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Interested Products</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {lead.interestedProducts.map((prod, i) => (
                              <Badge key={i} variant="secondary">{prod}</Badge>
                           ))}
                        </div>
                     </div>
                  )}
                  {lead.projectDetails && (
                     <div>
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Project Details</span>
                        <p className="text-sm mt-1">{lead.projectDetails}</p>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>

         {/* Right Col: Activity & Notes */}
         <div className="md:col-span-2 space-y-6">
            <Card>
               <CardHeader>
                  <CardTitle>Activity History</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     {/* Add Note Input */}
                     <div className="flex gap-2 mb-6">
                        <Textarea 
                           placeholder="Add a note or log activity..." 
                           value={note}
                           onChange={(e) => setNote(e.target.value)}
                           className="resize-none"
                        />
                        <Button 
                           onClick={handleAddNote} 
                           disabled={!note.trim() || addActivityMutation.isPending}
                           className="self-end"
                        >
                           {addActivityMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log'}
                        </Button>
                     </div>
                     
                     {/* Timeline */}
                     <div className="space-y-8 pl-2">
                        {lead.activities?.length === 0 ? (
                           <p className="text-center text-muted-foreground py-4">No activity logged yet.</p>
                        ) : (
                           (lead.activities || []).map((activity, idx) => ( // Reverse order handled by backend ideally
                              <div key={idx} className="relative pl-8 border-l last:border-0 pb-6">
                                 <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                                 <div className="mb-1 flex items-center justify-between">
                                    <span className="text-sm font-semibold">{activity.subject}</span>
                                    <span className="text-xs text-muted-foreground">
                                       {format(new Date(activity.performedAt), 'MMM d, h:mm a')}
                                    </span>
                                 </div>
                                 <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                                 <Badge variant="outline" className="text-[10px] h-5">{activity.type}</Badge>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
