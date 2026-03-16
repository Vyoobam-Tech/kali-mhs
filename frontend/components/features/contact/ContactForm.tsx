'use client';

import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactFormProps {
  data: {
    heading: string;
    subheading: string;
    submitLabel: string;
    successTitle: string;
    successMessage: string;
  };
}

export function ContactForm({ data }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API submission
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="lg:col-span-3">
      <h2 className="text-3xl font-black mb-2">{data.heading}</h2>
      <p className="text-muted-foreground mb-10">{data.subheading}</p>

      {submitted ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-black text-green-800 dark:text-green-300">{data.successTitle}</h3>
          <p className="text-green-700 dark:text-green-400">{data.successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="John Smith" required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Industries Ltd." className="h-12 rounded-xl" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="john@company.com" required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" className="h-12 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input id="subject" placeholder="e.g. Enquiry for Belt Conveyor System" required className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" placeholder="Describe your project, capacity requirements, material type, and any other relevant details..." required className="min-h-[160px] rounded-xl resize-none" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-14 rounded-full font-bold text-base">
            {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</> : data.submitLabel}
          </Button>
        </form>
      )}
    </div>
  );
}
