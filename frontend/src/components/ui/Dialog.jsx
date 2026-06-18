import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export function Dialog({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg mx-4 animate-in fade-in-0 zoom-in-95">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children, onClose, ...props }) {
  return (
    <div
      className={cn(
        'bg-[hsl(var(--background))] rounded-lg border border-[hsl(var(--border))] shadow-lg p-6',
        className
      )}
      {...props}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children, ...props }) {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
      {children}
    </h2>
  );
}

export function DialogFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props}>
      {children}
    </div>
  );
}
