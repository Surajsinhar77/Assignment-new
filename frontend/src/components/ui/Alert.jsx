import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const variants = {
  default: 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-[hsl(var(--border))]',
  destructive: 'border-[hsl(var(--destructive))]/50 text-[hsl(var(--destructive))] bg-[hsl(var(--destructive))]/5',
  success: 'border-emerald-500/50 text-emerald-700 bg-emerald-50',
};

const icons = {
  default: AlertCircle,
  destructive: XCircle,
  success: CheckCircle2,
};

export function Alert({ className, variant = 'default', children, onClose, ...props }) {
  const Icon = icons[variant];
  
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3',
        variants[variant],
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100">
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
