import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';

export const metadata: Metadata = {
    title: 'Project Portfolio',
    description: 'Explore our portfolio of successfully completed roofing and cladding installations across residential, commercial, and industrial sectors throughout India.',
    keywords: ['roofing projects', 'cladding installations', 'industrial roofing portfolio', 'commercial roofing India', 'completed projects'],
    openGraph: {
        title: 'Project Portfolio | Kali MHS',
        description: 'Discover our extensive portfolio of roofing and cladding projects across India.',
        url: `${BASE_URL}/projects`,
        images: [{ url: '/og-projects.jpg', width: 1200, height: 630, alt: 'Kali MHS Project Portfolio' }],
    },
    alternates: { canonical: `${BASE_URL}/projects` },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
