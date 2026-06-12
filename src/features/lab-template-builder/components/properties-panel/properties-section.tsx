"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PropertiesSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function PropertiesSection({
  title,
  children,
  className,
}: PropertiesSectionProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
