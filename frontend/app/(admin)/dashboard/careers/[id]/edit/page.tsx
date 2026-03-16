'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronRight, Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { careerApi } from '@/lib/api/careers';
import { JobStatus, JobType, JobLocationType, ExperienceLevel } from '@/lib/types/career';

// ── Schema ──────────────────────────────────────────────────────
const editJobSchema = z.object({
    title: z.string().min(3, 'Title required'),
    department: z.string().min(2, 'Department required'),
    jobType: z.nativeEnum(JobType),
    locationType: z.nativeEnum(JobLocationType),
    experienceLevel: z.nativeEnum(ExperienceLevel),
    status: z.nativeEnum(JobStatus),
    locationCity: z.string().optional(),
    locationState: z.string().optional(),
    locationCountry: z.string().optional(),
    description: z.string().optional(),
    responsibilities: z.string().optional(), // newline-joined
    requirements: z.string().optional(),
    niceToHave: z.string().optional(),
    benefits: z.string().optional(),
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
    salaryCurrency: z.string().optional(),
    showSalary: z.boolean().default(false),
    openings: z.coerce.number().min(1).default(1),
    applicationDeadline: z.string().optional(),
});

type EditJobFormData = z.infer<typeof editJobSchema>;
type EditJobFormInput = z.input<typeof editJobSchema>;

// ── Helpers ──────────────────────────────────────────────────────
const splitLines = (arr?: string[]) => arr?.join('\n') || '';
const joinLines = (str?: string) => str?.split('\n').map(s => s.trim()).filter(Boolean) || [];

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const jobId = params.id;
    const queryClient = useQueryClient();

    const { data: jobData, isLoading } = useQuery({
        queryKey: ['admin-job', jobId],
        queryFn: () => careerApi.getOne(jobId),
        enabled: !!jobId,
    });

    const job = jobData?.data?.job;

    const form = useForm<EditJobFormInput, any, EditJobFormData>({
        resolver: zodResolver(editJobSchema),
        defaultValues: { showSalary: false, openings: 1, status: JobStatus.DRAFT },
    });

    // Pre-fill form when job loads
    useEffect(() => {
        if (job) {
            form.reset({
                title: job.title,
                department: job.department,
                jobType: job.jobType,
                locationType: job.locationType,
                experienceLevel: job.experienceLevel,
                status: job.status,
                locationCity: job.location?.city || '',
                locationState: job.location?.state || '',
                locationCountry: job.location?.country || '',
                description: job.description || '',
                responsibilities: splitLines(job.responsibilities),
                requirements: splitLines(job.requirements),
                niceToHave: splitLines(job.niceToHave),
                benefits: splitLines(job.benefits),
                salaryMin: job.salaryRange?.min,
                salaryMax: job.salaryRange?.max,
                salaryCurrency: job.salaryRange?.currency || 'INR',
                showSalary: job.showSalary,
                openings: job.openings,
                applicationDeadline: job.applicationDeadline
                    ? job.applicationDeadline.split('T')[0]
                    : '',
            });
        }
    }, [job, form]);

    const updateMutation = useMutation({
        mutationFn: (data: EditJobFormData) => careerApi.update(jobId, {
            title: data.title,
            department: data.department,
            jobType: data.jobType,
            locationType: data.locationType,
            experienceLevel: data.experienceLevel,
            status: data.status,
            location: {
                city: data.locationCity,
                state: data.locationState,
                country: data.locationCountry,
            },
            description: data.description,
            responsibilities: joinLines(data.responsibilities),
            requirements: joinLines(data.requirements),
            niceToHave: joinLines(data.niceToHave),
            benefits: joinLines(data.benefits),
            salaryRange: data.salaryMin ? {
                min: data.salaryMin,
                max: data.salaryMax || data.salaryMin,
                currency: data.salaryCurrency || 'INR',
            } : undefined,
            showSalary: data.showSalary,
            openings: data.openings,
            applicationDeadline: data.applicationDeadline || undefined,
        }),
        onSuccess: () => {
            toast.success('Job updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin-careers'] });
            queryClient.invalidateQueries({ queryKey: ['admin-job', jobId] });
            router.push('/dashboard/careers');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update job');
        },
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-muted-foreground">Job not found.</p>
                <Button variant="outline" asChild><Link href="/dashboard/careers">Go Back</Link></Button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/careers" className="hover:underline">Careers</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">Edit: {job.title}</span>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Job Posting</h2>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Job Title *</FormLabel>
                                    <FormControl><Input placeholder="e.g. Senior React Developer" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="department" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department *</FormLabel>
                                    <FormControl><Input placeholder="e.g. Engineering" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="openings" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Openings</FormLabel>
                                    <FormControl><Input type="number" min={1} {...field} value={field.value as number} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="jobType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Type *</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(JobType).map(v => (
                                                <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Experience Level *</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(ExperienceLevel).map(v => (
                                                <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(JobStatus).map(v => (
                                                <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="applicationDeadline" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Deadline</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Location</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="locationType" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location Type *</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(JobLocationType).map(v => (
                                                <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="locationCity" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl><Input placeholder="e.g. Mumbai" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="locationState" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl><Input placeholder="e.g. Maharashtra" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="locationCountry" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl><Input placeholder="e.g. India" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Job Description</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} placeholder="Describe the role..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="responsibilities" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Responsibilities <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} placeholder="Design and implement..."  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="requirements" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Requirements <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} placeholder="5+ years of experience..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="niceToHave" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nice to Have <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} placeholder="Experience with cloud..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="benefits" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Benefits <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} placeholder="Health insurance, flexible hours..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Salary */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Compensation</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="salaryCurrency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <FormControl><Input placeholder="INR" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="salaryMin" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Salary (LPA)</FormLabel>
                                    <FormControl><Input type="number" placeholder="8" {...field} value={field.value as number} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="salaryMax" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Salary (LPA)</FormLabel>
                                    <FormControl><Input type="number" placeholder="15" {...field} value={field.value as number} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="showSalary" render={({ field }) => (
                                <FormItem className="flex items-center gap-3 md:col-span-3">
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Show salary range publicly</FormLabel>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/careers">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending} className="min-w-[140px]">
                            {updateMutation.isPending
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
