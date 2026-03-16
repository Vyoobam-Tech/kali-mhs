'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Document, documentsApi } from '@/lib/api/documents';
import { cmsApi } from '@/lib/api/cms';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { LeadCaptureModal } from '@/components/documents/LeadCaptureModal';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';

export default function ResourcesPage() {
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: cmsData } = useQuery({
        queryKey: ['cms', 'resources-page'],
        queryFn: () => cmsApi.getBySlug('resources-page'),
    });

    const cms = (() => {
        try {
            const raw = cmsData?.data?.page?.content;
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    })();

    const { data: documents = [], isLoading } = useQuery({
        queryKey: ['documents', 'published'],
        queryFn: () => documentsApi.getPublished(),
    });

    const filteredDocuments = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownloadClick = (document: Document) => {
        setSelectedDocument(document);
        setIsModalOpen(true);
    };

    const hero = cms?.hero ?? {
        title: 'Resource Library',
        subtitle: 'Access technical documentation, product catalogs, case studies, and more. Download resources to help with your projects.',
        searchPlaceholder: 'Search documents...',
    };
    const emptyState = cms?.emptyState ?? {
        noResults: 'Try adjusting your search terms',
        noDocuments: 'Check back later for new resources',
    };

    return (
        <div className="min-h-screen bg-background">
            <HeroBanner title={hero.title} subtitle={hero.subtitle} variant="page" />

            {/* Filter Bar */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b relative z-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={hero.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 rounded-full border-slate-200 shadow-sm text-base"
                        />
                    </div>
                </div>
            </div>

            {/* Documents Grid */}
            <div className="container mx-auto px-4 py-16">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <FileText className="h-16 w-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No documents found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery ? emptyState.noResults : emptyState.noDocuments}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                                Showing {filteredDocuments.length} of {documents.length} resources
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDocuments.map((document) => (
                                <DocumentCard
                                    key={document.id}
                                    document={document}
                                    onDownloadClick={handleDownloadClick}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <LeadCaptureModal
                document={selectedDocument}
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedDocument(null); }}
            />
        </div>
    );
}
