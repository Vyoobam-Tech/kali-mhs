'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    Search, MoreHorizontal, Briefcase, Users, Star,
    ChevronLeft, ChevronRight, Eye, FileText, Phone, Mail,
    CheckCircle, XCircle, Clock
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { careerApi } from '@/lib/api/careers';
import { ApplicationStatus } from '@/lib/types/career';

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
    if (score >= 80) return 'text-green-600 font-semibold';
    if (score >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-500 font-semibold';
};

export default function AdminApplicationsPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data, isLoading } = useQuery({
        queryKey: ['admin-applications', search, statusFilter, page],
        queryFn: () =>
            careerApi.getAllApplications({
                page,
                limit,
                status: statusFilter !== 'ALL' ? statusFilter : undefined,
            }),
    });

    const applications = data?.data?.applications || [];
    const total = data?.data?.total || 0;
    const totalPages = data?.data?.totalPages || 1;

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            careerApi.updateApplicationStatus(id, status),
        onSuccess: () => {
            toast.success('Status updated');
            queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
        },
        onError: () => toast.error('Failed to update status'),
    });

    const filtered = search
        ? applications.filter(a =>
            `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(search.toLowerCase())
        )
        : applications;

    // Stats
    const stats = {
        total: total,
        shortlisted: applications.filter(a => a.status === ApplicationStatus.SHORTLISTED).length,
        interviews: applications.filter(a =>
            [ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.INTERVIEWED].includes(a.status as any)
        ).length,
        offers: applications.filter(a =>
            [ApplicationStatus.OFFERED, ApplicationStatus.ACCEPTED].includes(a.status as any)
        ).length,
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Candidate applications pipeline
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/careers">
                        <Briefcase className="mr-2 h-4 w-4" /> Job Postings
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: stats.total, icon: Users, color: 'text-blue-600' },
                    { label: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'text-purple-600' },
                    { label: 'Interviews', value: stats.interviews, icon: Clock, color: 'text-indigo-600' },
                    { label: 'Offers', value: stats.offers, icon: CheckCircle, color: 'text-green-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label}>
                        <CardContent className="pt-4 flex items-center gap-3">
                            <Icon className={`h-6 w-6 ${color}`} />
                            <div>
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="text-xs text-muted-foreground">{label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        {Object.values(ApplicationStatus).map(s => (
                            <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Job</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading applications...
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{app.firstName} {app.lastName}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" />{app.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{(app as any).jobTitle || '—'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{app.totalExperience ?? '—'} yrs</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-sm ${SCORE_COLOR((app as any).candidateScore?.overall)}`}>
                                            {(app as any).candidateScore?.overall
                                                ? `${(app as any).candidateScore.overall}/100`
                                                : '—'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {app.status?.replace(/_/g, ' ')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(app.submittedAt || app.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/careers/applications/${app.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                {app.resumeUrl && (
                                                    <DropdownMenuItem asChild>
                                                        <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                                                            <FileText className="mr-2 h-4 w-4" /> View Resume
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                                    Change Status
                                                </DropdownMenuLabel>
                                                {[
                                                    { s: ApplicationStatus.UNDER_REVIEW, label: 'Under Review' },
                                                    { s: ApplicationStatus.SHORTLISTED, label: 'Shortlist' },
                                                    { s: ApplicationStatus.INTERVIEW_SCHEDULED, label: 'Schedule Interview' },
                                                    { s: ApplicationStatus.OFFERED, label: 'Make Offer' },
                                                    { s: ApplicationStatus.REJECTED, label: 'Reject' },
                                                ].map(({ s, label }) => (
                                                    <DropdownMenuItem
                                                        key={s}
                                                        onClick={() => updateMutation.mutate({ id: app.id, status: s })}
                                                        disabled={app.status === s}
                                                    >
                                                        {label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline" size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <Button
                        variant="outline" size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
