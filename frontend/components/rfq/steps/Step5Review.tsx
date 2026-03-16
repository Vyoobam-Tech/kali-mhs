'use client';

import { useState } from 'react';
import { CheckCircle2, Edit2, User, Building2, Package, FileText, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RFQFormData } from '../types';

interface Step5Props {
    formData: RFQFormData;
    items: any[];
    files: File[];
    onGoToStep: (step: number) => void;
    onAcceptTerms: (accepted: boolean) => void;
    termsAccepted: boolean;
}

function Section({ title, icon: Icon, onEdit, children }: any) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                <div className="flex items-center gap-2 font-medium text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    {title}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="h-7 text-xs gap-1">
                    <Edit2 className="h-3 w-3" /> Edit
                </Button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

function Row({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex gap-2 text-sm">
            <span className="text-muted-foreground w-28 shrink-0">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

export function Step5Review({ formData, items, files, onGoToStep, onAcceptTerms, termsAccepted }: Step5Props) {
    const { contact, project } = formData;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                    <h2 className="text-xl font-semibold">Review & Submit</h2>
                    <p className="text-sm text-muted-foreground">
                        Review all details before submitting your request.
                    </p>
                </div>
            </div>

            {/* Contact */}
            <Section title="Contact Information" icon={User} onEdit={() => onGoToStep(1)}>
                <div className="space-y-1.5">
                    <Row label="Name" value={`${contact.firstName} ${contact.lastName}`} />
                    <Row label="Email" value={contact.email} />
                    <Row label="Phone" value={contact.phone} />
                    {contact.company && <Row label="Company" value={contact.company} />}
                    {contact.designation && <Row label="Job Title" value={contact.designation} />}
                    {contact.city && <Row label="City" value={contact.city} />}
                </div>
            </Section>

            {/* Project */}
            <Section title="Project Details" icon={Building2} onEdit={() => onGoToStep(2)}>
                <div className="space-y-1.5">
                    {project.projectName && <Row label="Project" value={project.projectName} />}
                    <Row label="Type" value={project.projectType} />
                    {project.timeline && <Row label="Timeline" value={project.timeline} />}
                    {project.budgetRange && <Row label="Budget" value={project.budgetRange} />}
                    {project.description && (
                        <div className="text-sm mt-2">
                            <span className="text-muted-foreground">Description:</span>
                            <p className="mt-1 text-foreground">{project.description}</p>
                        </div>
                    )}
                </div>
            </Section>

            {/* Items */}
            <Section title={`Products (${items.length})`} icon={Package} onEdit={() => onGoToStep(3)}>
                {items.length === 0 ? (
                    <p className="text-sm text-destructive">No items added – please go back and add at least one.</p>
                ) : (
                    <div className="space-y-2">
                        {items.map((item, i) => (
                            <div key={item.id} className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0">
                                <span>{i + 1}. {item.productName}</span>
                                <Badge variant="secondary">{item.quantity} {item.unit}</Badge>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            {/* Specifications */}
            {(formData.specifications || formData.notes || files.length > 0) && (
                <Section title="Specifications & Files" icon={FileText} onEdit={() => onGoToStep(4)}>
                    <div className="space-y-3">
                        {formData.specifications && (
                            <p className="text-sm">{formData.specifications}</p>
                        )}
                        {formData.notes && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Special Requirements:</p>
                                <p className="text-sm">{formData.notes}</p>
                            </div>
                        )}
                        {files.length > 0 && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" /> {files.length} file(s) attached
                                </p>
                                <div className="space-y-1">
                                    {files.map((f, i) => (
                                        <p key={i} className="text-sm text-muted-foreground">• {f.name}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            <Separator />

            {/* Terms */}
            <div className="flex items-start gap-3">
                <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(v) => onAcceptTerms(!!v)}
                    className="mt-0.5"
                />
                <label htmlFor="terms" className="text-sm cursor-pointer">
                    I confirm that the information provided is accurate and I agree to Kali MHS&apos;s{' '}
                    <a href="/terms" target="_blank" className="text-primary underline">Terms & Conditions</a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</a>.
                </label>
            </div>
        </div>
    );
}
