/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/cn";

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src: string;
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("rounded-full bg-surface border border-border object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
