import { type HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

const spacingStyles = {
  sm: 'py-12',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
};

export function Section({ spacing = 'md', className = '', children, ...props }: SectionProps) {
  return (
    <section className={`${spacingStyles[spacing]} ${className}`} {...props}>
      {children}
    </section>
  );
}
