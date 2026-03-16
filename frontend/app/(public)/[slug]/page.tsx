import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { cmsApi } from '@/lib/api/cms';
import { DynamicPageClient } from './client';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/metadata';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalimhs.com';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const response = await cmsApi.getBySlug(params.slug);
    const page = response.data.page;
    const url = `${BASE_URL}/${page.slug}`;
    const image = page.featuredImage || `${BASE_URL}/og-default.jpg`;

    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || '',
      alternates: { canonical: url },
      openGraph: {
        type: page.type === 'BLOG_POST' || page.type === 'NEWS' ? 'article' : 'website',
        title: page.metaTitle || page.title,
        description: page.metaDescription || page.excerpt || '',
        url,
        images: [{ url: image, width: 1200, height: 630, alt: page.title }],
        ...(page.publishedAt && { publishedTime: page.publishedAt }),
        ...(page.updatedAt && { modifiedTime: page.updatedAt }),
      },
      twitter: {
        card: 'summary_large_image',
        title: page.metaTitle || page.title,
        description: page.metaDescription || page.excerpt || '',
        images: [image],
      },
    };
  } catch {
    return { title: 'Page Not Found' };
  }
}

export default async function DynamicPage({ params }: PageProps) {
  try {
    const response = await cmsApi.getBySlug(params.slug);
    const page = response.data.page;

    if (page.status !== 'PUBLISHED') {
      notFound();
    }

    const url = `${BASE_URL}/${page.slug}`;
    const isArticle = page.type === 'BLOG_POST' || page.type === 'NEWS';
    const ld = isArticle
      ? articleJsonLd({
          title: page.title,
          description: page.metaDescription || page.excerpt,
          image: page.featuredImage,
          url,
          publishedAt: page.publishedAt,
          updatedAt: page.updatedAt,
        })
      : null;

    const breadcrumb = breadcrumbJsonLd([
      { name: 'Home', url: BASE_URL },
      { name: page.title, url },
    ]);

    return (
      <>
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
          strategy="afterInteractive"
        />
        {ld && (
          <Script
            id="article-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
            strategy="afterInteractive"
          />
        )}
        <DynamicPageClient page={page} />
      </>
    );
  } catch {
    notFound();
  }
}
