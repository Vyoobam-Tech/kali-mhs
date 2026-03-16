import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './client';
import { productApi } from '@/lib/api/products';
import axios from 'axios';

// Separate fetch function for Server Component to avoid client-side interceptor issues if any
// But leveraging productApi logic is better if it works.
// We'll trust productApi works on server (axios works on server).

type Props = {
  params: { slug: string }
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // In Next.js 14, params is not a promise, but in 15 it is. 
  // We'll treat it as prop for now.
  
  try {
     // Fetch product for metadata
     // Note: We need absolute URL for server side requests if baseURL is relative.
     // My apiClient uses http://localhost:5000/api/v1 default, which works in local docker/host.
     const response = await productApi.getBySlug(params.slug);
     const product = response.data.product;

     return {
       title: `${product.name} | Kali MHS`,
       description: product.shortDescription || product.fullDescription?.substring(0, 160),
       openGraph: {
         images: product.images?.[0]?.url ? [product.images[0].url] : [],
       },
     };
  } catch (error) {
    return {
      title: 'Product Not Found | Kali MHS',
    };
  }
}

export default async function ProductPage({ params }: Props) {
  let product;
  
  try {
    const response = await productApi.getBySlug(params.slug);
    product = response.data.product;
  } catch (error) {
    // If not found or error
    if (axios.isAxiosError(error) && error.response?.status === 404) {
       notFound();
    }
    // Handle other errors or return null to show error state in client
    console.error("Error fetching product:", error);
  }

  if (!product) {
      notFound();
  }

  return <ProductDetailClient product={product} />;
}
