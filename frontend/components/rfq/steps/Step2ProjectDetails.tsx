'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RFQFormData } from '../types';

interface Step2Props {
    form: UseFormReturn<RFQFormData>;
}

const PROJECT_TYPES = [
    { value: 'COMMERCIAL', label: 'Commercial' },
    { value: 'INDUSTRIAL', label: 'Industrial' },
    { value: 'RESIDENTIAL', label: 'Residential' },
    { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
    { value: 'OTHER', label: 'Other' },
];

const TIMELINE_OPTIONS = [
    { value: 'immediate', label: 'Immediate (within 1 week)' },
    { value: '1-3months', label: '1 – 3 Months' },
    { value: '3-6months', label: '3 – 6 Months' },
    { value: '6+months', label: '6+ Months' },
    { value: 'flexible', label: 'Flexible / No Rush' },
];

const BUDGET_OPTIONS = [
    { value: 'under10k', label: 'Under ₹10 Lakhs' },
    { value: '10k-50k', label: '₹10 – ₹50 Lakhs' },
    { value: '50k-100k', label: '₹50 Lakhs – ₹1 Crore' },
    { value: 'above100k', label: 'Above ₹1 Crore' },
    { value: 'undisclosed', label: 'Prefer not to say' },
];

export function Step2ProjectDetails({ form }: Step2Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Project Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Help us understand the scope and context of your project.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="project.projectName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl><Input placeholder="Site Name / Project Ref" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="project.projectType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Type <span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {PROJECT_TYPES.map(t => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="project.timeline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Timeline</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="When do you need this?" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {TIMELINE_OPTIONS.map(t => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="project.budgetRange"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Budget Range</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Estimated budget" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {BUDGET_OPTIONS.map(t => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField control={form.control} name="project.description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Project Description <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Briefly describe your project, its purpose, and key requirements..."
                                className="min-h-[120px]"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
