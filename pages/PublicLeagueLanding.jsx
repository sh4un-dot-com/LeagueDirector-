import React from 'react';
import { ArrowLeft, CalendarRange, Crown, Users } from 'lucide-react';
import { Badge, NavLinkButton, Panel, SectionHeading } from '../components/ui.jsx';

export function PublicLeagueLanding() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <NavLinkButton to="/" variant="secondary"><ArrowLeft size={16} className="mr-2" /> Back home</NavLinkButton>
        <NavLinkButton to="/app" variant="primary">Open command center</NavLinkButton>
      </div>

      <Panel strong className="overflow-hidden p-8">
        <Badge className="mb-4 inline-flex">Public league spotlight</Badge>
        <SectionHeading
          eyebrow="Grid Master Championship"
          title="A high-stakes F1 league page built like a luxury microsite."
          body="This public-facing league view gives commissioners a premium destination for brand, recruiting, rule transparency, and payout storytelling."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Panel className="p-5">
            <div className="mb-2 flex items-center gap-2 text-[var(--accent)]"><Users size={18} /> Members</div>
            <div className="display-font text-3xl font-bold text-[var(--text)]">12</div>
          </Panel>
          <Panel className="p-5">
            <div className="mb-2 flex items-center gap-2 text-[var(--accent)]"><CalendarRange size={18} /> Season</div>
            <div className="display-font text-3xl font-bold text-[var(--text)]">2026</div>
          </Panel>
          <Panel className="p-5">
            <div className="mb-2 flex items-center gap-2 text-[var(--accent)]"><Crown size={18} /> Prize Pool</div>
            <div className="display-font text-3xl font-bold text-[var(--text)]">$1,200</div>
          </Panel>
        </div>
      </Panel>
    </div>
  );
}