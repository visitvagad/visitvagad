'use client';

import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from 'react';

/** Label + input wrapper */
interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/** Text input */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-deep-teal/30 focus:border-deep-teal transition-colors ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

/** Textarea */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-deep-teal/30 focus:border-deep-teal transition-colors resize-y min-h-[100px] ${className}`}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

/** Select */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-deep-teal/30 focus:border-deep-teal transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

/** Toggle switch */
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-deep-teal' : 'bg-border-strong'}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-off-white rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </button>
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  );
}

/** Status badge */
export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-stone/10 text-stone',
    published: 'bg-deep-teal/10 text-deep-teal',
    featured: 'bg-terracotta/10 text-terracotta',
    archived: 'bg-surface-alt text-text-muted',
  };
  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
}
