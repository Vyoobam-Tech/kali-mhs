import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';

export const metadata: Metadata = {
    title: 'Product Catalog',
    description: 'Browse our comprehensive range of metal roofing sheets, sandwich panels, polycarbonate systems, fiber cement sheets, and cladding solutions.',
    keywords: ['product catalog', 'metal roofing sheets', 'sandwich panels', 'polycarbonate sheets', 'fiber cement', 'buy roofing materials'],
    openGraph: {
        title: 'Product Catalog | Kali MHS',
        description: 'Explore premium roofing and cladding products — metal sheets, sandwich panels, polycarbonate systems, and more.',
        url: `${BASE_URL}/products`,
        images: [{ url: '/og-products.jpg', width: 1200, height: 630, alt: 'Kali MHS Product Catalog' }],
    },
    alternates: { canonical: `${BASE_URL}/products` },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
