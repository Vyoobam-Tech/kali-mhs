'use client';

import { useState } from 'react';
import {
    SectionCard, TextInput, TextArea, RepeatableRow, StringListEditor,
    ButtonLinkFields, Separator,
} from './shared';

// ── Types ─────────────────────────────────────────────────────────────
interface Stat { value: string; label: string }
interface ProductItem { title: string; desc: string; subItems: string[]; learnMoreLabel: string; learnMoreHref: string }
interface SectorItem { title: string; desc: string }
interface SolutionItem { title: string; desc: string }
interface Btn { label: string; href: string }

export interface HomepageData {
    hero: { badge: string; title: string; subtitle: string; primaryButton: Btn; secondaryButton: Btn };
    stats: Stat[];
    pioneering: { badge: string; title: string; body: string; highlights: string[]; statValue: string; statLabel: string };
    productsSection: { badge: string; title: string; subtitle: string; items: ProductItem[] };
    virtualTour: { title: string; subtitle: string; buttonLabel: string; buttonHref: string };
    sectors: { badge: string; title: string; subtitle: string; items: SectorItem[] };
    solutions: { badge: string; title: string; subtitle: string; items: SolutionItem[] };
    cta: { title: string; subtitle: string; primaryButton: Btn; secondaryButton: Btn };
}

function emptyProduct(): ProductItem {
    return { title: '', desc: '', subItems: [''], learnMoreLabel: 'Learn More', learnMoreHref: '/products' };
}

export function HomepageEditor({ data, onChange }: { data: HomepageData; onChange: (d: HomepageData) => void }) {
    const set = <K extends keyof HomepageData>(key: K, val: HomepageData[K]) =>
        onChange({ ...data, [key]: val });
    const setHero = (k: keyof HomepageData['hero'], v: any) => set('hero', { ...data.hero, [k]: v });
    const setPioneering = (k: keyof HomepageData['pioneering'], v: any) => set('pioneering', { ...data.pioneering, [k]: v });
    const setPS = (k: keyof HomepageData['productsSection'], v: any) => set('productsSection', { ...data.productsSection, [k]: v });
    const setSectors = (k: keyof HomepageData['sectors'], v: any) => set('sectors', { ...data.sectors, [k]: v });
    const setSolutions = (k: keyof HomepageData['solutions'], v: any) => set('solutions', { ...data.solutions, [k]: v });
    const setVT = (k: keyof HomepageData['virtualTour'], v: any) => set('virtualTour', { ...data.virtualTour, [k]: v });
    const setCta = (k: keyof HomepageData['cta'], v: any) => set('cta', { ...data.cta, [k]: v });

    return (
        <div className="space-y-2">
            {/* Hero */}
            <SectionCard title="🎯 Hero Section" description="The first thing visitors see at the top of the homepage">
                <TextInput label="Badge Text" value={data.hero.badge} onChange={v => setHero('badge', v)} placeholder="Pioneering Material Handling" />
                <TextInput label="Main Title" value={data.hero.title} onChange={v => setHero('title', v)} placeholder="Engineering Excellence in Bulk Material Handling" />
                <TextArea label="Subtitle" value={data.hero.subtitle} onChange={v => setHero('subtitle', v)} placeholder="Short description below the title" />
                <Separator className="my-2" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Button</p>
                <ButtonLinkFields label="Primary" buttonLabel={data.hero.primaryButton.label} buttonHref={data.hero.primaryButton.href}
                    onLabelChange={v => setHero('primaryButton', { ...data.hero.primaryButton, label: v })}
                    onHrefChange={v => setHero('primaryButton', { ...data.hero.primaryButton, href: v })} />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secondary Button</p>
                <ButtonLinkFields label="Secondary" buttonLabel={data.hero.secondaryButton.label} buttonHref={data.hero.secondaryButton.href}
                    onLabelChange={v => setHero('secondaryButton', { ...data.hero.secondaryButton, label: v })}
                    onHrefChange={v => setHero('secondaryButton', { ...data.hero.secondaryButton, href: v })} />
            </SectionCard>

            {/* Stats */}
            <RepeatableRow<Stat>
                label="Stat" description="The 3 headline numbers shown in the hero banner (e.g. 50+ Global Locations)"
                items={data.stats} minItems={1}
                onAdd={() => set('stats', [...data.stats, { value: '0+', label: 'New Stat' }])}
                onRemove={i => set('stats', data.stats.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => set('stats', data.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s))}
                fields={[
                    { key: 'value', label: 'Value', placeholder: '50+' },
                    { key: 'label', label: 'Label', placeholder: 'Global Locations' },
                ]}
            />

            {/* Pioneering */}
            <SectionCard title="📖 About Section (Homepage)" description="The 2-column story section below the hero">
                <TextInput label="Badge" value={data.pioneering.badge} onChange={v => setPioneering('badge', v)} placeholder="Our Story" />
                <TextInput label="Heading" value={data.pioneering.title} onChange={v => setPioneering('title', v)} />
                <TextArea label="Body Text" value={data.pioneering.body} onChange={v => setPioneering('body', v)} rows={4} />
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                    <TextInput label="Stat Value" value={data.pioneering.statValue} onChange={v => setPioneering('statValue', v)} placeholder="50+" />
                    <TextInput label="Stat Label" value={data.pioneering.statLabel} onChange={v => setPioneering('statLabel', v)} placeholder="Years of Innovation" />
                </div>
            </SectionCard>
            <StringListEditor label="✅ Highlights (Bullet Points)" description="Checkmark bullet points in the About section"
                items={data.pioneering.highlights} placeholder="Enter a highlight..."
                onAdd={() => setPioneering('highlights', [...data.pioneering.highlights, ''])}
                onRemove={i => setPioneering('highlights', data.pioneering.highlights.filter((_, idx) => idx !== i))}
                onUpdate={(i, v) => setPioneering('highlights', data.pioneering.highlights.map((h, idx) => idx === i ? v : h))}
            />

            {/* Products Section */}
            <SectionCard title="📦 Products Section Header">
                <TextInput label="Badge" value={data.productsSection.badge} onChange={v => setPS('badge', v)} />
                <TextInput label="Heading" value={data.productsSection.title} onChange={v => setPS('title', v)} />
                <TextArea label="Subtitle" value={data.productsSection.subtitle} onChange={v => setPS('subtitle', v)} rows={2} />
            </SectionCard>
            <RepeatableRow<ProductItem>
                label="Product Card" description="The 4 product highlight cards on the homepage"
                items={data.productsSection.items} minItems={1}
                onAdd={() => setPS('items', [...data.productsSection.items, emptyProduct()])}
                onRemove={i => setPS('items', data.productsSection.items.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => setPS('items', data.productsSection.items.map((p, idx) => idx === i ? { ...p, [k]: v } : p))}
                fields={[
                    { key: 'title', label: 'Card Title', placeholder: 'Belt Conveyors' },
                    { key: 'desc', label: 'Description', placeholder: 'Short card description', textarea: true },
                    { key: 'learnMoreLabel', label: 'Button Label', placeholder: 'Learn More' },
                    { key: 'learnMoreHref', label: 'Button Link', placeholder: '/products' },
                ]}
            />

            {/* Virtual Tour */}
            <SectionCard title="🎬 360° Virtual Tour Banner">
                <TextInput label="Heading" value={data.virtualTour.title} onChange={v => setVT('title', v)} />
                <TextInput label="Subtitle" value={data.virtualTour.subtitle} onChange={v => setVT('subtitle', v)} />
                <ButtonLinkFields label="Button" buttonLabel={data.virtualTour.buttonLabel} buttonHref={data.virtualTour.buttonHref}
                    onLabelChange={v => setVT('buttonLabel', v)} onHrefChange={v => setVT('buttonHref', v)} />
            </SectionCard>

            {/* Sectors */}
            <SectionCard title="🏭 Sectors Section Header">
                <TextInput label="Badge" value={data.sectors.badge} onChange={v => setSectors('badge', v)} />
                <TextInput label="Heading" value={data.sectors.title} onChange={v => setSectors('title', v)} />
                <TextArea label="Subtitle" value={data.sectors.subtitle} onChange={v => setSectors('subtitle', v)} rows={2} />
            </SectionCard>
            <RepeatableRow<SectorItem>
                label="Sector" description="Each industry sector card"
                items={data.sectors.items} minItems={1}
                onAdd={() => setSectors('items', [...data.sectors.items, { title: '', desc: '' }])}
                onRemove={i => setSectors('items', data.sectors.items.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => setSectors('items', data.sectors.items.map((s, idx) => idx === i ? { ...s, [k]: v } : s))}
                fields={[
                    { key: 'title', label: 'Sector Name', placeholder: 'Mining & Minerals' },
                    { key: 'desc', label: 'Description', placeholder: 'Short description', textarea: true },
                ]}
            />

            {/* Solutions */}
            <SectionCard title="💡 Solutions Section Header">
                <TextInput label="Badge" value={data.solutions.badge} onChange={v => setSolutions('badge', v)} />
                <TextInput label="Heading" value={data.solutions.title} onChange={v => setSolutions('title', v)} />
                <TextArea label="Subtitle" value={data.solutions.subtitle} onChange={v => setSolutions('subtitle', v)} rows={2} />
            </SectionCard>
            <RepeatableRow<SolutionItem>
                label="Solution Card" description="Each card in the solutions grid"
                items={data.solutions.items} minItems={1}
                onAdd={() => setSolutions('items', [...data.solutions.items, { title: '', desc: '' }])}
                onRemove={i => setSolutions('items', data.solutions.items.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => setSolutions('items', data.solutions.items.map((s, idx) => idx === i ? { ...s, [k]: v } : s))}
                fields={[
                    { key: 'title', label: 'Title', placeholder: 'Custom Engineering Design' },
                    { key: 'desc', label: 'Description', placeholder: 'Short description', textarea: true },
                ]}
            />

            {/* CTA */}
            <SectionCard title="📣 Call-to-Action Section (Bottom Banner)">
                <TextInput label="Heading" value={data.cta.title} onChange={v => setCta('title', v)} />
                <TextArea label="Subtitle" value={data.cta.subtitle} onChange={v => setCta('subtitle', v)} rows={2} />
                <Separator />
                <ButtonLinkFields label="Primary Button" buttonLabel={data.cta.primaryButton.label} buttonHref={data.cta.primaryButton.href}
                    onLabelChange={v => setCta('primaryButton', { ...data.cta.primaryButton, label: v })}
                    onHrefChange={v => setCta('primaryButton', { ...data.cta.primaryButton, href: v })} />
                <ButtonLinkFields label="Secondary Button" buttonLabel={data.cta.secondaryButton.label} buttonHref={data.cta.secondaryButton.href}
                    onLabelChange={v => setCta('secondaryButton', { ...data.cta.secondaryButton, label: v })}
                    onHrefChange={v => setCta('secondaryButton', { ...data.cta.secondaryButton, href: v })} />
            </SectionCard>
        </div>
    );
}
