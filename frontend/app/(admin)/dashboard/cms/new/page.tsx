'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronRight, Loader2 } from 'lucide-react';

import { cmsApi } from '@/lib/api/cms';
import { ContentStatus, PageType } from '@/lib/types/cms';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';

const cmsSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Slug: lowercase letters, numbers, hyphens only'),
    type: z.nativeEnum(PageType),
    status: z.nativeEnum(ContentStatus),
});

type CmsFormData = z.infer<typeof cmsSchema>;

export default function NewCmsPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const form = useForm<CmsFormData>({
        resolver: zodResolver(cmsSchema),
        defaultValues: {
            status: ContentStatus.DRAFT,
            type: PageType.PAGE,
            title: '', slug: '',
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: CmsFormData) => cmsApi.create({
            title: data.title,
            slug: data.slug,
            type: data.type,
            status: data.status,
            content: '{}', // Default empty JSON
        }),
        onSuccess: (res) => {
            toast.success('Page created successfully');
            queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
            // Redirect to edit page so they can use the structured editor
            router.push(`/dashboard/cms/${res.data.page.id}/edit`);
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create page'),
    });

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/cms" className="hover:underline">Content</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">New Page</span>
            </div>

            <div>
                <h2 className="text-2xl font-bold tracking-tight">Create New Page</h2>
                <p className="text-muted-foreground">Create the basic shell. You will edit the content structure on the next screen.</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. About Us" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. about-us" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Page Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(PageType).map((t) => (
                                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Initial Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(ContentStatus).map((s) => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/dashboard/cms">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create & Edit Content
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
