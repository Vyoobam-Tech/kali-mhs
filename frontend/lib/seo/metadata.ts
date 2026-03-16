import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';
const SITE_NAME = 'Kali MHS';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`;

export interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    keywords?: string[];
    noIndex?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
}

/**
 * Builds a complete Next.js Metadata object with OpenGraph & Twitter Cards.
 */
export function buildMetadata({
    title,
    description = 'Premium manufacturer of metal roofing sheets, sandwich panels, cladding, and complete roofing solutions across India.',
    image = DEFAULT_OG_IMAGE,
    url = BASE_URL,
    type = 'website',
    keywords = [],
    noIndex = false,
    publishedTime,
    modifiedTime,
    author,
}: SEOProps): Metadata {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    return {
        title: fullTitle,
        description,
        keywords: [
            'metal roofing', 'roofing solutions', 'sandwich panels', 'metal cladding',
            'polycarbonate sheets', 'fiber cement', 'KaliMHS', 'roofing manufacturer India',
            ...keywords,
        ],
        authors: author ? [{ name: author }] : [{ name: 'Kali MHS Team' }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        metadataBase: new URL(BASE_URL),
        alternates: { canonical: url },
        robots: noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true, googleBot: { index: true, follow: true } },
        openGraph: {
            type,
            siteName: SITE_NAME,
            title: fullTitle,
            description,
            url,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
        },
        twitter: {
            card: 'summary_large_image',
            site: '@kalimhs',
            creator: '@kalimhs',
            title: fullTitle,
            description,
            images: [image],
        },
    };
}

/**
 * Generates Organization JSON-LD structured data.
 */
export function organizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: [
            'https://www.linkedin.com/company/kali-mhs',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-XXXXXXXXXX',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
        },
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
        },
    };
}

/**
 * Generates Product JSON-LD structured data.
 */
export function productJsonLd(product: {
    name: string;
    description?: string;
    image?: string;
    sku?: string;
    price?: number;
    currency?: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || '',
        image: product.image || DEFAULT_OG_IMAGE,
        sku: product.sku,
        brand: { '@type': 'Brand', name: SITE_NAME },
        url: product.url,
        ...(product.price && {
            offers: {
                '@type': 'Offer',
                priceCurrency: product.currency || 'INR',
                price: product.price,
                availability: 'https://schema.org/InStock',
                url: product.url,
            },
        }),
    };
}

/**
 * Generates Article/BlogPost JSON-LD structured data.
 */
export function articleJsonLd(article: {
    title: string;
    description?: string;
    image?: string;
    url: string;
    publishedAt?: string;
    updatedAt?: string;
    author?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description || '',
        image: article.image || DEFAULT_OG_IMAGE,
        url: article.url,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
            '@type': 'Organization',
            name: article.author || SITE_NAME,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
            },
        },
    };
}

/**
 * Generates BreadcrumbList JSON-LD structured data.
 */
export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Generates JobPosting JSON-LD structured data.
 */
export function jobPostingJsonLd(job: {
    title: string;
    description?: string;
    url: string;
    datePosted?: string;
    validThrough?: string;
    city?: string;
    country?: string;
    jobType?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description || '',
        url: job.url,
        hiringOrganization: {
            '@type': 'Organization',
            name: SITE_NAME,
            sameAs: BASE_URL,
        },
        datePosted: job.datePosted,
        validThrough: job.validThrough,
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.city,
                addressCountry: job.country || 'IN',
            },
        },
        employmentType: job.jobType || 'FULL_TIME',
        ...(job.salaryMin && {
            baseSalary: {
                '@type': 'MonetaryAmount',
                currency: job.currency || 'INR',
                value: {
                    '@type': 'QuantitativeValue',
                    minValue: job.salaryMin,
                    maxValue: job.salaryMax || job.salaryMin,
                    unitText: 'YEAR',
                },
            },
        }),
    };
}
