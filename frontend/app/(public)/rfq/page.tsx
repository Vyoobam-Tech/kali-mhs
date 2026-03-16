'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, ArrowRight, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { RFQStepper } from '@/components/rfq/RFQStepper';
import { Step1ContactInfo } from '@/components/rfq/steps/Step1ContactInfo';
import { Step2ProjectDetails } from '@/components/rfq/steps/Step2ProjectDetails';
import { Step3ProductSelection } from '@/components/rfq/steps/Step3ProductSelection';
import { Step4Specifications } from '@/components/rfq/steps/Step4Specifications';
import { Step5Review } from '@/components/rfq/steps/Step5Review';

import { useRFQStore } from '@/lib/store/rfqStore';
import { rfqApi } from '@/lib/api/rfq';
import {
   fullRFQSchema,
   rfqStep1Schema,
   rfqStep2Schema,
   rfqStep4Schema,
   RFQFormData,
} from '@/components/rfq/types';

const STEPS = [
   { number: 1, title: 'Contact', description: 'Your details' },
   { number: 2, title: 'Project', description: 'Project info' },
   { number: 3, title: 'Products', description: 'Items needed' },
   { number: 4, title: 'Specs', description: 'Details & files' },
   { number: 5, title: 'Review', description: 'Confirm & submit' },
];

const STORAGE_KEY = 'rfq-wizard-draft';

export default function RFQPage() {
   const router = useRouter();
   const { items, clearCart } = useRFQStore();

   const [currentStep, setCurrentStep] = useState(1);
   const [completedSteps, setCompletedSteps] = useState<number[]>([]);
   const [files, setFiles] = useState<File[]>([]);
   const [termsAccepted, setTermsAccepted] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitted, setSubmitted] = useState(false);

   const form = useForm<RFQFormData>({
      resolver: zodResolver(fullRFQSchema),
      mode: 'onChange',
      defaultValues: {
         contact: { firstName: '', lastName: '', email: '', phone: '', company: '', designation: '', address: '', city: '' },
         project: { projectName: '', projectType: 'COMMERCIAL', description: '', timeline: '', budgetRange: '' },
         specifications: '',
         notes: '',
      },
   });

   // Restore draft from localStorage
   useEffect(() => {
      try {
         const saved = sessionStorage.getItem(STORAGE_KEY);
         if (saved) {
            const { formData, step } = JSON.parse(saved);
            form.reset(formData);
            setCurrentStep(step || 1);
         }
      } catch {
         // ignore
      }
   }, []);

   // Auto-save draft
   useEffect(() => {
      const sub = form.watch((data) => {
         try {
            // Use sessionStorage (not localStorage) — PII clears when tab closes
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ formData: data, step: currentStep }));
         } catch {
            // ignore
         }
      });
      return () => sub.unsubscribe();
   }, [form, currentStep]);

   const validateCurrentStep = async (): Promise<boolean> => {
      let fields: string[] = [];
      if (currentStep === 1) {
         const res = rfqStep1Schema.safeParse({ contact: form.getValues('contact') });
         if (!res.success) {
            await form.trigger(['contact.firstName', 'contact.lastName', 'contact.email', 'contact.phone']);
            return false;
         }
      }
      if (currentStep === 2) {
         const res = rfqStep2Schema.safeParse({ project: form.getValues('project') });
         if (!res.success) {
            await form.trigger(['project.projectType', 'project.description']);
            return false;
         }
      }
      if (currentStep === 3) {
         if (items.length === 0) {
            toast.error('Please add at least one product or material.');
            return false;
         }
      }
      return true;
   };

   const goNext = async () => {
      const valid = await validateCurrentStep();
      if (!valid) return;

      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(s => Math.min(s + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const goPrev = () => {
      setCurrentStep(s => Math.max(s - 1, 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const goToStep = (step: number) => {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const onSubmit = async () => {
      if (!termsAccepted) {
         toast.error('Please accept the Terms & Conditions to proceed.');
         return;
      }
      if (items.length === 0) {
         toast.error('Please add at least one item.');
         return;
      }

      setIsSubmitting(true);
      try {
         const formData = form.getValues();
         const payload = new FormData();

         // Append form fields as JSON blob
         payload.append('contact', JSON.stringify(formData.contact));
         payload.append('project', JSON.stringify(formData.project));
         payload.append('specifications', formData.specifications || '');
         payload.append('notes', formData.notes || '');
         payload.append('items', JSON.stringify(
            items.map(item => ({
               productId: item.id.length === 24 ? item.id : undefined,
               productName: item.productName,
               category: item.category,
               quantity: item.quantity,
               unit: item.unit,
               notes: item.notes,
            }))
         ));

         // Append files
         files.forEach(f => payload.append('attachments', f));

         await rfqApi.create(payload as any);

         clearCart();
         sessionStorage.removeItem(STORAGE_KEY);
         setSubmitted(true);
      } catch (error: any) {
         console.error('RFQ error:', error);
         toast.error('Submission Failed', {
            description: error.response?.data?.message || 'Please try again.',
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   // Success screen
   if (submitted) {
      return (
         <div className="container py-20 max-w-lg text-center">
            <div className="flex justify-center mb-6">
               <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
               </div>
            </div>
            <h1 className="text-2xl font-bold mb-3">RFQ Submitted Successfully!</h1>
            <p className="text-muted-foreground mb-2">
               Thank you for your request. Our team will review your requirements and get back to you with a detailed quotation.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
               A confirmation email has been sent to <strong>{form.getValues('contact.email')}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
               <Button onClick={() => router.push('/')}>Back to Home</Button>
               <Button variant="outline" onClick={() => router.push('/products')}>
                  Browse Products
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="container py-10 max-w-3xl">
         {/* Header */}
         <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Request For Quote</h1>
            <p className="text-muted-foreground">
               Complete the steps below to receive a custom quotation for your project.
            </p>
         </div>

         {/* Step progress */}
         <RFQStepper steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />

         {/* Step content */}
         <Form {...form}>
            <form>
               <Card className="shadow-sm">
                  <CardContent className="pt-6">
                     {currentStep === 1 && <Step1ContactInfo form={form} />}
                     {currentStep === 2 && <Step2ProjectDetails form={form} />}
                     {currentStep === 3 && <Step3ProductSelection />}
                     {currentStep === 4 && (
                        <Step4Specifications
                           form={form}
                           files={files}
                           onFilesChange={setFiles}
                        />
                     )}
                     {currentStep === 5 && (
                        <Step5Review
                           formData={form.getValues()}
                           items={items}
                           files={files}
                           onGoToStep={goToStep}
                           onAcceptTerms={setTermsAccepted}
                           termsAccepted={termsAccepted}
                        />
                     )}
                  </CardContent>
               </Card>

               {/* Navigation */}
               <div className="flex justify-between items-center mt-6">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={goPrev}
                     disabled={currentStep === 1}
                  >
                     <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>

                  <span className="text-sm text-muted-foreground">
                     Step {currentStep} of {STEPS.length}
                  </span>

                  {currentStep < 5 ? (
                     <Button type="button" onClick={goNext}>
                        Next <ArrowRight className="h-4 w-4 ml-2" />
                     </Button>
                  ) : (
                     <Button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting || !termsAccepted}
                        className="min-w-[140px]"
                     >
                        {isSubmitting ? (
                           <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                        ) : (
                           <><Send className="mr-2 h-4 w-4" /> Submit RFQ</>
                        )}
                     </Button>
                  )}
               </div>
            </form>
         </Form>

         {/* Draft note */}
         <p className="text-center text-xs text-muted-foreground mt-4">
            Your progress is saved automatically.
         </p>
      </div>
   );
}
