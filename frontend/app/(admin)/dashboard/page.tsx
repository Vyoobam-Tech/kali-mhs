'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, Briefcase } from 'lucide-react';
import { dashboardApi, DashboardStats } from '@/lib/api/dashboard';

function StatCard({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
        </Card>
    );
}

const STATUS_LABELS: Record<string, string> = {
    DRAFT: 'Draft',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    QUOTED: 'Quoted',
    NEGOTIATION: 'Negotiation',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    EXPIRED: 'Expired',
};

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dashboardApi
            .getStats()
            .then(setStats)
            .catch(() => setError('Failed to load dashboard stats.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total RFQs"
                    value={loading ? '—' : stats?.totalRFQs ?? 0}
                    subtitle={loading ? '' : `+${stats?.rfqsThisMonth ?? 0} this month`}
                    icon={<ShoppingCart className="h-4 w-4" />}
                />
                <StatCard
                    title="Total Leads"
                    value={loading ? '—' : stats?.totalLeads ?? 0}
                    subtitle={loading ? '' : `+${stats?.leadsThisMonth ?? 0} this month`}
                    icon={<Users className="h-4 w-4" />}
                />
                <StatCard
                    title="Active Products"
                    value={loading ? '—' : stats?.activeProducts ?? 0}
                    subtitle="Published & active"
                    icon={<Package className="h-4 w-4" />}
                />
                <StatCard
                    title="Open Positions"
                    value={loading ? '—' : stats?.activeJobs ?? 0}
                    subtitle="Currently hiring"
                    icon={<Briefcase className="h-4 w-4" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[350px] flex items-center justify-center bg-muted/20 rounded-md text-muted-foreground text-sm">
                                Chart coming soon
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent RFQs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p className="text-sm text-muted-foreground">Loading…</p>
                            ) : !stats?.recentRFQs?.length ? (
                                <p className="text-sm text-muted-foreground">No RFQs yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {stats.recentRFQs.map((rfq) => (
                                        <div key={rfq.id} className="flex items-center">
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <p className="text-sm font-medium leading-none truncate">
                                                    {rfq.contactName}
                                                    {rfq.company && (
                                                        <span className="font-normal text-muted-foreground">
                                                            {' '}· {rfq.company}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {rfq.contactEmail}
                                                </p>
                                            </div>
                                            <span className="ml-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {STATUS_LABELS[rfq.status] ?? rfq.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
