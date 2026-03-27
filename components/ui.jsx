import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useTheme } from './theme.jsx';

export const cn = (...items) => items.filter(Boolean).join(' ');

export const AppLogo = ({ compact = false }) => (
  <div className="flex items-center gap-3">
    <div className="brand-mark flex h-12 w-12 items-center justify-center rounded-2xl">
      <Trophy size={24} strokeWidth={2.4} />
    </div>
    <div>
      <div className="eyebrow">Universal fantasy OS</div>
      <div className={cn('brand-title display-font font-bold uppercase tracking-[0.22em]', compact ? 'text-base' : 'text-xl')}>
        League Director
      </div>
    </div>
  </div>
);

export const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  return (
    <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface-muted)] p-1">
      {themes.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setTheme(item.id)}
          className={cn(
            'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200',
            theme === item.id ? 'bg-[var(--accent-solid)] text-[var(--accent-contrast)] shadow-lg' : 'text-[var(--muted)] hover:text-[var(--text)]'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export const Button = ({ children, className, variant = 'primary', as: Component = 'button', ...props }) => {
  const variants = {
    primary: 'bg-[var(--accent-solid)] text-[var(--accent-contrast)] hover:translate-y-[-2px] hover:brightness-105',
    secondary: 'border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--text)] hover:translate-y-[-2px] hover:bg-[var(--surface-strong)]',
    ghost: 'text-[var(--text)] hover:bg-[var(--surface-muted)]',
  };

  return (
    <Component
      className={cn('inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold transition-all duration-200', variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export const NavLinkButton = ({ to, children, variant = 'secondary', className }) => (
  <Button as={Link} to={to} variant={variant} className={className}>
    {children}
  </Button>
);

export const Panel = ({ children, className, strong = false }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 14, scale: 0.985 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
    className={cn(strong ? 'panel panel-strong' : 'panel', 'hover-lift rounded-[28px]', className)}
  >
    {children}
  </motion.div>
);

export const Badge = ({ children, className }) => (
  <span className={cn('badge-pill', className)}>{children}</span>
);

export const SectionHeading = ({ eyebrow, title, body, right }) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2 className="display-font mt-2 text-4xl font-bold text-[var(--text)] md:text-5xl">{title}</h2>
      {body ? <p className="mt-3 max-w-3xl text-[var(--muted)]">{body}</p> : null}
    </div>
    {right ? <div>{right}</div> : null}
  </div>
);

export const Field = ({ className, ...props }) => (
  <input className={cn('field-base', className)} {...props} />
);

export const SelectField = ({ className, children, ...props }) => (
  <select className={cn('field-base', className)} {...props}>
    {children}
  </select>
);

export const MetricCard = ({ label, value, meta, icon, className }) => (
  <Panel className={cn('metric-card p-6', className)}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <div className="text-sm text-[var(--muted)]">{label}</div>
        <div className="display-font mt-1 text-4xl font-bold text-[var(--text)]">{value}</div>
      </div>
      <div className="icon-chip">{icon}</div>
    </div>
    <div className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{meta}</div>
  </Panel>
);