'use client';

import type { ReactNode } from 'react';

export default function ContactLink({ children, className, service }: { children: ReactNode; className?: string; service?: string }) {
  return <a href="#contato" className={className} onClick={() => {
    window.dispatchEvent(new CustomEvent('flammy:contact', { detail: { service } }));
  }}>{children}</a>;
}
