'use client';

import { useQuery } from '@tanstack/react-query';
import { cmsApi } from '@/lib/api/cms';
import { HeroBanner } from '@/components/shared/HeroBanner';
import { ContactForm } from '@/components/features/contact/ContactForm';
import { OfficeInfo } from '@/components/features/contact/OfficeInfo';

export default function ContactPage() {
  const { data: cmsData } = useQuery({
    queryKey: ['cms', 'contact-page'],
    queryFn: () => cmsApi.getBySlug('contact-page'),
  });

  const cms = (() => {
    try {
      const raw = cmsData?.data?.page?.content;
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const hero = cms?.hero ?? {
    badge: 'Get In Touch', title: "Let's Build", titleHighlight: 'Together',
    subtitle: 'Whether you have a new project in mind or need post-installation support, our global team is ready to help.',
  };
  const form = cms?.form ?? {
    heading: 'Send Us an Enquiry',
    subheading: 'Our technical team typically responds within 24 hours on business days.',
    submitLabel: 'Send Enquiry', successTitle: 'Message Sent!',
    successMessage: 'Thank you for reaching out. We will respond to your enquiry within 24 business hours.',
  };
  const offices: any[] = cms?.offices ?? [];
  const businessHours: string[] = cms?.businessHours ?? [];
  const officesHeading = cms?.officesHeading ?? 'Our Offices';
  const officesSubheading = cms?.officesSubheading ?? 'Reach us at any of our global locations.';

  return (
    <div className="min-h-screen">
      <HeroBanner {...hero} variant="page" />
      
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-16">
            <ContactForm data={form} />
            
            <OfficeInfo 
              offices={offices} 
              businessHours={businessHours} 
              officesHeading={officesHeading} 
              officesSubheading={officesSubheading} 
            />
          </div>
        </div>
      </section>
    </div>
  );
}
