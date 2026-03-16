'use client';

import { SectionCard, TextInput, TextArea, StringListEditor } from './shared';

export interface CareersData {
    hero: { title: string; subtitle: string };
    filters: { searchPlaceholder: string; departmentLabel: string; departments: string[] };
    emptyState: { heading: string; subheading: string };
}

export function CareersEditor({ data, onChange }: { data: CareersData; onChange: (d: CareersData) => void }) {
    const set = <K extends keyof CareersData>(k: K, v: CareersData[K]) => onChange({ ...data, [k]: v });
    const setHero = (k: keyof CareersData['hero'], v: any) => set('hero', { ...data.hero, [k]: v });
    const setFilters = (k: keyof CareersData['filters'], v: any) => set('filters', { ...data.filters, [k]: v });
    const setEmpty = (k: keyof CareersData['emptyState'], v: any) => set('emptyState', { ...data.emptyState, [k]: v });

    return (
        <div className="space-y-2">
            {/* Hero */}
            <SectionCard title="🎯 Hero Section">
                <TextInput label="Heading" value={data.hero.title} onChange={v => setHero('title', v)} placeholder="Join Our Team" />
                <TextArea label="Subtitle" value={data.hero.subtitle} onChange={v => setHero('subtitle', v)} rows={3} placeholder="We are always looking for talented individuals..." />
            </SectionCard>

            {/* Filters */}
            <SectionCard title="🔍 Search & Filter Labels">
                <TextInput label="Search Placeholder" value={data.filters.searchPlaceholder} onChange={v => setFilters('searchPlaceholder', v)} placeholder="Search by role or keyword..." />
                <TextInput label="Department Label" value={data.filters.departmentLabel} onChange={v => setFilters('departmentLabel', v)} placeholder="Department" />
            </SectionCard>

            <StringListEditor
                label="🏷️ Department Filter Options"
                description="The first item is the 'All Departments' default option. Add or remove department options here."
                items={data.filters.departments}
                placeholder="e.g. Engineering"
                minItems={1}
                onAdd={() => setFilters('departments', [...data.filters.departments, ''])}
                onRemove={i => setFilters('departments', data.filters.departments.filter((_, idx) => idx !== i))}
                onUpdate={(i, v) => setFilters('departments', data.filters.departments.map((d, idx) => idx === i ? v : d))}
            />

            {/* Empty State */}
            <SectionCard title="📭 Empty State Messages" description="Shown when no jobs are found">
                <TextInput label="Heading" value={data.emptyState.heading} onChange={v => setEmpty('heading', v)} placeholder="No open positions found." />
                <TextInput label="Subheading" value={data.emptyState.subheading} onChange={v => setEmpty('subheading', v)} placeholder="Check back later or submit a general application." />
            </SectionCard>
        </div>
    );
}
