import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';

export const metadata: Metadata = {
    title: 'Request a Quote',
    description: 'Get a customized quote for your roofing or cladding project. Submit your requirements and our team will respond within 24 hours.',
    keywords: ['request quote', 'roofing quote', 'cladding quotation', 'RFQ', 'get pricing', 'bulk roofing order'],
    openGraph: {
        title: 'Request a Quote | Kali MHS',
        description: 'Submit your project requirements and receive a customized quotation from our expert team.',
        url: `${BASE_URL}/rfq`,
        images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Request a Quote — Kali MHS' }],
    },
    alternates: { canonical: `${BASE_URL}/rfq` },
};

export default function RFQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
