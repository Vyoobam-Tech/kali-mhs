'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronRight, Loader2, Save, Eye, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { cmsApi } from '@/lib/api/cms';
import { ContentStatus } from '@/lib/types/cms';

import { HomepageEditor, type HomepageData } from '@/components/cms/editors/HomepageEditor';
import { AboutEditor, type AboutData } from '@/components/cms/editors/AboutEditor';
import { ContactEditor, type ContactData } from '@/components/cms/editors/ContactEditor';
import { CareersEditor, type CareersData } from '@/components/cms/editors/CareersEditor';
import { ResourcesEditor, type ResourcesData } from '@/components/cms/editors/ResourcesEditor';

// Slugs that get a dedicated structured editor
const STRUCTURED_SLUGS = ['homepage', 'about-page', 'contact-page', 'careers-page', 'resources-page'];

// Friendly page name map
const PAGE_LABELS: Record<string, string> = {
    'homepage': '🏠 Homepage',
    'about-page': '📖 About Us',
    'contact-page': '📞 Contact',
    'careers-page': '💼 Careers',
    'resources-page': '📁 Resources',
};

// Public URL for "View Live" link
const PUBLIC_URLS: Record<string, string> = {
    'homepage': '/',
    'about-page': '/about',
    'contact-page': '/contact',
    'careers-page': '/careers',
    'resources-page': '/resources',
};

// ── Parse content JSON safely ────────────────────────────────────────
function parseContent(raw: string | undefined) {
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
}

export default function EditCmsPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const pageId = params.id;
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<ContentStatus>(ContentStatus.PUBLISHED);
    const [contentData, setContentData] = useState<any>(null);
    const [isDirty, setIsDirty] = useState(false);

    const { data: pageData, isLoading } = useQuery({
        queryKey: ['cms-page', pageId],
        queryFn: () => cmsApi.getOne(pageId),
        enabled: !!pageId,
    });

    const cmsPage = pageData?.data?.page;

    // Initialise form from fetched data
    useEffect(() => {
        if (cmsPage) {
            setTitle(cmsPage.title);
            setStatus(cmsPage.status as ContentStatus);
            setContentData(parseContent(cmsPage.content));
            setIsDirty(false);
        }
    }, [cmsPage]);

    const handleContentChange = useCallback((data: any) => {
        setContentData(data);
        setIsDirty(true);
    }, []);

    const updateMutation = useMutation({
        mutationFn: () => cmsApi.update(pageId, {
            title,
            status,
            content: JSON.stringify(contentData),
        } as any),
        onSuccess: () => {
            toast.success('Page saved successfully!');
            setIsDirty(false);
            queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
            queryClient.invalidateQueries({ queryKey: ['cms-page', pageId] });
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to save page'),
    });

    const handleReset = () => {
        if (cmsPage) {
            setTitle(cmsPage.title);
            setStatus(cmsPage.status as ContentStatus);
            setContentData(parseContent(cmsPage.content));
            setIsDirty(false);
            toast.info('Changes discarded');
        }
    };

    // ── Loading ──────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!cmsPage) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
                <p className="text-muted-foreground">Page not found.</p>
                <Button variant="outline" asChild><Link href="/dashboard/cms">Go Back</Link></Button>
            </div>
        );
    }

    const slug = cmsPage.slug;
    const isStructured = STRUCTURED_SLUGS.includes(slug);
    const pageLabel = PAGE_LABELS[slug] || cmsPage.title;
    const publicUrl = PUBLIC_URLS[slug];

    // ── Render ───────────────────────────────────────────────────────
    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Top Bar */}
            <div className="border-b bg-background sticky top-0 z-10">
                <div className="flex items-center justify-between px-8 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/dashboard/cms" className="hover:underline">Content</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-foreground font-medium">{pageLabel}</span>
                        </div>
                        {isDirty && (
                            <span className="text-xs text-orange-500 font-medium">● Unsaved changes</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Status selector */}
                        <Select value={status} onValueChange={v => { setStatus(v as ContentStatus); setIsDirty(true); }}>
                            <SelectTrigger className="w-[140px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ContentStatus).map(s => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* View live */}
                        {publicUrl && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={publicUrl} target="_blank">
                                    <Eye className="h-4 w-4 mr-1.5" /> View Live
                                </Link>
                            </Button>
                        )}

                        {/* Discard */}
                        {isDirty && (
                            <Button variant="ghost" size="sm" onClick={handleReset}>
                                <RotateCcw className="h-4 w-4 mr-1.5" /> Discard
                            </Button>
                        )}

                        {/* Save */}
                        <Button size="sm" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || !isDirty}>
                            {updateMutation.isPending
                                ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Saving...</>
                                : <><Save className="h-4 w-4 mr-1.5" />Save Changes</>}
                        </Button>
                    </div>
                </div>

                {/* Page title field */}
                <div className="px-8 pb-4">
                    <input
                        value={title}
                        onChange={e => { setTitle(e.target.value); setIsDirty(true); }}
                        className="text-3xl font-black bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/40 focus:ring-0"
                        placeholder="Page Title"
                    />
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-8 py-6 max-w-5xl w-full mx-auto">
                {contentData === null ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : isStructured ? (
                    <>
                        {slug === 'homepage' && (
                            <HomepageEditor data={contentData as HomepageData} onChange={handleContentChange} />
                        )}
                        {slug === 'about-page' && (
                            <AboutEditor data={contentData as AboutData} onChange={handleContentChange} />
                        )}
                        {slug === 'contact-page' && (
                            <ContactEditor data={contentData as ContactData} onChange={handleContentChange} />
                        )}
                        {slug === 'careers-page' && (
                            <CareersEditor data={contentData as CareersData} onChange={handleContentChange} />
                        )}
                        {slug === 'resources-page' && (
                            <ResourcesEditor data={contentData as ResourcesData} onChange={handleContentChange} />
                        )}
                    </>
                ) : (
                    // Generic fallback for non-structured pages (blog posts, news, etc.)
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Page Content</CardTitle>
                            <p className="text-xs text-muted-foreground">
                                This is a generic page. Edit the content below (supports HTML or Markdown).
                            </p>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={typeof contentData === 'string' ? contentData : JSON.stringify(contentData, null, 2)}
                                onChange={e => { setContentData(e.target.value); setIsDirty(true); }}
                                rows={24}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Write your page content here..."
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Save button (bottom too) */}
                <div className="flex justify-end gap-3 pt-6 pb-10 border-t mt-6">
                    <Button variant="outline" asChild><Link href="/dashboard/cms">Cancel</Link></Button>
                    <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending || !isDirty} size="lg">
                        {updateMutation.isPending
                            ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                            : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
                    </Button>
                </div>
            </div>
        </div>
    );
}
