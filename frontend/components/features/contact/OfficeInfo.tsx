import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface OfficeInfoProps {
  offices: any[];
  businessHours: string[];
  officesHeading: string;
  officesSubheading: string;
}

export function OfficeInfo({
  offices,
  businessHours,
  officesHeading,
  officesSubheading,
}: OfficeInfoProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <h2 className="text-3xl font-black mb-2">{officesHeading}</h2>
      <p className="text-muted-foreground mb-8">{officesSubheading}</p>
      
      {(offices ?? []).map((office: any) => (
        <div key={office.city} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 space-y-4">
          <div>
            <p className="text-primary text-xs font-bold uppercase tracking-widest">{office.type}</p>
            <h3 className="text-xl font-black mt-1">{office.city}</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span>{office.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a href={`tel:${office.phone}`} className="hover:text-primary transition-colors">{office.phone}</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">{office.email}</a>
            </div>
          </div>
        </div>
      ))}

      {businessHours && businessHours.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Clock className="h-5 w-5" />
            Business Hours
          </div>
          {businessHours.map((line: string, i: number) => (
            <p key={i} className="text-sm text-muted-foreground">{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
