'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Loader2, Upload, CheckCircle2, Briefcase, MapPin,
    Clock, Building2, X, FileText
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { careerApi } from '@/lib/api/careers';

// ── Validation schema ──────────────────────────────────────────
const applicationSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(7, 'Phone number is required'),
    currentCompany: z.string().optional(),
    currentDesignation: z.string().optional(),
    totalExperience: z.coerce.number().min(0, 'Enter years of experience'),
    noticePeriod: z.string().optional(),
    currentSalary: z.coerce.number().optional(),
    expectedSalary: z.coerce.number().optional(),
    currentLocation: z.string().optional(),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
    coverLetter: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;
// For internal RHF state — inputs arrive as strings from <input type="number">
type ApplicationFormInput = z.input<typeof applicationSchema>;

const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export default function ApplyPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const jobId = params.id;

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeError, setResumeError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { data: jobData, isLoading: jobLoading } = useQuery({
        queryKey: ['job', jobId],
        queryFn: () => careerApi.getOne(jobId),
        enabled: !!jobId,
    });

    const job = jobData?.data?.job;

    const form = useForm<ApplicationFormInput, any, ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            firstName: '', lastName: '', email: '', phone: '',
            currentCompany: '', currentDesignation: '', totalExperience: 0,
            noticePeriod: '', currentLocation: '', linkedinUrl: '', portfolioUrl: '', coverLetter: '',
        },
    });

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
            setResumeError('Only PDF or Word documents are accepted.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setResumeError('Resume must be smaller than 5MB.');
            return;
        }
        setResumeError('');
        setResumeFile(file);
    };

    const onSubmit = async (data: ApplicationFormData) => {
        if (!resumeFile) {
            setResumeError('Please upload your resume.');
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('jobId', jobId);
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== '') formData.append(key, String(value));
            });
            formData.append('resume', resumeFile);

            await careerApi.submitApplication(formData);
            setSubmitted(true);
        } catch (err: any) {
            toast.error('Submission Failed', {
                description: err.response?.data?.message || 'Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="container py-20 max-w-lg text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold mb-3">Application Submitted!</h1>
                <p className="text-muted-foreground mb-2">
                    Thank you for applying for <strong>{job?.title}</strong>.
                </p>
                <p className="text-muted-foreground text-sm mb-8">
                    Our HR team will review your application and reach out to you shortly.
                    A confirmation has been sent to your email.
                </p>
                <Button onClick={() => router.push('/careers')}>Browse More Jobs</Button>
            </div>
        );
    }

    if (jobLoading) {
        return (
            <div className="container py-20 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="container py-10 max-w-4xl">
            {/* Job summary */}
            {job && (
                <Card className="mb-8 border-l-4 border-l-primary">
                    <CardContent className="pt-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div>
                                <h1 className="text-2xl font-bold">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.department}</span>
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location?.city || 'Remote'}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.jobType?.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={job.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                                    {job.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <h2 className="text-xl font-semibold mb-6">Submit Your Application</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Info */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name *</FormLabel>
                                    <FormControl><Input placeholder="John" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name *</FormLabel>
                                    <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl><Input type="email" placeholder="you@email.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone *</FormLabel>
                                    <FormControl><Input placeholder="+91 9876543210" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="currentLocation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Location</FormLabel>
                                    <FormControl><Input placeholder="Mumbai, India" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Experience */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Professional Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="currentCompany" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Company</FormLabel>
                                    <FormControl><Input placeholder="Company name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="currentDesignation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Designation</FormLabel>
                                    <FormControl><Input placeholder="Senior Engineer" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="totalExperience" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Experience (years) *</FormLabel>
                                    <FormControl><Input type="number" min={0} step={0.5} {...field} value={field.value as number} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="noticePeriod" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notice Period</FormLabel>
                                    <FormControl><Input placeholder="30 days / Immediate" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="currentSalary" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Salary (₹ LPA)</FormLabel>
                                    <FormControl><Input type="number" placeholder="8" {...field} value={field.value as number} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="expectedSalary" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expected Salary (₹ LPA)</FormLabel>
                                    <FormControl><Input type="number" placeholder="12" {...field} value={field.value as number} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Links */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Online Profiles</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LinkedIn URL</FormLabel>
                                    <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Portfolio / GitHub URL</FormLabel>
                                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    {/* Resume */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Resume *</CardTitle></CardHeader>
                        <CardContent>
                            {resumeFile ? (
                                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">{resumeFile.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setResumeFile(null)}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <Label
                                    htmlFor="resume-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-sm font-medium">Click to upload resume</span>
                                    <span className="text-xs text-muted-foreground mt-1">PDF or Word, max 5MB</span>
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={handleResumeChange}
                                    />
                                </Label>
                            )}
                            {resumeError && (
                                <p className="text-xs text-destructive mt-2">{resumeError}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cover Letter */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Cover Letter (Optional)</CardTitle></CardHeader>
                        <CardContent>
                            <FormField control={form.control} name="coverLetter" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us why you're a great fit for this role..."
                                            rows={5}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Separator />

                    <div className="flex justify-between items-center">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                            ) : (
                                <><Briefcase className="mr-2 h-4 w-4" />Submit Application</>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
