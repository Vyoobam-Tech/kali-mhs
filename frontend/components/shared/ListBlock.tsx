import { CheckCircle } from 'lucide-react';

interface ListBlockProps {
  items: string[];
  icon?: React.ReactNode; 
  bulletColor?: 'primary' | 'white'; 
  layout?: 'col' | 'grid';
  textSize?: 'sm' | 'base' | 'lg';
}

export function ListBlock({
  items,
  icon = <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />,
  bulletColor = 'primary',
  layout = 'col',
  textSize = 'base',
}: ListBlockProps) {
  if (!items || items.length === 0) return null;

  const colorClass = bulletColor === 'primary' ? 'text-primary' : 'text-white';
  const textClass = textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-lg' : 'text-base';
  const containerClass = layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4';

  return (
    <ul className={`pt-4 ${containerClass}`}>
      {items.map((item, i) => (
        <li key={i} className={`flex items-center text-slate-700 dark:text-slate-200 font-medium ${textClass}`}>
          <div className={colorClass}>{icon}</div>
          {item}
        </li>
      ))}
    </ul>
  );
}
