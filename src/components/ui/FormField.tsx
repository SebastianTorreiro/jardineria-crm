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
        className="block text-sm font-medium text-emerald-900 mb-1.5 ml-0.5"
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            {icon}
          </div>
        )}
        <InputComponent
          id={name}
          name={name}
          className={cn(
            "block w-full rounded-lg border-slate-200 bg-white shadow-sm ring-emerald-500/20 transition-all duration-200 sm:text-sm px-3 py-2 border outline-none",
            "hover:border-slate-300 focus:border-emerald-500 focus:ring-2",
            icon && "pl-10",
            error && "border-red-300 focus:border-red-500 focus:ring-red-200",
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
          className="mt-1.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 px-0.5"
        >
          {error.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}
