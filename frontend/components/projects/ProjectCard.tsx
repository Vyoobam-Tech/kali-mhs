'use client';

import Link from 'next/link';
import { Project, ProjectCategory } from '@/lib/types/project';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {project.featuredImage?.url ? (
          <img 
            src={project.featuredImage.url} 
            alt={project.featuredImage.alt || project.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
             No Image
          </div>
        )}
        <div className="absolute top-4 left-4">
           <Badge className="bg-white/90 text-black hover:bg-white">{project.category.replace('_', ' ')}</Badge>
        </div>
      </div>
      
      <CardContent className="flex-1 p-5 space-y-3">
        <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">
            {project.title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
           {project.location?.city && (
              <div className="flex items-center gap-1">
                 <MapPin className="h-3 w-3" />
                 {project.location.city}
              </div>
           )}
           {project.completionDate && (
              <div className="flex items-center gap-1">
                 <Calendar className="h-3 w-3" />
                 {format(new Date(project.completionDate), 'MMMM yyyy')}
              </div>
           )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.shortDescription || 'No description available for this project.'}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
           <Link href={`/projects/${project.slug}`}>
             View Project <ArrowRight className="ml-2 h-4 w-4" />
           </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
