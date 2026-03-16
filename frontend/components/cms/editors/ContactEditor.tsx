'use client';

import {
    SectionCard, TextInput, TextArea, RepeatableRow, StringListEditor,
    ButtonLinkFields, Separator,
} from './shared';

interface OfficeItem { type: string; city: string; address: string; phone: string; email: string }
interface Btn { label: string; href: string }

export interface ContactData {
    hero: { badge: string; title: string; titleHighlight: string; subtitle: string };
    officesHeading: string;
    officesSubheading: string;
    offices: OfficeItem[];
    businessHours: string[];
    form: { heading: string; subheading: string; submitLabel: string; successTitle: string; successMessage: string };
}

export function ContactEditor({ data, onChange }: { data: ContactData; onChange: (d: ContactData) => void }) {
    const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => onChange({ ...data, [k]: v });
    const setHero = (k: keyof ContactData['hero'], v: any) => set('hero', { ...data.hero, [k]: v });
    const setForm = (k: keyof ContactData['form'], v: any) => set('form', { ...data.form, [k]: v });

    return (
        <div className="space-y-2">
            {/* Hero */}
            <SectionCard title="🎯 Hero Section">
                <TextInput label="Badge" value={data.hero.badge} onChange={v => setHero('badge', v)} placeholder="Get In Touch" />
                <TextInput label="Title" value={data.hero.title} onChange={v => setHero('title', v)} placeholder="Let's Build" />
                <TextInput label="Title Highlight" hint="brand colour" value={data.hero.titleHighlight} onChange={v => setHero('titleHighlight', v)} placeholder="Together" />
                <TextArea label="Subtitle" value={data.hero.subtitle} onChange={v => setHero('subtitle', v)} rows={2} />
            </SectionCard>

            {/* Offices header */}
            <SectionCard title="🏢 Offices Section Header">
                <TextInput label="Heading" value={data.officesHeading} onChange={v => set('officesHeading', v)} placeholder="Our Offices" />
                <TextInput label="Subheading" value={data.officesSubheading} onChange={v => set('officesSubheading', v)} placeholder="Reach us at any of our global locations." />
            </SectionCard>

            {/* Office repeater */}
            <RepeatableRow<OfficeItem>
                label="Office" description="Each office location shown on the Contact page"
                items={data.offices} minItems={1}
                onAdd={() => set('offices', [...data.offices, { type: '', city: '', address: '', phone: '', email: '' }])}
                onRemove={i => set('offices', data.offices.filter((_, idx) => idx !== i))}
                onUpdate={(i, k, v) => set('offices', data.offices.map((o, idx) => idx === i ? { ...o, [k]: v } : o))}
                fields={[
                    { key: 'type', label: 'Office Type', placeholder: 'Registered Office / Sales Office / Branch' },
                    { key: 'city', label: 'City Name', placeholder: 'Mumbai' },
                    { key: 'address', label: 'Full Address', placeholder: 'Plot No. 42, MIDC Industrial Area...', textarea: true },
                    { key: 'phone', label: 'Phone Number', placeholder: '+91 22 1234 5678' },
                    { key: 'email', label: 'Email Address', placeholder: 'info@kalimhs.com' },
                ]}
            />

            {/* Business Hours */}
            <StringListEditor
                label="🕐 Business Hours"
                description="Each line displayed in the Business Hours box (e.g. 'Mon – Fri: 9:00 AM – 6:00 PM')"
                items={data.businessHours}
                placeholder="Mon – Fri: 9:00 AM – 6:00 PM"
                onAdd={() => set('businessHours', [...data.businessHours, ''])}
                onRemove={i => set('businessHours', data.businessHours.filter((_, idx) => idx !== i))}
                onUpdate={(i, v) => set('businessHours', data.businessHours.map((h, idx) => idx === i ? v : h))}
            />

            {/* Form Labels */}
            <SectionCard title="📝 Contact Form Labels" description="The text shown on the contact form">
                <TextInput label="Form Heading" value={data.form.heading} onChange={v => setForm('heading', v)} placeholder="Send Us an Enquiry" />
                <TextArea label="Form Subheading" value={data.form.subheading} onChange={v => setForm('subheading', v)} rows={2} placeholder="Our technical team typically responds within 24 hours..." />
                <TextInput label="Submit Button" value={data.form.submitLabel} onChange={v => setForm('submitLabel', v)} placeholder="Send Enquiry" />
                <Separator />
                <TextInput label="Success Heading" value={data.form.successTitle} onChange={v => setForm('successTitle', v)} placeholder="Message Sent!" />
                <TextArea label="Success Message" value={data.form.successMessage} onChange={v => setForm('successMessage', v)} rows={2} placeholder="Thank you for reaching out..." />
            </SectionCard>
        </div>
    );
}
