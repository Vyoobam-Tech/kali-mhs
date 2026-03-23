'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, MailCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { apiClient } from '@/lib/api/client';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const res = await apiClient.post<{ data?: { resetUrl?: string } }>(
        '/auth/forgot-password',
        { email: data.email }
      );
      // Development only: backend returns the reset URL directly
      if (res.data?.data?.resetUrl) {
        setDevResetUrl(res.data.data.resetUrl);
      }
    } catch {
      // Always show success to avoid email enumeration
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <>
        <div className="flex flex-col items-center space-y-2 text-center">
          <MailCheck className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If an account exists for <strong>{form.getValues('email')}</strong>,
            you will receive a password reset link shortly.
          </p>
        </div>

        {/* Dev-only: show the reset URL inline since SMTP is not configured */}
        {devResetUrl && (
          <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4 text-sm dark:border-yellow-700 dark:bg-yellow-950">
            <p className="mb-2 font-medium text-yellow-800 dark:text-yellow-300">
              Development mode — reset link:
            </p>
            <Link
              href={devResetUrl}
              className="break-all text-yellow-700 underline underline-offset-2 dark:text-yellow-400"
            >
              {devResetUrl}
            </Link>
          </div>
        )}

        <Link
          href="/login"
          className="text-center text-sm underline underline-offset-4 hover:text-primary"
        >
          Back to login
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link href="/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </>
  );
}
