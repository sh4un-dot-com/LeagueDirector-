import React from 'react';
import { ArrowLeft, ArrowRight, Briefcase, Layers3, ShieldCheck } from 'lucide-react';
import { Button, Field, NavLinkButton, Panel, SectionHeading, SelectField } from '../components/ui.jsx';

const steps = [
  {
    icon: <Layers3 size={18} />,
    title: 'Pick your league format',
    body: 'Choose the sport, entity model, draft type, and commissioner access posture.',
  },
  {
    icon: <Briefcase size={18} />,
    title: 'Define the business model',
    body: 'Set buy-ins, payout splits, branding, and what tier of control you want to offer.',
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'Launch with trust',
    body: 'Review scoring, ingest, and ledger posture before opening the league publicly.',
  },
];

export function Onboarding() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <NavLinkButton to="/" variant="secondary"><ArrowLeft size={16} className="mr-2" /> Back home</NavLinkButton>
        <NavLinkButton to="/app" variant="primary">Skip to app</NavLinkButton>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel strong className="p-8">
          <SectionHeading
            eyebrow="Commissioner onboarding"
            title="Start a league like a founder, not like a form-filler."
            body="This flow is designed to feel premium, clear, and operationally serious from first contact through launch."
          />
          <div className="mt-8 space-y-4">
            {steps.map((step) => (
              <Panel key={step.title} className="p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--accent)]">
                  {step.icon}
                </div>
                <div className="display-font text-xl font-bold text-[var(--text)]">{step.title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{step.body}</p>
              </Panel>
            ))}
          </div>
        </Panel>

        <Panel className="p-8">
          <SectionHeading eyebrow="Create your league" title="Tell the platform what kind of empire you want to run." />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field placeholder="League name" />
            <SelectField defaultValue="F1">
              <option>F1</option>
              <option>UFC / MMA</option>
              <option>IPSC Shooting</option>
              <option>Soccer</option>
            </SelectField>
            <SelectField defaultValue="Snake Draft">
              <option>Snake Draft</option>
              <option>Auction Draft</option>
              <option>Salary Cap</option>
            </SelectField>
            <Field placeholder="Buy-in amount" />
            <SelectField defaultValue="Elite">
              <option>Elite brand mode</option>
              <option>Dark operations mode</option>
              <option>Light showcase mode</option>
            </SelectField>
            <Field placeholder="Commissioner full name" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary">Continue <ArrowRight size={16} className="ml-2" /></Button>
            <Button variant="secondary">Save draft</Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}