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

import { projectApi } from '@/lib/api/projects';
import { ProjectCategory, ProjectStatus } from '@/lib/types/project';

const projectSchema = z.object({
    title: z.string().min(3, 'Title required'),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
    category: z.nativeEnum(ProjectCategory),
    status: z.nativeEnum(ProjectStatus),
    shortDescription: z.string().optional(),
    fullDescription: z.string().optional(),
    clientName: z.string().optional(),
    clientCompany: z.string().optional(),
    locationCity: z.string().optional(),
    locationState: z.string().optional(),
    locationCountry: z.string().optional(),
    startDate: z.string().optional(),
    completionDate: z.string().optional(),
    projectSize: z.string().optional(),
    keyFeatures: z.string().optional(),
    isFeatured: z.boolean().default(false),
    displayOnHomepage: z.boolean().default(false),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const joinLines = (arr?: string[]) => arr?.join('\n') || '';
const splitLines = (str?: string) => str?.split('\n').map(s => s.trim()).filter(Boolean) || [];

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const projectId = params.id;
    const queryClient = useQueryClient();

    const { data: projectData, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => projectApi.getOne(projectId),
        enabled: !!projectId,
    });

    const project = projectData?.data?.project;

    const form = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: { status: ProjectStatus.DRAFT, isFeatured: false, displayOnHomepage: false } as ProjectFormData,
    });

    useEffect(() => {
        if (project) {
            form.reset({
                title: project.title,
                slug: project.slug,
                category: project.category,
                status: project.status,
                shortDescription: project.shortDescription || '',
                fullDescription: project.fullDescription || '',
                clientName: project.clientName || '',
                clientCompany: project.clientCompany || '',
                locationCity: project.location?.city || '',
                locationState: project.location?.state || '',
                locationCountry: project.location?.country || '',
                startDate: project.startDate ? project.startDate.split('T')[0] : '',
                completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
                projectSize: project.projectSize || '',
                keyFeatures: joinLines(project.keyFeatures),
                isFeatured: project.isFeatured,
                displayOnHomepage: project.displayOnHomepage,
            });
        }
    }, [project, form]);

    const updateMutation = useMutation({
        mutationFn: (data: ProjectFormData) => projectApi.update(projectId, {
            title: data.title,
            slug: data.slug,
            category: data.category,
            status: data.status,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            clientName: data.clientName,
            clientCompany: data.clientCompany,
            location: { city: data.locationCity, state: data.locationState, country: data.locationCountry },
            startDate: data.startDate || undefined,
            completionDate: data.completionDate || undefined,
            projectSize: data.projectSize,
            keyFeatures: splitLines(data.keyFeatures),
            isFeatured: data.isFeatured,
            displayOnHomepage: data.displayOnHomepage,
        }),
        onSuccess: () => {
            toast.success('Project updated');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            router.push('/dashboard/projects');
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update'),
    });

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );

    if (!project) return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-muted-foreground">Project not found.</p>
            <Button variant="outline" asChild><Link href="/dashboard/projects">Go Back</Link></Button>
        </div>
    );

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/projects" className="hover:underline">Projects</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">Edit: {project.title}</span>
            </div>
            <h2 className="text-2xl font-bold">Edit Project</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl><Input placeholder="Project title" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug *</FormLabel>
                                    <FormControl><Input placeholder="project-slug" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="projectSize" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Size</FormLabel>
                                    <FormControl><Input placeholder="e.g. 50,000 sq ft" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category *</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(ProjectCategory).map(v => (
                                                <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status *</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(ProjectStatus).map(v => (
                                                <SelectItem key={v} value={v}>{v.replace('_', ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="startDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="completionDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Completion Date</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Client & Location</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="clientName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Name</FormLabel>
                                    <FormControl><Input placeholder="John Smith" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="clientCompany" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Company</FormLabel>
                                    <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="locationCity" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl><Input placeholder="Mumbai" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="locationState" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl><Input placeholder="Maharashtra" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="locationCountry" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl><Input placeholder="India" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Description & Features</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="shortDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl><Textarea rows={2} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="fullDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Description</FormLabel>
                                    <FormControl><Textarea rows={6} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="keyFeatures" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Key Features <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl><Textarea rows={4} placeholder="Large span structure&#10;Energy efficient design&#10;..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Visibility</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="isFeatured" render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel className="!mt-0">Featured project</FormLabel>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="displayOnHomepage" render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel className="!mt-0">Display on homepage</FormLabel>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/projects">Cancel</Link>
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
