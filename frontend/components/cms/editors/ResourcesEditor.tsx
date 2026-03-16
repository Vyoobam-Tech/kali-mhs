'use client';

import { SectionCard, TextInput, TextArea } from './shared';

export interface ResourcesData {
    hero: { title: string; subtitle: string; searchPlaceholder: string };
    emptyState: { noResults: string; noDocuments: string };
}

export function ResourcesEditor({ data, onChange }: { data: ResourcesData; onChange: (d: ResourcesData) => void }) {
    const set = <K extends keyof ResourcesData>(k: K, v: ResourcesData[K]) => onChange({ ...data, [k]: v });
    const setHero = (k: keyof ResourcesData['hero'], v: any) => set('hero', { ...data.hero, [k]: v });
    const setEmpty = (k: keyof ResourcesData['emptyState'], v: any) => set('emptyState', { ...data.emptyState, [k]: v });

    return (
        <div className="space-y-2">
            <SectionCard title="🎯 Hero Section">
                <TextInput label="Heading" value={data.hero.title} onChange={v => setHero('title', v)} placeholder="Resource Library" />
                <TextArea label="Subtitle" value={data.hero.subtitle} onChange={v => setHero('subtitle', v)} rows={3} placeholder="Access technical documentation, product catalogs..." />
                <TextInput label="Search Placeholder" value={data.hero.searchPlaceholder} onChange={v => setHero('searchPlaceholder', v)} placeholder="Search documents..." />
            </SectionCard>

            <SectionCard title="📭 Empty State Messages" description="Shown when no documents are found">
                <TextInput label="No Results" hint="when searching" value={data.emptyState.noResults} onChange={v => setEmpty('noResults', v)} placeholder="Try adjusting your search terms" />
                <TextInput label="No Documents" hint="when list is empty" value={data.emptyState.noDocuments} onChange={v => setEmpty('noDocuments', v)} placeholder="Check back later for new resources" />
            </SectionCard>
        </div>
    );
}
