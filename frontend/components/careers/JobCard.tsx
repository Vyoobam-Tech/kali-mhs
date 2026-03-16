'use client';

import Link from 'next/link';
import { Job } from '@/lib/types/career';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
   job: Job;
}

export function JobCard({ job }: JobCardProps) {
   return (
      <Card className="flex flex-col group hover:border-primary/50 transition-colors">
         <CardHeader>
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
               </div>
               {job.status === 'PUBLISHED' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Applying</Badge>
               )}
            </div>
         </CardHeader>

         <CardContent className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
               <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.jobType.replace('_', ' ')}
               </div>
               <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location?.city || job.locationType}
               </div>
               <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.experienceLevel}
               </div>
            </div>

            {job.description && (
               <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.description}
               </p>
            )}
         </CardContent>

         <CardFooter className="flex gap-2">
            <Button className="flex-1" asChild>
               <Link href={`/careers/${job.id}/apply`}>
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
               <Link href={`/careers/${job.slug}`} title="View Details">
                  <Briefcase className="h-4 w-4" />
               </Link>
            </Button>
         </CardFooter>
      </Card>
   );
}
