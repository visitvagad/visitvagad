import { type HTMLAttributes } from 'react';

type Level = 'h1' | 'h2' | 'h3' | 'h4';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: Level;
}

const levelStyles: Record<Level, string> = {
  h1: 'text-5xl md:text-6xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl font-semibold tracking-tight',
  h3: 'text-xl font-medium',
  h4: 'text-lg font-medium',
};

export function Heading({ as: Tag = 'h2', className = '', children, ...props }: HeadingProps) {
  return (
    <Tag className={`text-text-primary ${levelStyles[Tag]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
