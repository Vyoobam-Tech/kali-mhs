'use client';

import {
    SectionCard, TextInput, TextArea, RepeatableRow, StringListEditor,
    ButtonLinkFields, Separator,
} from './shared';

interface Stat { value: string; label: string }
interface Btn { label: string; href: string }
interface TimelineItem { year: string; title: string; desc: string }
interface LeaderItem { name: string; role: string; bio: string }
interface ValueItem { title: string; desc: string }

export interface AboutData {
    hero: { badge: string; title: string; titleHighlight: string; subtitle: string; primaryButton: Btn; secondaryButton: Btn };
    stats: Stat[];
    timeline: { badge: string; title: string; items: TimelineItem[] };
    leadership: { badge: string; title: string; titleHighlight: string; members: LeaderItem[] };
    manufacturing: { badge: string; title: string; titleHighlight: string; body: string; capabilities: string[]; facilities: string[] };
    values: { badge: string; title: string; items: ValueItem[] };
    globalReach: { badge: string; title: string; titleHighlight: string; body: string; regions: string[] };
    cta: { title: string; subtitle: string; primaryButton: Btn; secondaryButton: Btn };
}

export function AboutEditor({ data, onChange }: { data: AboutData; onChange: (d: AboutData) => void }) {
    const set = <K extends keyof AboutData>(k: K, v: AboutData[K]) => onChange({ ...data, [k]: v });
    const setHero = (k: keyof AboutData['hero'], v: any) => set('hero', { ...data.hero, [k]: v });
    const setTl = (k: keyof AboutData['timeline'], v: any) => set('timeline', { ...data.timeline, [k]: v });
    const setLead = (k: keyof AboutData['leadership'], v: any) => set('leadership', { ...data.leadership, [k]: v });
    const setMfg = (k: keyof AboutData['manufacturing'], v: any) => set('manufacturing', { ...data.manufacturing, [k]: v });
    const setVal = (k: keyof AboutData['values'], v: any) => set('values', { ...data.values, [k]: v });
    const setGr = (k: keyof AboutData['globalReach'], v: any) => set('globalReach', { ...data.globalReach, [k]: v });
    const setCta = (k: keyof AboutData['cta'], v: any) => set('cta', { ...data.cta, [k]: v });

    return (
        <div className="space-y-2">
            {/* Hero */}
            <SectionCard title="🎯 Hero Section">
                <TextInput label="Badge" value={data.hero.badge} onChange={v => setHero('badge', v)} />
                <TextInput label="Title" value={data.hero.title} onChange={v => setHero('title', v)} placeholder="Main heading part 1" />
                <TextInput label="Title Highlight" hint="shown in brand colour" value={data.hero.titleHighlight} onChange={v => setHero('titleHighlight', v)} placeholder="Engineering Excellence" />
                <TextArea label="Subtitle" value={data.hero.subtitle} onChange={v => setHero('subtitle', v)} />
                <Separator />
                <ButtonLinkFields label="Primary Button" buttonLabel={data.hero.primaryButton.label} buttonHref={data.hero.primaryButton.href}
                    onLabelChange={v => setHero('primaryButton', { ...data.hero.primaryButton, label: v })}
                    onHrefChange={v => setHero('primaryButton', { ...data.hero.primaryButton, href: v })} />
                <ButtonLinkFields label="Secondary Button" buttonLabel={data.hero.secondaryButton.label} buttonHref={data.hero.secondaryButton.href}
                    onLabelChange={v => setHero('secondaryButton', { ...data.hero.secondaryButton, label: v })}
                    onHrefChange={v => setHero('secondaryButton', { ...data.hero.secondaryButton, href: v })} />
            </SectionCard>

            {/* Stats */}
            <RepeatableRow<Stat>
                label="Stat" description="The 4 headline numbers shown in the stats bar"
                items={data.stats} minItems={1}
                onAdd={() => set('stats', [...data.stats, { value: '0+', label: 'New Metric' }])}
                onRemove={i => set('stats', data.stats.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => set('stats', data.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s))}
                fields={[{ key: 'value', label: 'Value', placeholder: '50+' }, { key: 'label', label: 'Label', placeholder: 'Years of Excellence' }]}
            />

            {/* Timeline */}
            <SectionCard title="📅 Timeline Section Header">
                <TextInput label="Badge" value={data.timeline.badge} onChange={v => setTl('badge', v)} />
                <TextInput label="Heading" value={data.timeline.title} onChange={v => setTl('title', v)} />
            </SectionCard>
            <RepeatableRow<TimelineItem>
                label="Milestone" description="Each milestone in the company history timeline"
                items={data.timeline.items} minItems={1}
                onAdd={() => setTl('items', [...data.timeline.items, { year: '', title: '', desc: '' }])}
                onRemove={i => setTl('items', data.timeline.items.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => setTl('items', data.timeline.items.map((t, idx) => idx === i ? { ...t, [k]: v } : t))}
                fields={[
                    { key: 'year', label: 'Year', placeholder: '1972' },
                    { key: 'title', label: 'Title', placeholder: 'Company Founded' },
                    { key: 'desc', label: 'Description', placeholder: 'Brief description...', textarea: true },
                ]}
            />

            {/* Leadership */}
            <SectionCard title="👥 Leadership Section Header">
                <TextInput label="Badge" value={data.leadership.badge} onChange={v => setLead('badge', v)} />
                <TextInput label="Title" value={data.leadership.title} onChange={v => setLead('title', v)} />
                <TextInput label="Title Highlight" hint="brand colour" value={data.leadership.titleHighlight} onChange={v => setLead('titleHighlight', v)} />
            </SectionCard>
            <RepeatableRow<LeaderItem>
                label="Team Member" description="Each leader shown in the leadership grid"
                items={data.leadership.members} minItems={1}
                onAdd={() => setLead('members', [...data.leadership.members, { name: '', role: '', bio: '' }])}
                onRemove={i => setLead('members', data.leadership.members.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => setLead('members', data.leadership.members.map((m, idx) => idx === i ? { ...m, [k]: v } : m))}
                fields={[
                    { key: 'name', label: 'Name', placeholder: 'Mr. Rajesh Kumar' },
                    { key: 'role', label: 'Role / Title', placeholder: 'Managing Director' },
                    { key: 'bio', label: 'Short Bio', placeholder: '2–3 lines about this person', textarea: true },
                ]}
            />

            {/* Manufacturing */}
            <SectionCard title="🏗️ Manufacturing Section">
                <TextInput label="Badge" value={data.manufacturing.badge} onChange={v => setMfg('badge', v)} />
                <TextInput label="Title" value={data.manufacturing.title} onChange={v => setMfg('title', v)} />
                <TextInput label="Title Highlight" value={data.manufacturing.titleHighlight} onChange={v => setMfg('titleHighlight', v)} />
                <TextArea label="Body Text" value={data.manufacturing.body} onChange={v => setMfg('body', v)} rows={4} />
            </SectionCard>
            <StringListEditor label="✅ Capabilities (Bullet Points)" description="Manufacturing capabilities checkmark list"
                items={data.manufacturing.capabilities} placeholder="e.g. 150,000 sq ft manufacturing facility"
                onAdd={() => setMfg('capabilities', [...data.manufacturing.capabilities, ''])}
                onRemove={i => setMfg('capabilities', data.manufacturing.capabilities.filter((_, idx) => idx !== i))}
                onUpdate={(i, v) => setMfg('capabilities', data.manufacturing.capabilities.map((c, idx) => idx === i ? v : c))}
            />
            <StringListEditor label="🏭 Facility Cards" description="Location/facility name cards shown in the grid"
                items={data.manufacturing.facilities} placeholder="e.g. Pune Manufacturing Unit"
                onAdd={() => setMfg('facilities', [...data.manufacturing.facilities, ''])}
                onRemove={i => setMfg('facilities', data.manufacturing.facilities.filter((_, idx) => idx !== i))}
                onUpdate={(i, v) => setMfg('facilities', data.manufacturing.facilities.map((f, idx) => idx === i ? v : f))}
            />

            {/* Values */}
            <SectionCard title="🏅 Quality & Values Section Header">
                <TextInput label="Badge" value={data.values.badge} onChange={v => setVal('badge', v)} />
                <TextInput label="Heading" value={data.values.title} onChange={v => setVal('title', v)} />
            </SectionCard>
            <RepeatableRow<ValueItem>
                label="Value Card" description="Each card in the quality/certifications grid"
                items={data.values.items} minItems={1}
                onAdd={() => setVal('items', [...data.values.items, { title: '', desc: '' }])}
                onRemove={i => setVal('items', data.values.items.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => setVal('items', data.values.items.map((v2, idx) => idx === i ? { ...v2, [k]: v } : v2))}
                fields={[
                    { key: 'title', label: 'Title', placeholder: 'ISO 9001:2015' },
                    { key: 'desc', label: 'Description', textarea: true, placeholder: 'Description of this value/certification' },
                ]}
            />

            {/* Global Reach */}
            <SectionCard title="🌍 Global Reach Section">
                <TextInput label="Badge" value={data.globalReach.badge} onChange={v => setGr('badge', v)} />
                <TextInput label="Title" value={data.globalReach.title} onChange={v => setGr('title', v)} />
                <TextInput label="Title Highlight" value={data.globalReach.titleHighlight} onChange={v => setGr('titleHighlight', v)} />
                <TextArea label="Body Text" value={data.globalReach.body} onChange={v => setGr('body', v)} rows={3} />
            </SectionCard>
            <StringListEditor label="🗺️ Regions" description="Geographic region cards"
                items={data.globalReach.regions} placeholder="e.g. South Asia"
                onAdd={() => setGr('regions', [...data.globalReach.regions, ''])}
                onRemove={i => setGr('regions', data.globalReach.regions.filter((_, idx) => idx !== i))}
                onUpdate={(i, v) => setGr('regions', data.globalReach.regions.map((r, idx) => idx === i ? v : r))}
            />

            {/* CTA */}
            <SectionCard title="📣 CTA Section">
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
