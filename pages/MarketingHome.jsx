import React from 'react';
import { ArrowRight, BarChart3, Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge, MetricCard, NavLinkButton, Panel, SectionHeading, ThemeSwitcher, AppLogo } from '../components/ui.jsx';

const features = [
  {
    icon: <Sparkles size={20} />,
    title: 'Infinite Sports Engine',
    body: 'Launch fantasy leagues for mainstream sports, combat cards, racing constructors, and niche competitions using the same scoring substrate.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Luxury-grade trust layer',
    body: 'Escrow, payouts, and commissioner audit history are presented like portfolio controls rather than a side admin panel.',
  },
  {
    icon: <Cpu size={20} />,
    title: 'Operations in one surface',
    body: 'Scoring logic, data ingest, community chat, and financial posture live in the same cinematic operating environment.',
  },
];

export function MarketingHome() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-4 md:px-6 lg:px-8">
      <header className="mb-5">
        <Panel strong className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
          <AppLogo />
          <div className="flex flex-wrap items-center gap-3">
            <ThemeSwitcher />
            <NavLinkButton to="/app" variant="primary">
              Enter app <ArrowRight size={16} className="ml-2" />
            </NavLinkButton>
          </div>
        </Panel>
      </header>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel strong className="overflow-hidden p-8">
          <Badge className="mb-4 inline-flex">Private fantasy capital markets for sport</Badge>
          <h1 className="display-font max-w-4xl text-5xl font-bold leading-[1.02] text-[var(--text)] md:text-7xl">
            A modern luxury operating system for fantasy leagues, creators, and commissioners.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Build leagues with custom scoring, premium league presentation, live match ingestion, and high-trust payouts in a shell designed to feel closer to a trading terminal than a toy app.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NavLinkButton to="/app" variant="primary">Launch live platform</NavLinkButton>
            <NavLinkButton to="/onboarding" variant="secondary">Commissioner onboarding</NavLinkButton>
            <NavLinkButton to="/league/grid-master-championship" variant="secondary">Public league page</NavLinkButton>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <MetricCard label="Mode Stack" value="3" meta="Light · Dark · Elite" icon={<Sparkles size={20} />} />
            <MetricCard label="Live Feeds" value="24" meta="Cross-sport ingest channels" icon={<Cpu size={20} />} />
            <MetricCard label="Payout Velocity" value="T+0" meta="Escrow to distribution posture" icon={<BarChart3 size={20} />} />
          </div>
        </Panel>

        <div className="grid gap-6">
          {features.map((feature) => (
            <Panel key={feature.title} className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--accent)]">
                {feature.icon}
              </div>
              <h3 className="display-font text-2xl font-bold text-[var(--text)]">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{feature.body}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Panel className="p-6">
          <SectionHeading eyebrow="Why it matters" title="Terminal density" body="Live widgets, finance context, and scoring posture coexist without turning into clutter." />
        </Panel>
        <Panel className="p-6">
          <SectionHeading eyebrow="Interaction" title="Motion as signal" body="Subtle animation communicates state change, hierarchy, and confidence rather than decorative movement." />
        </Panel>
        <Panel className="p-6">
          <SectionHeading eyebrow="Brand posture" title="Expensive by design" body="The palette leans into platinum, obsidian, ivory, and champagne-metal highlights instead of default app blue." />
        </Panel>
      </section>
    </div>
  );
}