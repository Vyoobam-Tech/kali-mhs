'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronRight, Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { productApi } from '@/lib/api/products';
import { ProductCategory, ProductCategoryLabel, ProductStatus } from '@/lib/types/product';

const productSchema = z.object({
    name: z.string().min(2, 'Name required'),
    slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
    category: z.nativeEnum(ProductCategory),
    status: z.nativeEnum(ProductStatus),
    sku: z.string().optional(),
    shortDescription: z.string().optional(),
    fullDescription: z.string().optional(),
    features: z.string().optional(),     // newline-joined
    applications: z.string().optional(), // newline-joined
    basePrice: z.coerce.number().optional(),
    currency: z.string().optional(),
    priceUnit: z.string().optional(),
    showPrice: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;
type ProductFormInput = z.input<typeof productSchema>;

const joinLines = (arr?: string[]) => arr?.join('\n') || '';
const splitLines = (str?: string) => str?.split('\n').map(s => s.trim()).filter(Boolean) || [];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const productId = params.id;
    const queryClient = useQueryClient();

    const { data: productData, isLoading } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => productApi.getOne(productId),
        enabled: !!productId,
    });

    const product = productData?.data?.product;

    const form = useForm<ProductFormInput, any, ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: { status: ProductStatus.DRAFT, showPrice: false },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                slug: product.slug,
                category: product.category,
                status: product.status,
                sku: product.sku || '',
                shortDescription: product.shortDescription || '',
                fullDescription: product.fullDescription || '',
                features: joinLines(product.features),
                applications: joinLines(product.applications),
                basePrice: product.basePrice,
                currency: product.currency || 'INR',
                priceUnit: product.priceUnit || '',
                showPrice: product.showPrice,
                metaTitle: product.seo?.metaTitle || '',
                metaDescription: product.seo?.metaDescription || '',
            });
        }
    }, [product, form]);

    const updateMutation = useMutation({
        mutationFn: (data: ProductFormData) => productApi.update(productId, {
            name: data.name,
            slug: data.slug,
            category: data.category,
            status: data.status,
            sku: data.sku,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            features: splitLines(data.features),
            applications: splitLines(data.applications),
            basePrice: data.basePrice,
            currency: data.currency || 'INR',
            priceUnit: data.priceUnit,
            showPrice: data.showPrice,
            seo: { metaTitle: data.metaTitle, metaDescription: data.metaDescription },
        }),
        onSuccess: () => {
            toast.success('Product updated');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            router.push('/dashboard/products');
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update'),
    });

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );

    if (!product) return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-muted-foreground">Product not found.</p>
            <Button variant="outline" asChild><Link href="/dashboard/products">Go Back</Link></Button>
        </div>
    );

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/products" className="hover:underline">Products</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">Edit: {product.name}</span>
            </div>
            <h2 className="text-2xl font-bold">Edit Product</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Basic Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Product Name *</FormLabel>
                                    <FormControl><Input placeholder="e.g. Corrugated Metal Sheet" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug *</FormLabel>
                                    <FormControl><Input placeholder="corrugated-metal-sheet" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="sku" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl><Input placeholder="KMH-001" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category *</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(ProductCategory).map(v => (
                                                <SelectItem key={v} value={v}>{ProductCategoryLabel[v]}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status *</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {Object.values(ProductStatus).map(v => (
                                                <SelectItem key={v} value={v}>{v}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Descriptions</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="shortDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl><Textarea rows={2} placeholder="Brief product summary..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="fullDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Description</FormLabel>
                                    <FormControl><Textarea rows={6} placeholder="Detailed product description..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="features" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Features <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl><Textarea rows={4} placeholder="Corrosion resistant&#10;UV protected&#10;..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="applications" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Applications <span className="text-xs text-muted-foreground">(one per line)</span></FormLabel>
                                    <FormControl><Textarea rows={3} placeholder="Industrial warehouses&#10;Residential roofing&#10;..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="basePrice" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Price</FormLabel>
                                    <FormControl><Input type="number" placeholder="0" {...field} value={field.value as number} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="currency" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <FormControl><Input placeholder="INR" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="priceUnit" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit</FormLabel>
                                    <FormControl><Input placeholder="per sqft" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="showPrice" render={({ field }) => (
                                <FormItem className="flex items-center gap-3 md:col-span-3">
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <FormLabel className="!mt-0">Show price publicly</FormLabel>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="metaTitle" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Title</FormLabel>
                                    <FormControl><Input placeholder="SEO title" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="metaDescription" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl><Textarea rows={2} placeholder="SEO description" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/dashboard/products">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending} className="min-w-[140px]">
                            {updateMutation.isPending
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                                : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
