/**
 * Shared primitives for the structured CMS section editors.
 * Each editor renders labeled fields — no raw JSON required.
 */
'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// ── Re-exports for convenience ──────────────────────────────────────
export { Button, Input, Textarea, Label, Card, CardContent, CardHeader, CardTitle, Separator };
export { Plus, Trash2 };

// ── SectionCard ─────────────────────────────────────────────────────
export function SectionCard({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <Card className="mb-6">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

// ── Field ────────────────────────────────────────────────────────────
export function Field({
    label,
    hint,
    children,
    row,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
    row?: boolean;
}) {
    return (
        <div className={row ? 'flex items-center gap-3' : 'space-y-1.5'}>
            <Label className="text-sm font-medium shrink-0 min-w-[130px]">
                {label}
                {hint && <span className="ml-1 text-xs font-normal text-muted-foreground">({hint})</span>}
            </Label>
            {children}
        </div>
    );
}

// ── TextInput ────────────────────────────────────────────────────────
export function TextInput({
    label, hint, value, onChange, placeholder, ...rest
}: {
    label: string; hint?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; [k: string]: any;
}) {
    return (
        <Field label={label} hint={hint}>
            <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} {...rest} />
        </Field>
    );
}

// ── TextArea ─────────────────────────────────────────────────────────
export function TextArea({
    label, hint, value, onChange, placeholder, rows = 3,
}: {
    label: string; hint?: string; value: string; onChange: (v: string) => void;
    placeholder?: string; rows?: number;
}) {
    return (
        <Field label={label} hint={hint}>
            <Textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="resize-none" />
        </Field>
    );
}

// ── RepeatableRow ─────────────────────────────────────────────────────
/** Renders a set of fields per item with Add / Remove controls */
export function RepeatableRow<T extends object>({
    label,
    description,
    items,
    onAdd,
    onRemove,
    onUpdate,
    fields,
    minItems = 0,
}: {
    label: string;
    description?: string;
    items: T[];
    onAdd: () => void;
    onRemove: (idx: number) => void;
    onUpdate: (idx: number, key: keyof T, value: string) => void;
    fields: { key: keyof T; label: string; hint?: string; textarea?: boolean; placeholder?: string }[];
    minItems?: number;
}) {
    return (
        <SectionCard title={label} description={description}>
            {items.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-dashed border-border p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label} {idx + 1}</span>
                        {items.length > minItems && (
                            <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7 px-2"
                                onClick={() => onRemove(idx)}>
                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                            </Button>
                        )}
                    </div>
                    {fields.map(f => (
                        <Field key={String(f.key)} label={f.label} hint={f.hint}>
                            {f.textarea
                                ? <Textarea value={(item[f.key] as string) || ''} onChange={e => onUpdate(idx, f.key, e.target.value)} placeholder={f.placeholder} rows={2} className="resize-none" />
                                : <Input value={(item[f.key] as string) || ''} onChange={e => onUpdate(idx, f.key, e.target.value)} placeholder={f.placeholder} />
                            }
                        </Field>
                    ))}
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={onAdd} className="mt-2 w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add {label}
            </Button>
        </SectionCard>
    );
}

// ── StringListEditor ─────────────────────────────────────────────────
/** For simple string arrays like highlights, departments, facilities */
export function StringListEditor({
    label, description, items, onAdd, onRemove, onUpdate, placeholder, minItems = 0,
}: {
    label: string; description?: string; items: string[];
    onAdd: () => void; onRemove: (i: number) => void;
    onUpdate: (i: number, v: string) => void; placeholder?: string; minItems?: number;
}) {
    return (
        <SectionCard title={label} description={description}>
            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-5 shrink-0 text-center">{idx + 1}</span>
                        <Input value={item} onChange={e => onUpdate(idx, e.target.value)} placeholder={placeholder || 'Enter value...'} />
                        {items.length > minItems && (
                            <Button type="button" variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive h-9 w-9"
                                onClick={() => onRemove(idx)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onAdd} className="mt-2 w-full border-dashed">
                <Plus className="h-4 w-4 mr-2" /> Add item
            </Button>
        </SectionCard>
    );
}

// ── ButtonLinkFields ─────────────────────────────────────────────────
export function ButtonLinkFields({
    label,
    buttonLabel,
    buttonHref,
    onLabelChange,
    onHrefChange,
}: {
    label: string;
    buttonLabel: string;
    buttonHref: string;
    onLabelChange: (v: string) => void;
    onHrefChange: (v: string) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Field label={`${label} Label`}>
                <Input value={buttonLabel} onChange={e => onLabelChange(e.target.value)} placeholder="Button text" />
            </Field>
            <Field label={`${label} Link`}>
                <Input value={buttonHref} onChange={e => onHrefChange(e.target.value)} placeholder="/page-url" />
            </Field>
        </div>
    );
}
