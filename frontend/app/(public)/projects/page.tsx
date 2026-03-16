'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '@/lib/api/projects';
import { ProjectCategory, ProjectStatus } from '@/lib/types/project';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | undefined>(undefined);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['public-projects', selectedCategory, search],
    queryFn: () => projectApi.getAll({ 
      category: selectedCategory, 
      search: search || undefined,
      status: ProjectStatus.PUBLISHED, // Only show published projects
      limit: 50 
    }),
  });

  const projects = data?.data?.projects || [];
  const categories = Object.keys(ProjectCategory) as ProjectCategory[];

  return (
    <div className="container py-16">
      <div className="flex flex-col items-center text-center mb-12">
         <h1 className="text-4xl font-bold tracking-tight mb-4">Our Projects</h1>
         <p className="text-xl text-muted-foreground max-w-2xl">
            Explore our portfolio of successful installations across residential, commercial, and industrial sectors.
         </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
           variant={selectedCategory === undefined ? 'default' : 'outline'}
           className="rounded-full"
           onClick={() => setSelectedCategory(undefined)}
        >
           All Projects
        </Button>
        {categories.map((category) => (
           <Button
             key={category}
             variant={selectedCategory === category ? 'default' : 'outline'}
             className="rounded-full"
             onClick={() => setSelectedCategory(category)}
           >
             {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
           </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative">
         <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
         <Input 
            placeholder="Search projects..." 
            className="pl-9 rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                 <Skeleton className="h-[250px] w-full rounded-xl" />
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
              </div>
           ))}
        </div>
      ) : projects.length === 0 ? (
         <div className="text-center py-20 bg-muted/30 rounded-xl">
            <h3 className="text-lg font-semibold text-muted-foreground">No projects found.</h3>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
           ))}
        </div>
      )}
    </div>
  );
}
