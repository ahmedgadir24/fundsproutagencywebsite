"use client";

import Link from "next/link";
import { track } from "@/lib/track";

export function TrackedLink({
  href,
  eventName,
  eventData,
  children,
  className,
}: {
  href: string;
  eventName: string;
  eventData?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(eventName, eventData)}
    >
      {children}
    </Link>
  );
}

export function TrackedButton({
  eventName,
  eventData,
  children,
  className,
  onClick,
}: {
  eventName: string;
  eventData?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={className}
      onClick={() => {
        track(eventName, eventData);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}
