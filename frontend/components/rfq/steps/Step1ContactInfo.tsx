'use client';

import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { RFQFormData } from '../types';

interface Step1Props {
    form: UseFormReturn<RFQFormData>;
}

export function Step1ContactInfo({ form }: Step1Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Tell us how to reach you regarding this quote.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="contact.firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="John" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="contact.lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="contact.email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input type="email" placeholder="john@company.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="contact.phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="+91 9876543210" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="contact.company"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl><Input placeholder="Company Name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="contact.designation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl><Input placeholder="Project Manager" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="contact.city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="Mumbai" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name="contact.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl><Input placeholder="Street address" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
