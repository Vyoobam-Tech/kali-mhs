import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';

export const metadata: Metadata = {
    title: 'Careers — Join Our Team',
    description: 'Explore exciting career opportunities at Kali MHS. We are looking for talented professionals in engineering, sales, manufacturing, and more.',
    keywords: ['careers', 'jobs India', 'roofing industry jobs', 'manufacturing careers', 'join Kali MHS', 'job openings'],
    openGraph: {
        title: 'Careers at Kali MHS — Join Our Team',
        description: 'Find opportunities to grow your career in roofing, manufacturing, and engineering at Kali MHS.',
        url: `${BASE_URL}/careers`,
        images: [{ url: '/og-careers.jpg', width: 1200, height: 630, alt: 'Careers at Kali MHS' }],
    },
    alternates: { canonical: `${BASE_URL}/careers` },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
