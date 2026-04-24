import * as Accordion from '@radix-ui/react-accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    q: 'What does Kinvrs actually build?',
    a: 'Kinvrs is the technology infrastructure layer behind Krafton India\'s platforms — cloud backbone, real-time systems, identity, payments and content delivery engineered for India-scale experiences.',
  },
  {
    q: 'How is Kinvrs different from a typical cloud provider?',
    a: 'We\'re not a generic IaaS. Kinvrs provides opinionated, purpose-built building blocks — pre-wired for gaming, creator, and commerce workloads — with regulatory readiness built in from day one.',
  },
  {
    q: 'Who can partner with Kinvrs?',
    a: 'Creators, gaming studios, media platforms and ambitious consumer teams looking for dependable infrastructure that grows with them. Reach out via info@kinvrs.com to start the conversation.',
  },
  {
    q: 'Where are Kinvrs systems hosted?',
    a: 'Multi-region across India and key international hubs, with edge points optimised for Tier-1 cities and compliant data residency for regulated verticals.',
  },
  {
    q: 'Is Kinvrs production-ready today?',
    a: 'Yes. Our platforms already power live experiences at scale and are built around 99.99% uptime targets, with full observability, anomaly detection and 24/7 operations.',
  },
];

export default function FAQ() {
  const [value, setValue] = useState<string>('item-0');

  return (
    <Accordion.Root type="single" collapsible value={value} onValueChange={setValue} className="space-y-3">
      {faqs.map((f, i) => {
        const id = `item-${i}`;
        const open = value === id;
        return (
          <Accordion.Item
            key={id}
            value={id}
            className={`glass overflow-hidden transition-colors ${open ? 'border-electric/40 bg-electric/5' : ''}`}
          >
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center justify-between gap-6 p-6 md:p-7 text-left group">
                <span className="flex items-center gap-5 flex-1">
                  <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                  <span className="text-lg md:text-xl font-display font-semibold text-white leading-snug">
                    {f.q}
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-shrink-0 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </motion.span>
              </Accordion.Trigger>
            </Accordion.Header>
            <AnimatePresence initial={false}>
              {open && (
                <Accordion.Content forceMount asChild>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-7 pb-7 pl-[calc(1.75rem+1.5rem)] text-white/70 leading-relaxed max-w-3xl">
                      {f.a}
                    </div>
                  </motion.div>
                </Accordion.Content>
              )}
            </AnimatePresence>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
