interface GridContainerProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: React.ElementType;
}

export function GridContainer({
  children,
  cols = 3,
  gap = 'lg',
  className = '',
  as: Component = 'div',
}: GridContainerProps) {
  
  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const gapMap = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12 md:gap-16',
  };

  return (
    <Component className={`grid ${colMap[cols]} ${gapMap[gap]} ${className}`}>
      {children}
    </Component>
  );
}
