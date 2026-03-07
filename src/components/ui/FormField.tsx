import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type InputOrTextareaProps = InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FormFieldProps extends InputOrTextareaProps {
  label: string;
  name: string;
  error?: string[] | undefined;
  icon?: ReactNode;
  isTextArea?: boolean;
}

export function FormField({ 
  label, 
  name, 
  error, 
  className, 
  icon, 
  isTextArea, 
  ...props 
}: FormFieldProps) {
  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <div className="w-full">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-foreground mb-1.5 ml-0.5"
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        <InputComponent
          id={name}
          name={name}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...(props as any)}
        />
      </div>
      {error && (
        <div 
          id={`${name}-error`}
          className="mt-1.5 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 px-0.5"
        >
          {error.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}
