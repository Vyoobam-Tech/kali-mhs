'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const splitLines = (str?: string) => str?.split('\n').map(s => s.trim()).filter(Boolean) || [];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function NewProjectPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            status: ProjectStatus.DRAFT,
            category: ProjectCategory.COMMERCIAL,
            isFeatured: false,
            displayOnHomepage: false,
            title: '', slug: '',
        } as ProjectFormData,
    });

    const watchTitle = form.watch('title');

    // Auto-slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue('title', e.target.value);
        if (!form.getValues('slug') || form.getValues('slug') === slugify(form.getValues('title').slice(0, -1))) {
            form.setValue('slug', slugify(e.target.value));
        }
    };

    const createMutation = useMutation({
        mutationFn: (data: ProjectFormData) => projectApi.create({
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
            toast.success('Project created');
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            router.push('/dashboard/projects');
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create project'),
    });

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/projects" className="hover:underline">Projects</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">New Project</span>
            </div>
            <h2 className="text-2xl font-bold">Add Project</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project title" {...field} onChange={handleTitleChange} />
                                    </FormControl>
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
                                <FormItem><FormLabel>Client Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="clientCompany" render={({ field }) => (
                                <FormItem><FormLabel>Client Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="locationCity" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Mumbai" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="locationState" render={({ field }) => (
                                <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Maharashtra" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="locationCountry" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="India" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="shortDescription" render={({ field }) => (
                                <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="fullDescription" render={({ field }) => (
                                <FormItem><FormLabel>Full Description</FormLabel><FormControl><Textarea rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="keyFeatures" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Key Features <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl><Textarea rows={4} placeholder="Feature 1&#10;Feature 2" {...field} /></FormControl>
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
                        <Button type="submit" disabled={createMutation.isPending} className="min-w-[140px]">
                            {createMutation.isPending
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>
                                : <><Save className="mr-2 h-4 w-4" />Create Project</>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
