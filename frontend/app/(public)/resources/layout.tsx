import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';

export const metadata: Metadata = {
    title: 'Resources & Technical Downloads',
    description: 'Download technical datasheets, installation guides, product specifications, and brochures for all Kali MHS roofing and cladding products.',
    keywords: ['roofing datasheets', 'installation guide', 'technical downloads', 'product specification', 'brochure', 'PDF download'],
    openGraph: {
        title: 'Resources & Technical Downloads | Kali MHS',
        description: 'Access technical documentation, datasheets, and installation guides for Kali MHS products.',
        url: `${BASE_URL}/resources`,
        images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Resources — Kali MHS' }],
    },
    alternates: { canonical: `${BASE_URL}/resources` },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
