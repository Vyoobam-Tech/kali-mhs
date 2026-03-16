'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { careerApi } from '@/lib/api/careers';
import { cmsApi } from '@/lib/api/cms';
import { JobStatus } from '@/lib/types/career';
import { JobCard } from '@/components/careers/JobCard';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function CareersPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState<string | undefined>(undefined);

  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'careers-page'],
    queryFn: () => cmsApi.getBySlug('careers-page'),
  });

  const cms = (() => {
    try {
      const raw = cmsData?.data?.page?.content;
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const { data, isLoading } = useQuery({
    queryKey: ['public-careers', search, department],
    queryFn: () => careerApi.getAll({
      search: search || undefined,
      department: department === 'ALL' ? undefined : department,
      status: JobStatus.PUBLISHED,
      limit: 50,
    }),
  });

  const jobs = data?.data?.jobs || [];

  const hero = cms?.hero ?? { title: 'Join Our Team', subtitle: 'We are always looking for talented individuals to help us build the future of material handling.' };
  const filters = cms?.filters ?? { searchPlaceholder: 'Search by role or keyword...', departmentLabel: 'Department', departments: ['All Departments', 'Sales', 'Engineering', 'Operations', 'Marketing', 'HR'] };
  const emptyState = cms?.emptyState ?? { heading: 'No open positions found.', subheading: 'Check back later or submit a general application.' };

  const departments = filters.departments ?? [];

  return (
    <div className="min-h-screen">
      <HeroBanner title={hero.title} subtitle={hero.subtitle} variant="page" />

      <div className="container py-16">
        <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={filters.searchPlaceholder}
              className="pl-9 h-12 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select onValueChange={(val) => setDepartment(val)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder={filters.departmentLabel} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept: string) => (
                  <SelectItem key={dept} value={dept === (departments[0] ?? 'All Departments') ? 'ALL' : dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[200px] w-full rounded-xl" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl">
            <h3 className="text-lg font-semibold text-muted-foreground">{emptyState.heading}</h3>
            <p className="text-sm text-muted-foreground mt-2">{emptyState.subheading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
}
