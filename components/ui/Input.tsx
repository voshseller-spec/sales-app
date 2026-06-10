import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "w-full h-11 rounded-lg border border-border bg-elevated px-3.5 text-sm text-ink placeholder:text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldBase, "h-auto min-h-[100px] py-3 leading-6", className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "pr-9 appearance-none bg-no-repeat bg-right", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink mb-1.5">
      {children}
      {hint && <span className="text-subtle font-normal ml-1.5">{hint}</span>}
    </label>
  );
}
