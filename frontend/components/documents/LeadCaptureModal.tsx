'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Document, LeadCaptureData, documentsApi } from '@/lib/api/documents';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const leadCaptureSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
});

interface LeadCaptureModalProps {
    document: Document | null;
    isOpen: boolean;
    onClose: () => void;
}

export function LeadCaptureModal({ document, isOpen, onClose }: LeadCaptureModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LeadCaptureData>({
        resolver: zodResolver(leadCaptureSchema),
    });

    const onSubmit = async (data: LeadCaptureData) => {
        if (!document) return;

        setIsSubmitting(true);
        try {
            const result = await documentsApi.requestAccess(document.id, data);

            toast.success('Access Granted!', {
                description: 'Download link has been sent to your email. It expires in 1 hour.',
            });

            // Auto-download
            window.open(result.downloadUrl, '_blank');

            reset();
            onClose();
        } catch (error: any) {
            toast.error('Failed to request access', {
                description: error.response?.data?.message || 'Please try again later',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!document) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Download: {document.title}</DialogTitle>
                    <DialogDescription>
                        Please provide your information to access this document. A download link will be sent to your email.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">
                                First Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                {...register('firstName')}
                                placeholder="John"
                                disabled={isSubmitting}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-destructive">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">
                                Last Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                {...register('lastName')}
                                placeholder="Doe"
                                disabled={isSubmitting}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-destructive">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="john.doe@example.com"
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                            id="phone"
                            type="tel"
                            {...register('phone')}
                            placeholder="+1 (555) 123-4567"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                            id="company"
                            {...register('company')}
                            placeholder="Acme Inc."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title (Optional)</Label>
                        <Input
                            id="jobTitle"
                            {...register('jobTitle')}
                            placeholder="Project Manager"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Requesting...
                                </>
                            ) : (
                                'Get Download Link'
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        By submitting, you agree to receive communications from Kali MHS.
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}
