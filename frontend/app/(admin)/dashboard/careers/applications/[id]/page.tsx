'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    ArrowLeft, Mail, Phone, MapPin,
    FileText, Linkedin, Globe, Star, MessageSquare, Clock,
    ChevronRight, Loader2, User
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { careerApi } from '@/lib/api/careers';
import { ApplicationStatus } from '@/lib/types/career';

// ── Helpers ──────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-700',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
    SHORTLISTED: 'bg-purple-100 text-purple-700',
    INTERVIEW_SCHEDULED: 'bg-indigo-100 text-indigo-700',
    INTERVIEWED: 'bg-cyan-100 text-cyan-700',
    OFFERED: 'bg-emerald-100 text-emerald-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    WITHDRAWN: 'bg-gray-100 text-gray-600',
};

const SCORE_COLOR = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
};

const STATUS_FLOW = [
    { value: ApplicationStatus.SUBMITTED, label: 'Submitted' },
    { value: ApplicationStatus.UNDER_REVIEW, label: 'Under Review' },
    { value: ApplicationStatus.SHORTLISTED, label: 'Shortlisted' },
    { value: ApplicationStatus.INTERVIEW_SCHEDULED, label: 'Interview Scheduled' },
    { value: ApplicationStatus.INTERVIEWED, label: 'Interviewed' },
    { value: ApplicationStatus.OFFERED, label: 'Offer Made' },
    { value: ApplicationStatus.ACCEPTED, label: 'Accepted' },
    { value: ApplicationStatus.REJECTED, label: 'Rejected' },
    { value: ApplicationStatus.WITHDRAWN, label: 'Withdrawn' },
];

// ── Score Slider ──────────────────────────────────────────────────
function ScoreSlider({
    label, value, onChange
}: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <Label className="text-sm">{label}</Label>
                <span className={`text-sm font-semibold ${SCORE_COLOR(value)}`}>{value}</span>
            </div>
            <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span><span>50</span><span>100</span>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function ApplicationDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const appId = params.id;
    const queryClient = useQueryClient();

    const [newNote, setNewNote] = useState('');
    const [scores, setScores] = useState({
        overall: 0, experience: 0, skills: 0, culture: 0, education: 0,
    });
    const [selectedStatus, setSelectedStatus] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['application', appId],
        queryFn: () => careerApi.getApplicationById(appId),
        enabled: !!appId,
    });

    // Initialise local state once the application data loads
    useEffect(() => {
        const application = data?.data?.application;
        if (application) {
            setSelectedStatus(application.status);
            if (application.candidateScore?.overall) {
                setScores({
                    overall: application.candidateScore.overall || 0,
                    experience: application.candidateScore.experience || 0,
                    skills: application.candidateScore.skills || 0,
                    culture: application.candidateScore.culture || 0,
                    education: application.candidateScore.education || 0,
                });
            }
        }
    }, [data]);

    const app = data?.data?.application;

    const statusMutation = useMutation({
        mutationFn: (status: string) => careerApi.updateApplicationStatus(appId, status),
        onSuccess: () => {
            toast.success('Status updated');
            queryClient.invalidateQueries({ queryKey: ['application', appId] });
            queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
        },
        onError: () => toast.error('Failed to update status'),
    });

    const noteMutation = useMutation({
        mutationFn: (note: string) => careerApi.addApplicationNote(appId, note),
        onSuccess: () => {
            toast.success('Note added');
            setNewNote('');
            queryClient.invalidateQueries({ queryKey: ['application', appId] });
        },
        onError: () => toast.error('Failed to add note'),
    });

    const scoreMutation = useMutation({
        mutationFn: () =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/careers/applications/${appId}/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                body: JSON.stringify(scores),
            }).then(r => r.json()),
        onSuccess: () => {
            toast.success('Scores saved');
            queryClient.invalidateQueries({ queryKey: ['application', appId] });
        },
        onError: () => toast.error('Failed to save scores'),
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!app) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-muted-foreground">Application not found.</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    const fullName = `${app.firstName} ${app.lastName}`;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/careers" className="hover:underline">Careers</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/dashboard/careers/applications" className="hover:underline">Applications</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">{fullName}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{fullName}</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {app.currentDesignation
                                ? `${app.currentDesignation}${app.currentCompany ? ` at ${app.currentCompany}` : ''}`
                                : app.currentCompany || 'Applicant'}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.email}</span>
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{app.phone}</span>
                            {app.currentLocation && (
                                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.currentLocation}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status & Score */}
                <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}`}>
                        {app.status?.replace(/_/g, ' ')}
                    </span>
                    {app.candidateScore?.overall ? (
                        <span className={`text-lg font-bold ${SCORE_COLOR(app.candidateScore.overall)}`}>
                            Score: {app.candidateScore.overall}/100
                        </span>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                        Applied {format(new Date(app.submittedAt || app.createdAt), 'MMM d, yyyy')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Professional Details */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Professional Details</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                                {[
                                    { label: 'Experience', value: app.totalExperience != null ? `${app.totalExperience} years` : '—' },
                                    { label: 'Notice Period', value: app.noticePeriod || '—' },
                                    { label: 'Current Salary', value: app.currentSalary ? `₹${app.currentSalary} LPA` : '—' },
                                    { label: 'Expected Salary', value: app.expectedSalary ? `₹${app.expectedSalary} LPA` : '—' },
                                    { label: 'Current Company', value: app.currentCompany || '—' },
                                    { label: 'Designation', value: app.currentDesignation || '—' },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                        <p className="font-medium mt-0.5">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            {/* Links */}
                            <div className="flex flex-wrap gap-3">
                                {app.resumeUrl && (
                                    <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <FileText className="h-4 w-4" /> View Resume
                                        </Button>
                                    </a>
                                )}
                                {app.linkedinUrl && (
                                    <a href={app.linkedinUrl} target="_blank" rel="noreferrer">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Linkedin className="h-4 w-4" /> LinkedIn
                                        </Button>
                                    </a>
                                )}
                                {app.portfolioUrl && (
                                    <a href={app.portfolioUrl} target="_blank" rel="noreferrer">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Globe className="h-4 w-4" /> Portfolio
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cover Letter */}
                    {(app as any).coverLetter && (
                        <Card>
                            <CardHeader><CardTitle className="text-base">Cover Letter</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {(app as any).coverLetter}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Internal Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" /> Internal Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Existing notes */}
                            {app.adminNotes && app.adminNotes.length > 0 ? (
                                <div className="space-y-3">
                                    {app.adminNotes.map((note: import('@/lib/types/career').AdminNote, i: number) => (
                                        <div key={i} className="bg-muted/60 rounded-lg p-3">
                                            <p className="text-sm">{note.note}</p>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(note.addedAt), 'MMM d, yyyy • HH:mm')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No notes yet.</p>
                            )}

                            <Separator />

                            {/* Add note */}
                            <div className="space-y-2">
                                <Label className="text-sm">Add Note</Label>
                                <Textarea
                                    placeholder="Write an internal note about this candidate..."
                                    rows={3}
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <Button
                                    size="sm"
                                    disabled={!newNote.trim() || noteMutation.isPending}
                                    onClick={() => noteMutation.mutate(newNote)}
                                >
                                    {noteMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                    Add Note
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column: Actions */}
                <div className="space-y-6">
                    {/* Status Management */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_FLOW.map(({ value, label }) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                className="w-full"
                                disabled={selectedStatus === app.status || statusMutation.isPending}
                                onClick={() => statusMutation.mutate(selectedStatus)}
                            >
                                {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Status
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Candidate Scoring */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Star className="h-4 w-4" /> Candidate Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {(['overall', 'experience', 'skills', 'culture', 'education'] as const).map((key) => (
                                <ScoreSlider
                                    key={key}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    value={scores[key]}
                                    onChange={(v) => setScores(prev => ({ ...prev, [key]: v }))}
                                />
                            ))}
                            <Button
                                className="w-full mt-2"
                                variant="outline"
                                disabled={scoreMutation.isPending}
                                onClick={() => scoreMutation.mutate()}
                            >
                                {scoreMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Scores
                            </Button>
                            {app.candidateScore?.scoredAt && (
                                <p className="text-xs text-muted-foreground text-center">
                                    Last scored: {format(new Date(app.candidateScore.scoredAt), 'MMM d, yyyy')}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="destructive" className="w-full" size="sm"
                                onClick={() => statusMutation.mutate(ApplicationStatus.REJECTED)}
                                disabled={app.status === ApplicationStatus.REJECTED || statusMutation.isPending}
                            >
                                Reject Application
                            </Button>
                            <Button
                                className="w-full" size="sm"
                                onClick={() => statusMutation.mutate(ApplicationStatus.SHORTLISTED)}
                                disabled={app.status === ApplicationStatus.SHORTLISTED || statusMutation.isPending}
                            >
                                Shortlist Candidate
                            </Button>
                            <Button
                                variant="outline" className="w-full" size="sm"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className="mr-2 h-3 w-3" /> Back to List
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
