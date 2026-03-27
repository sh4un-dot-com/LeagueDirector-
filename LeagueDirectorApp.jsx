import React, { useMemo, useState } from 'react';
import {
  Trophy,
  Settings,
  DollarSign,
  MessageSquare,
  Users,
  Shield,
  ShieldCheck,
  Activity,
  ChevronDown,
  Search,
  Bell,
  Plus,
  Car,
  Swords,
  Target,
  Flag,
  CircleDollarSign,
  Medal,
  Gamepad2,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers3,
  Clock3,
  Flame,
  ChevronRight,
  Zap,
} from 'lucide-react';

const genId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultSports = [
  { id: genId(), name: 'F1', category: 'Motorsport', stat_schema: ['fastest_lap', 'pit_stops', 'laps_led', 'qualifying_position'] },
  { id: genId(), name: 'UFC / MMA', category: 'Combat', stat_schema: ['takedown', 'knockdown', 'submission_attempt', 'significant_strike'] },
  { id: genId(), name: 'IPSC Shooting', category: 'Esports & Niche', stat_schema: ['hits', 'penalties', 'time_seconds', 'stages_won'] },
  { id: genId(), name: 'Soccer', category: 'Team Sports', stat_schema: ['goals', 'assists', 'clean_sheets', 'yellow_cards'] },
];

const defaultEntities = [
  { id: genId(), sport: 'F1', name: 'Max Verstappen', type: 'Individual' },
  { id: genId(), sport: 'F1', name: 'Red Bull Racing', type: 'Constructor' },
  { id: genId(), sport: 'UFC / MMA', name: 'Conor McGregor', type: 'Individual' },
  { id: genId(), sport: 'IPSC Shooting', name: 'Team USA Open', type: 'Team' },
];

const defaultLeagues = [
  { id: genId(), name: 'Grid Master Championship', sport: 'F1', commissioner: 'Mike', buy_in: 100, status: 'Active', payout: { first: 0.6, second: 0.3, third: 0.1 } },
  { id: genId(), name: 'Combat Syndicate', sport: 'UFC / MMA', commissioner: 'Sarah', buy_in: 75, status: 'Active', payout: { first: 0.6, second: 0.3, third: 0.1 } },
];

const defaultRules = [
  { id: genId(), league_id: null, sport: 'UFC / MMA', action_key: 'takedown', description: 'Takedown', point_value: 5, condition: null },
  { id: genId(), league_id: null, sport: 'UFC / MMA', action_key: 'submission_attempt', description: 'Submission Attempt', point_value: 3, condition: null },
  { id: genId(), league_id: null, sport: 'F1', action_key: 'fastest_lap', description: 'Fastest Lap', point_value: 10, condition: null },
  { id: genId(), league_id: null, sport: 'F1', action_key: 'pit_stops', description: 'Pit Stop', point_value: -1, condition: { multiplier: 1, if: null } },
];

const defaultLiveData = [
  { id: genId(), match_id: 'monaco-2026', entity_id: null, entityName: 'Max Verstappen', sport: 'F1', raw_stats: { fastest_lap: 1, pit_stops: 2, laps_led: 50, qualifying_position: 1, championship_round: true } },
  { id: genId(), match_id: 'ufc300-main', entity_id: null, entityName: 'Alex Pereira', sport: 'UFC / MMA', raw_stats: { takedown: 2, submission_attempt: 1, significant_strike: 48, championship_round: true } },
];

const sportsCategories = {
  'Team Sports': { icon: <Activity size={18} />, list: ['Football (NFL)', 'Basketball', 'Soccer', 'Baseball', 'Ice Hockey', 'Rugby', 'Cricket', 'Volleyball', 'Lacrosse'] },
  Motorsport: { icon: <Car size={18} />, list: ['F1', 'NASCAR', 'IndyCar', 'MotoGP', 'WEC', 'WRC Rally', 'Supercross'] },
  Combat: { icon: <Swords size={18} />, list: ['UFC / MMA', 'Boxing', 'WWE', 'Jiu-Jitsu', 'Olympic Wrestling', 'Kickboxing'] },
  'Individual & Racing': { icon: <Medal size={18} />, list: ['Golf', 'Tennis', 'Track & Field', 'Cycling', 'Swimming', 'Horse Racing'] },
  'Esports & Niche': { icon: <Gamepad2 size={18} />, list: ['Esports', 'IPSC Shooting', 'Darts', 'Snooker', 'Bowling', 'Pickleball'] },
};

const appTabs = [
  { id: 'dashboard', label: 'Command Center', icon: <Activity size={18} /> },
  { id: 'scoring', label: 'Scoring Sandbox', icon: <Settings size={18} /> },
  { id: 'ledger', label: 'League Ledger', icon: <DollarSign size={18} /> },
  { id: 'chat', label: 'Trash Talk', icon: <MessageSquare size={18} /> },
];

const ui = {
  shell: 'glass-panel rounded-[28px] border-white/10 shadow-2xl shadow-slate-950/30',
  shellStrong: 'glass-panel-strong rounded-[30px] border-white/10 shadow-2xl shadow-slate-950/40',
  card: 'glass-panel rounded-[24px] border-white/10 shadow-xl shadow-slate-950/20',
  title: 'display-font font-bold text-white',
  eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-300/75',
  body: 'text-slate-400',
  input: 'rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/45',
  buttonPrimary: 'rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-200',
  buttonSecondary: 'rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10',
  badge: 'rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold tracking-[0.2em] text-cyan-200',
};

const getSportIcon = (sport) => {
  if (sport === 'F1') return <Car size={16} className="text-cyan-300" />;
  if (sport === 'UFC / MMA') return <Swords size={16} className="text-rose-300" />;
  if (sport === 'IPSC Shooting') return <Target size={16} className="text-emerald-300" />;
  return <Activity size={16} className="text-cyan-300" />;
};

const parseConditionMultiplier = (rule, rawStats) => {
  if (!rule.condition) return 1;
  let multiplier = Number(rule.condition.multiplier ?? 1);
  if (rule.condition.if) {
    const ifStatus = rawStats[rule.condition.if];
    if (!ifStatus) return 0;
  }

  if (rule.condition.modifier && typeof rule.condition.modifier === 'string') {
    const perMatch = rule.condition.modifier.match(/^per_(\d+)_/i);
    if (perMatch) {
      const unit = Number(perMatch[1]);
      if (unit > 0) multiplier *= 1 / unit;
    }
  }

  return multiplier;
};

const evaluateRuleForStats = (rule, rawStats) => {
  const baseValue = Number(rawStats?.[rule.action_key] ?? 0);
  if (!Object.prototype.hasOwnProperty.call(rawStats || {}, rule.action_key)) {
    return 0;
  }
  const pointValue = Number(rule.point_value ?? 0);

  let total = baseValue * pointValue;
  const conditionMultiplier = parseConditionMultiplier(rule, rawStats);
  total *= conditionMultiplier;

  if (rule.condition?.per) {
    const perValue = Number(rule.condition.per);
    if (perValue > 0) {
      total = (baseValue / perValue) * pointValue;
    }
  }

  if (rule.condition?.flat) {
    total += Number(rule.condition.flat);
  }

  return Number(total.toFixed(2));
};

const StatCard = ({ label, value, meta, icon, tone }) => (
  <div className={`${ui.card} metric-card hover-lift p-6`}>
    <div className="mb-4 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <h3 className="mt-1 display-font text-4xl font-bold text-white">{value}</h3>
      </div>
      <div className={`rounded-2xl border p-3 ${tone}`}>{icon}</div>
    </div>
    <div className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">{meta}</div>
  </div>
);

const FeatureCard = ({ icon, title, body }) => (
  <div className={`${ui.card} hover-lift p-6`}>
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-cyan-200">
      {icon}
    </div>
    <h3 className="display-font text-xl font-bold text-white">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
  </div>
);

const LeagueDirectorApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeGender, setActiveGender] = useState('Mens');
  const [activeRegion, setActiveRegion] = useState('Global');
  const [expandedSport, setExpandedSport] = useState('Team Sports');

  const [sports] = useState(defaultSports);
  const [entities] = useState(defaultEntities);
  const [leagues] = useState(defaultLeagues);
  const [leagueRules, setLeagueRules] = useState(defaultRules);
  const [liveData, setLiveData] = useState(defaultLiveData);

  const [newRule, setNewRule] = useState({ league_id: defaultLeagues[0].id, action_key: '', description: '', point_value: '', condition: '' });
  const [manualStatUpdate, setManualStatUpdate] = useState({ match_id: '', entityName: '', sport: 'F1', raw_stats: '{}' });

  const selectedLeague = leagues.find((league) => league.id === newRule.league_id) || leagues[0];

  const leagueRuleSet = useMemo(
    () => leagueRules.filter((rule) => !rule.league_id || rule.league_id === selectedLeague?.id),
    [leagueRules, selectedLeague]
  );

  const leagueScores = useMemo(() => {
    const scores = {};
    liveData.forEach((match) => {
      const matchingRules = leagueRuleSet.filter((rule) => rule.sport === match.sport);
      if (!matchingRules.length) return;

      const score = matchingRules.reduce((aggregate, rule) => aggregate + evaluateRuleForStats(rule, match.raw_stats), 0);
      scores[match.entityName] = Number((scores[match.entityName] || 0) + score).toFixed(2);
    });
    return scores;
  }, [liveData, leagueRuleSet]);

  const topEntities = useMemo(
    () => Object.entries(leagueScores).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5),
    [leagueScores]
  );

  const feedHealth = useMemo(
    () => sports.map((sport, index) => ({
      id: sport.id,
      name: sport.name,
      status: index % 2 === 0 ? 'Nominal' : 'Watching',
      coverage: `${sport.stat_schema.length} signals`,
    })),
    [sports]
  );

  const commandAlerts = useMemo(
    () => [
      { id: 'a1', title: 'Fastest lap rule overweight', body: 'F1 sandbox is awarding 34% of weekend total from one event.', tone: 'text-amber-200' },
      { id: 'a2', title: 'Manual ingest window open', body: 'IPSC match commissioners can submit stage totals until 22:00 UTC.', tone: 'text-cyan-200' },
      { id: 'a3', title: 'Payout approval pending', body: `${selectedLeague.name} has ${selectedLeague.status} settlement state for final review.`, tone: 'text-emerald-200' },
    ],
    [selectedLeague]
  );

  const marketingHighlights = [
    {
      icon: <Sparkles size={20} />,
      title: 'Infinite Sports Engine',
      body: 'One scoring model spans F1 constructors, UFC cards, IPSC teams, golf pools, or whatever the commissioner invents next.',
    },
    {
      icon: <ShieldCheck size={20} />,
      title: 'Trust-Centric Ledger',
      body: 'Escrow-aware league operations, payout routing, and audit-grade financial history sit beside the competition instead of outside it.',
    },
    {
      icon: <Cpu size={20} />,
      title: 'Commissioner Control Surface',
      body: 'Live data overrides, scoring simulations, and operational alerts are visible in one place without falling back to spreadsheets.',
    },
  ];

  const designPillars = [
    'Signal-first typography',
    'Glass terminal surfaces',
    'Motion-driven state changes',
    'Reusable control primitives',
  ];

  const recordRule = (rule) => {
    if (!rule.action_key || Number.isNaN(Number(rule.point_value))) {
      return null;
    }

    const condition = rule.condition ? (() => {
      try {
        const parsed = JSON.parse(rule.condition);
        return typeof parsed === 'object' && parsed !== null ? parsed : null;
      } catch {
        return null;
      }
    })() : null;

    return {
      id: genId(),
      league_id: rule.league_id,
      sport: selectedLeague?.sport || 'General',
      action_key: rule.action_key.trim(),
      description: rule.description.trim() || rule.action_key.trim(),
      point_value: Number(rule.point_value) || 0,
      condition,
    };
  };

  const handleAddRule = () => {
    const created = recordRule(newRule);
    if (!created) return;

    setLeagueRules((previous) => [...previous, created]);
    setNewRule({ ...newRule, action_key: '', description: '', point_value: '', condition: '' });
  };

  const handleManualStatSave = () => {
    let stats;
    try {
      stats = JSON.parse(manualStatUpdate.raw_stats);
    } catch {
      alert('Invalid JSON for raw_stats. Example: {"fastest_lap":1}');
      return;
    }

    setLiveData((previous) => {
      const existing = previous.find(
        (item) => item.match_id === manualStatUpdate.match_id && item.entityName === manualStatUpdate.entityName
      );
      if (existing) {
        return previous.map((item) => (
          item.id === existing.id ? { ...item, raw_stats: stats, sport: manualStatUpdate.sport } : item
        ));
      }

      return [
        ...previous,
        {
          id: genId(),
          match_id: manualStatUpdate.match_id || genId(),
          entity_id: null,
          entityName: manualStatUpdate.entityName || 'New Entity',
          sport: manualStatUpdate.sport,
          raw_stats: stats,
        },
      ];
    });

    setManualStatUpdate({ match_id: '', entityName: '', sport: 'F1', raw_stats: '{}' });
  };

  const totalEscrow = leagues.reduce((total, league) => total + league.buy_in * 12, 0);
  const platformFee = totalEscrow * 0.02;
  const distributedPool = totalEscrow - platformFee;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-slate-100">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          @keyframes floatY {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }
          @keyframes panelIn {
            from { opacity: 0; transform: translateY(12px) scale(0.985); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes pulseRing {
            0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.35); }
            100% { box-shadow: 0 0 0 14px rgba(52, 211, 153, 0); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 35s linear infinite;
          }
          .dashboard-grid-glow {
            background-image:
              linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
            background-size: 30px 30px;
          }
          .panel-enter {
            animation: panelIn 280ms ease-out;
          }
          .hover-lift {
            transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          }
          .hover-lift:hover {
            transform: translateY(-4px);
            box-shadow: 0 28px 70px rgba(2, 8, 23, 0.38);
            border-color: rgba(125, 211, 252, 0.22);
          }
          .float-orb {
            animation: floatY 8s ease-in-out infinite;
          }
          .pulse-live {
            animation: pulseRing 1.8s infinite;
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 dashboard-grid-glow opacity-30" />
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl float-orb" />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl float-orb" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl float-orb" />

      <div className="relative z-10 mx-auto max-w-[1680px] px-4 py-4 md:px-6 lg:px-8">
        <header className={`${ui.shell} mb-5 flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="flex items-center gap-4">
            <div className="neon-ring rounded-3xl bg-amber-300 p-3 text-slate-950 shadow-2xl shadow-amber-400/15">
              <Trophy size={26} strokeWidth={2.2} />
            </div>
            <div>
              <div className={ui.eyebrow}>Universal fantasy operating system</div>
              <h1 className="display-font text-2xl font-bold tracking-[0.2em] text-white">LEAGUE DIRECTOR</h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <a href="#platform" className={ui.buttonSecondary}>Platform</a>
            <a href="#design-system" className={ui.buttonSecondary}>Design System</a>
            <button type="button" className={ui.buttonPrimary} onClick={() => setActiveTab('dashboard')}>
              Enter Command Center <ArrowRight size={16} className="ml-2 inline" />
            </button>
          </nav>
        </header>

        <section className="mb-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className={`${ui.shellStrong} hover-lift overflow-hidden p-8`}>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
              <Sparkles size={14} /> Built for infinite sports
            </div>
            <h2 className="display-font max-w-4xl text-5xl font-bold leading-[1.02] text-white md:text-6xl">
              The fantasy league platform that feels like a financial terminal for competition.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Build bespoke scoring systems, operate prize pools, and control real-time match ingestion across motorsport, combat, team sports, and niche formats with one consistent operating surface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#platform" className={ui.buttonPrimary}>Launch live platform</a>
              <button type="button" className={ui.buttonSecondary} onClick={() => setActiveTab('scoring')}>
                Open sandbox
              </button>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <StatCard
                label="Sports Online"
                value={sports.length}
                meta="JSON schema-driven"
                icon={<Layers3 size={20} />}
                tone="border-cyan-300/15 bg-cyan-300/10 text-cyan-200"
              />
              <StatCard
                label="Draftable Entities"
                value={entities.length}
                meta="Individuals, teams, constructors"
                icon={<Users size={20} />}
                tone="border-emerald-300/15 bg-emerald-300/10 text-emerald-200"
              />
              <StatCard
                label="Distributable Pool"
                value={`$${distributedPool.toFixed(0)}`}
                meta="After platform fee"
                icon={<TrendingUp size={20} />}
                tone="border-amber-300/15 bg-amber-300/10 text-amber-200"
              />
            </div>
          </div>

          <div className="grid gap-6">
            <div className={`${ui.shell} hover-lift p-6`}>
              <div className={ui.eyebrow}>Mission profile</div>
              <div className="mt-2 display-font text-2xl font-bold text-white">Commissioner-grade control with creator-grade presentation.</div>
              <div className="mt-5 space-y-3">
                {marketingHighlights.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/7">
                    <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/6 p-3 text-cyan-200">{item.icon}</div>
                    <div>
                      <div className="text-base font-semibold text-white">{item.title}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${ui.shell} hover-lift p-6`} id="design-system">
              <div className={ui.eyebrow}>Design system</div>
              <div className="mt-2 display-font text-2xl font-bold text-white">A repeatable visual language for every future page.</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {designPillars.map((pillar) => (
                  <div key={pillar} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm font-medium text-slate-200">
                    <ChevronRight size={14} className="mr-2 inline text-cyan-300" />
                    {pillar}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-6 lg:grid-cols-3">
          <FeatureCard icon={<BarChart3 size={20} />} title="Bloomberg terminal density" body="More signal per square inch: live scoring, feed health, payout velocity, and rule posture appear together without clutter." />
          <FeatureCard icon={<Zap size={20} />} title="Motion that communicates state" body="Panel transitions, hover elevation, and ambient pulse effects signal what is live, editable, or under review." />
          <FeatureCard icon={<Clock3 size={20} />} title="Operational timeline in view" body="Commissioners can see ingest windows, pending payouts, and league state transitions without leaving the command surface." />
        </section>

        <section id="platform" className={`${ui.shellStrong} p-3`}>
          <div className="mb-3 flex flex-col gap-4 rounded-[26px] border border-white/8 bg-white/4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className={ui.eyebrow}>Live product shell</div>
              <h2 className="display-font text-3xl font-bold text-white">Commissioner Command Surface</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">This is the in-product shell: sidebar taxonomy, dense data widgets, scoring controls, ledger management, and league chat in one unified visual system.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="pulse-live h-3 w-3 rounded-full bg-emerald-300" />
              <span className="text-sm font-medium text-emerald-200">Network live</span>
            </div>
          </div>

          <div className="flex h-[1200px] overflow-hidden">
            <div className="glass-panel-strong z-10 mr-3 flex w-72 flex-col rounded-[28px] border-white/10">
              <div className="border-b border-white/8 p-6">
                <div className="flex items-center space-x-3">
                  <div className="neon-ring rounded-2xl bg-amber-300 p-2.5 text-slate-950 shadow-2xl shadow-amber-400/20">
                    <Trophy size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-300/80">Universal fantasy OS</div>
                    <h1 className="display-font text-xl font-bold tracking-[0.18em] text-slate-50">LEAGUE<br />DIRECTOR</h1>
                  </div>
                </div>
              </div>

              <div className="app-scroll px-4 pb-4 pt-5">
                <div className="mb-4 rounded-2xl border border-white/8 bg-white/4 p-1.5 shadow-inner shadow-slate-950/20">
                  <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Division</div>
                  <div className="flex gap-1">
                    {['Mens', 'Womens', 'Open'].map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setActiveGender(gender)}
                        className={`flex-1 rounded-xl px-2 py-2 text-xs font-semibold transition-all ${activeGender === gender ? 'bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-white/6 hover:text-white'}`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6 rounded-2xl border border-white/8 bg-white/4 p-1.5 shadow-inner shadow-slate-950/20">
                  <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Region</div>
                  <div className="flex gap-1">
                    {['NA', 'Intl', 'Global'].map((region) => (
                      <button
                        key={region}
                        onClick={() => setActiveRegion(region)}
                        className={`flex-1 rounded-xl px-2 py-2 text-xs font-semibold transition-all ${activeRegion === region ? 'bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-white/6 hover:text-white'}`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Sports Engine</div>

                <div className="app-scroll max-h-[30vh] space-y-1 overflow-y-auto pr-2">
                  {Object.entries(sportsCategories).map(([category, data]) => (
                    <div key={category}>
                      <button
                        onClick={() => setExpandedSport(expandedSport === category ? null : category)}
                        className="flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/3 p-3 text-sm font-medium text-slate-200 transition-colors hover:border-white/10 hover:bg-white/7"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-cyan-300">{data.icon}</span>
                          <span>{category}</span>
                        </div>
                        <ChevronDown size={14} className={`transform text-slate-500 transition-transform ${expandedSport === category ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedSport === category && (
                        <div className="space-y-1 py-2 pl-6 pr-2">
                          {data.list.map((sport) => (
                            <button key={sport} className="w-full rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-amber-200">
                              {sport}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto p-4 pt-0">
                <div className="rounded-3xl border border-cyan-300/12 bg-gradient-to-br from-cyan-400/10 via-slate-900/80 to-amber-200/10 p-5 shadow-2xl shadow-cyan-950/30">
                  <div className="mb-2 flex items-center space-x-2">
                    <Shield size={16} className="text-cyan-300" />
                    <span className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">Syndicate Tier</span>
                  </div>
                  <p className="text-sm text-slate-300">Advanced API access, private rooms, and ledger routing are armed for launch.</p>
                </div>
              </div>
            </div>

            <div className="z-10 flex flex-1 flex-col overflow-hidden">
              <header className="glass-panel mb-3 flex h-20 items-center justify-between rounded-[28px] border-white/10 px-8 shadow-2xl shadow-slate-950/30">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.34em] text-slate-500">Live operations</div>
                  <div className="display-font text-2xl font-bold text-white">Command Center</div>
                </div>
                <nav className="flex space-x-2 rounded-2xl border border-white/8 bg-white/4 p-1.5">
                  {appTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-white text-slate-950 shadow-lg shadow-cyan-950/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="flex items-center space-x-3 text-slate-400">
                  <button className="rounded-2xl border border-white/8 bg-white/4 p-3 transition-colors hover:bg-white/8 hover:text-white"><Search size={18} /></button>
                  <button className="rounded-2xl border border-white/8 bg-white/4 p-3 transition-colors hover:bg-white/8 hover:text-white"><Bell size={18} /></button>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/12 font-bold text-cyan-100 shadow-lg shadow-cyan-950/20">CM</div>
                </div>
              </header>

              <main className="app-scroll glass-panel relative flex-1 overflow-y-auto rounded-[28px] border-white/10 p-8 shadow-2xl shadow-slate-950/30">
                <div key={activeTab} className="panel-enter">
                  {activeTab === 'dashboard' && (
                    <div className="mx-auto max-w-7xl space-y-8">
                      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                          <div className={ui.eyebrow}>Season control deck</div>
                          <h2 className="display-font text-4xl font-bold text-white xl:text-5xl">Welcome back, Commissioner.</h2>
                          <p className="mt-3 max-w-3xl text-slate-400">Monitor league operations, audit scoring logic, ingest live match data, and control payout posture from one dense command surface.</p>
                        </div>
                        <div className={`${ui.card} flex min-w-[320px] items-center justify-between px-5 py-4`}>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Network State</div>
                            <div className="mt-2 display-font text-lg font-bold text-white">All feeds nominal</div>
                          </div>
                          <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">LIVE</div>
                        </div>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-4">
                        <StatCard label="Active Leagues" value={leagues.length} meta="+1 this month · IPSC Open" icon={<Trophy size={20} />} tone="border-cyan-300/15 bg-cyan-300/10 text-cyan-200" />
                        <StatCard label="Escrow Total" value={`$${totalEscrow.toLocaleString()}`} meta={`Platform fee 2% · $${platformFee.toFixed(2)}`} icon={<CircleDollarSign size={20} />} tone="border-amber-300/15 bg-amber-300/10 text-amber-200" />
                        <StatCard label="Live Entities" value={Object.keys(leagueScores).length} meta="Real-time scoring across formats" icon={<Users size={20} />} tone="border-emerald-300/15 bg-emerald-300/10 text-emerald-200" />
                        <StatCard label="Rule Density" value={leagueRuleSet.length} meta="Sandbox rules active in selected league" icon={<Settings size={20} />} tone="border-rose-300/15 bg-rose-300/10 text-rose-200" />
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                        <div className={`${ui.card} overflow-hidden`}>
                          <div className="flex items-center justify-between border-b border-white/8 bg-white/4 px-5 py-4">
                            <h3 className="display-font text-2xl font-bold text-white"><Flag className="mr-2 inline text-amber-300" size={20} /> Live & Upcoming Events</h3>
                            <span className={ui.badge}>Roster impact feed</span>
                          </div>
                          <table className="w-full border-collapse text-left">
                            <thead>
                              <tr className="border-b border-white/8 bg-white/4 text-xs uppercase tracking-[0.28em] text-slate-500">
                                <th className="p-4 font-semibold">Sport</th>
                                <th className="p-4 font-semibold">Entity</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Signals</th>
                                <th className="p-4 font-semibold">Score</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/6 text-sm">
                              {liveData.map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-white/4">
                                  <td className="flex items-center space-x-2 p-4"><span>{getSportIcon(item.sport)}</span><span className="font-medium text-slate-200">{item.sport}</span></td>
                                  <td className="p-4 font-medium text-white">{item.entityName}</td>
                                  <td className="p-4"><span className="rounded-full bg-amber-300/12 px-3 py-1 text-xs font-bold tracking-[0.2em] text-amber-200">LIVE</span></td>
                                  <td className="p-4 text-slate-400">{Object.entries(item.raw_stats).map(([key, value]) => `${key}: ${value}`).join(', ')}</td>
                                  <td className="p-4 font-bold text-cyan-200">{leagueScores[item.entityName] ? Number(leagueScores[item.entityName]).toFixed(2) : '0.00'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="grid gap-6">
                          <div className={`${ui.card} p-5`}>
                            <div className="mb-4 flex items-center justify-between">
                              <div>
                                <div className={ui.eyebrow}>Top signal board</div>
                                <h3 className="display-font text-xl font-bold text-white">Live Leaderboard</h3>
                              </div>
                              <Flame size={18} className="text-amber-300" />
                            </div>
                            <div className="space-y-3">
                              {topEntities.map(([name, score], index) => (
                                <div key={name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 hover:bg-white/7">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/7 text-xs font-bold text-cyan-100">{index + 1}</div>
                                    <div>
                                      <div className="font-medium text-white">{name}</div>
                                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Projected finish pressure</div>
                                    </div>
                                  </div>
                                  <div className="display-font text-lg font-bold text-emerald-200">{Number(score).toFixed(2)}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className={`${ui.card} p-5`}>
                            <div className="mb-4 flex items-center justify-between">
                              <div>
                                <div className={ui.eyebrow}>Ingestion matrix</div>
                                <h3 className="display-font text-xl font-bold text-white">Feed Health</h3>
                              </div>
                              <Cpu size={18} className="text-cyan-300" />
                            </div>
                            <div className="space-y-3">
                              {feedHealth.map((item) => (
                                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                                  <div>
                                    <div className="font-medium text-white">{item.name}</div>
                                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.coverage}</div>
                                  </div>
                                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === 'Nominal' ? 'bg-emerald-300/10 text-emerald-200' : 'bg-amber-300/10 text-amber-200'}`}>{item.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr_0.9fr]">
                        <div className={`${ui.card} p-5`}>
                          <div className={ui.eyebrow}>League posture</div>
                          <h3 className="display-font mt-2 text-xl font-bold text-white">Sandbox Coverage</h3>
                          <div className="mt-5 space-y-4">
                            {sports.map((sport) => {
                              const count = leagueRules.filter((rule) => rule.sport === sport.name).length;
                              return (
                                <div key={sport.id}>
                                  <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-300">{sport.name}</span>
                                    <span className="text-cyan-200">{count} rules</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-white/6">
                                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${Math.max(18, count * 22)}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className={`${ui.card} p-5`}>
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <div className={ui.eyebrow}>Operations timeline</div>
                              <h3 className="display-font text-xl font-bold text-white">Command Alerts</h3>
                            </div>
                            <Clock3 size={18} className="text-amber-300" />
                          </div>
                          <div className="space-y-4">
                            {commandAlerts.map((alert) => (
                              <div key={alert.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                                <div className={`text-sm font-semibold ${alert.tone}`}>{alert.title}</div>
                                <p className="mt-2 text-sm leading-6 text-slate-400">{alert.body}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`${ui.card} p-5`}>
                          <div className={ui.eyebrow}>Commissioner view</div>
                          <h3 className="display-font mt-2 text-xl font-bold text-white">Active League Stack</h3>
                          <div className="mt-5 space-y-3">
                            {leagues.map((league) => (
                              <div key={league.id} className="rounded-2xl border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/7">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-white">{league.name}</div>
                                  <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">{league.status}</span>
                                </div>
                                <div className="mt-2 text-sm text-slate-400">{league.sport} · Buy-in ${league.buy_in} · Commissioner {league.commissioner}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'scoring' && (
                    <div className="mx-auto max-w-6xl space-y-8">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                          <div className={ui.eyebrow}>Scoring architecture</div>
                          <h2 className="display-font text-4xl font-bold text-white">Scoring Sandbox</h2>
                          <p className="mt-3 text-slate-400">Build flexible, sport-specific rules with shared primitives. Conditions, point weights, and raw JSON ingestion remain consistent everywhere.</p>
                        </div>
                        <div className={`${ui.card} px-5 py-4`}>
                          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Schema coverage</div>
                          <div className="mt-2 display-font text-xl font-bold text-white">{sports.reduce((sum, sport) => sum + sport.stat_schema.length, 0)} live stat keys</div>
                        </div>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className={`${ui.card} p-6`}>
                          <h3 className="display-font mb-4 text-xl font-bold text-white">Rule Composer</h3>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-5 md:items-end">
                            <select value={newRule.league_id} onChange={(event) => setNewRule({ ...newRule, league_id: event.target.value })} className={ui.input}>
                              {leagues.map((league) => (
                                <option key={league.id} value={league.id}>{league.name}</option>
                              ))}
                            </select>
                            <input type="text" placeholder="Action key (JSON field)" value={newRule.action_key} onChange={(event) => setNewRule({ ...newRule, action_key: event.target.value })} className={ui.input} />
                            <input type="text" placeholder="Description" value={newRule.description} onChange={(event) => setNewRule({ ...newRule, description: event.target.value })} className={ui.input} />
                            <input type="number" placeholder="Points" value={newRule.point_value} onChange={(event) => setNewRule({ ...newRule, point_value: event.target.value })} className={ui.input} />
                            <input type="text" placeholder="Condition JSON" value={newRule.condition} onChange={(event) => setNewRule({ ...newRule, condition: event.target.value })} className={ui.input} />
                            <button onClick={handleAddRule} className={`md:col-span-5 ${ui.buttonPrimary}`}>
                              <Plus size={18} className="mr-2 inline" /> Add Rule
                            </button>
                          </div>
                        </div>

                        <div className={`${ui.card} p-6`}>
                          <div className={ui.eyebrow}>Available schemas</div>
                          <h3 className="display-font mt-2 text-xl font-bold text-white">Sport Definitions</h3>
                          <div className="mt-4 space-y-4">
                            {sports.map((sport) => (
                              <div key={sport.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-medium text-white">{sport.name}</span>
                                  <span className={ui.badge}>{sport.category}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {sport.stat_schema.map((stat) => (
                                    <span key={stat} className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-slate-300">{stat}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                        <div>
                          <h3 className="display-font mb-4 text-xl font-bold text-white">Active Logic Engine</h3>
                          <div className="space-y-3">
                            {leagueRuleSet.map((rule) => (
                              <div key={rule.id} className={`${ui.card} hover-lift flex items-center justify-between p-4`}>
                                <div className="flex items-center space-x-4">
                                  <span className={ui.badge}>{rule.sport}</span>
                                  <span className="text-slate-300">
                                    If <strong className="text-white">{rule.action_key}</strong> then <strong className="text-white">{rule.point_value}</strong> points per unit
                                  </span>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                  <span className="text-xs text-slate-500">Condition: {rule.condition ? JSON.stringify(rule.condition) : 'none'}</span>
                                  <span className="text-xl font-bold text-amber-200">{evaluateRuleForStats(rule, { [rule.action_key]: 1 })} / unit</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`${ui.card} p-6`}>
                          <h3 className="display-font mb-3 text-xl font-bold text-white">Manual Match Ingestion</h3>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <input type="text" placeholder="Match ID" value={manualStatUpdate.match_id} onChange={(event) => setManualStatUpdate({ ...manualStatUpdate, match_id: event.target.value })} className={ui.input} />
                            <input type="text" placeholder="Entity Name" value={manualStatUpdate.entityName} onChange={(event) => setManualStatUpdate({ ...manualStatUpdate, entityName: event.target.value })} className={ui.input} />
                            <select value={manualStatUpdate.sport} onChange={(event) => setManualStatUpdate({ ...manualStatUpdate, sport: event.target.value })} className={ui.input}>
                              {sports.map((sport) => <option key={sport.id} value={sport.name}>{sport.name}</option>)}
                            </select>
                            <input type="text" placeholder="Stats JSON e.g. {&quot;fastest_lap&quot;:1}" value={manualStatUpdate.raw_stats} onChange={(event) => setManualStatUpdate({ ...manualStatUpdate, raw_stats: event.target.value })} className={ui.input} />
                          </div>
                          <button onClick={handleManualStatSave} className={`${ui.buttonPrimary} mt-4`}>Save Match Stats</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ledger' && (
                    <div className="mx-auto max-w-6xl space-y-8">
                      <div>
                        <div className={ui.eyebrow}>Financial operations</div>
                        <h2 className="display-font mt-2 text-4xl font-bold text-white">League Ledger</h2>
                        <p className="mt-3 text-slate-400">Automated buy-ins, escrow posture, and payout projections stay visible inside the same interface that runs the competition.</p>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                        <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/12 bg-gradient-to-br from-slate-950 via-sky-950/90 to-slate-900 p-6 shadow-2xl shadow-cyan-950/30">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.14),transparent_34%)]" />
                          <div className="absolute right-0 top-0 p-4 text-cyan-300/15"><DollarSign size={100} /></div>
                          <div className="relative z-10">
                            <h3 className="mb-1 text-sm font-medium text-cyan-100">{selectedLeague.name}</h3>
                            <div className="mb-2 display-font text-6xl font-bold text-amber-200">${(selectedLeague.buy_in * 12).toFixed(2)}</div>
                            <p className="text-sm font-medium text-slate-200">Estimated in Escrow (12 participants)</p>
                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                              <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">1st Place</div>
                                <div className="mt-2 text-2xl font-bold text-white">${((selectedLeague.buy_in * 12) * 0.6).toFixed(2)}</div>
                              </div>
                              <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">2nd Place</div>
                                <div className="mt-2 text-2xl font-bold text-white">${((selectedLeague.buy_in * 12) * 0.3).toFixed(2)}</div>
                              </div>
                              <div className="rounded-2xl border border-white/8 bg-white/6 p-4">
                                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">3rd Place</div>
                                <div className="mt-2 text-2xl font-bold text-white">${((selectedLeague.buy_in * 12) * 0.1).toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-6">
                          <div className={`${ui.card} p-6`}>
                            <div className={ui.eyebrow}>Post-fee settlement</div>
                            <div className="mt-2 display-font text-3xl font-bold text-white">${distributedPool.toFixed(2)}</div>
                            <p className="mt-2 text-sm text-slate-400">Available for transfers after a ${platformFee.toFixed(2)} platform fee.</p>
                          </div>
                          <div className={`${ui.card} p-6`}>
                            <div className={ui.eyebrow}>Payout status</div>
                            <h3 className="display-font mt-2 text-xl font-bold text-white">Manager Status</h3>
                            <div className="mt-4 space-y-4">
                              {[
                                { name: 'Mike (Commish)', status: 'Paid', amount: '$100' },
                                { name: 'Sarah', status: 'Paid', amount: '$100' },
                                { name: 'Dave', status: 'Pending', amount: '$100' },
                                { name: 'Alex', status: 'Paid', amount: '$100' },
                              ].map((member) => (
                                <div key={member.name} className="flex items-center justify-between border-b border-white/6 pb-3 last:border-0 last:pb-0">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8 text-xs font-bold text-cyan-100">{member.name.charAt(0)}</div>
                                    <span className="text-sm font-medium text-slate-200">{member.name}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-white">{member.amount}</span>
                                    {member.status === 'Paid' ? (
                                      <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">PAID</span>
                                    ) : (
                                      <button className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950 transition hover:bg-cyan-200">Send Reminder</button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'chat' && (
                    <div className="mx-auto max-w-5xl space-y-8">
                      <div>
                        <div className={ui.eyebrow}>Live room</div>
                        <h2 className="display-font mt-2 text-4xl font-bold text-white">Trash Talk Terminal</h2>
                        <p className="mt-3 text-slate-400">Real-time rivalry, league coordination, and commissioner updates live in a chat environment that matches the operating tone of the rest of the product.</p>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.55fr]">
                        <div className="glass-panel mx-auto flex h-[70vh] flex-col overflow-hidden rounded-[28px]">
                          <div className="flex items-center justify-between border-b border-white/8 bg-white/4 p-4">
                            <h3 className="display-font font-bold text-white">Trash Talk Terminal</h3>
                            <span className={ui.badge}>F1 Constructors League</span>
                          </div>

                          <div className="app-scroll flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,rgba(15,23,42,0.4),rgba(2,6,23,0.6))] p-6">
                            <div className="max-w-[80%] rounded-2xl rounded-tl-none border border-white/8 bg-white/6 p-4 shadow-lg shadow-slate-950/20">
                              <span className="mb-1 block text-xs font-bold text-cyan-200">Dave</span>
                              <p className="text-sm text-slate-200">Are we really giving 10 points for fastest pitstop? Red Bull is going to auto-win.</p>
                            </div>
                            <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-none border border-cyan-300/15 bg-cyan-300/12 p-4 shadow-lg shadow-cyan-950/20">
                              <span className="mb-1 block text-xs font-bold text-cyan-100">You (Commish)</span>
                              <p className="text-sm text-white">Too bad. Draft better mechanics.</p>
                            </div>
                            <div className="max-w-[80%] rounded-2xl rounded-tl-none border border-white/8 bg-white/6 p-4 shadow-lg shadow-slate-950/20">
                              <span className="mb-1 block text-xs font-bold text-amber-200">Sarah</span>
                              <p className="text-sm text-slate-200">I'm trading Hamilton for Alonso right now. Don't veto it Mike.</p>
                            </div>
                          </div>

                          <div className="flex space-x-2 border-t border-white/8 bg-white/4 p-4">
                            <input type="text" placeholder="Talk your trash..." className={`flex-1 ${ui.input}`} />
                            <button className="rounded-2xl bg-amber-300 px-5 py-2 font-bold text-slate-950 transition-colors hover:bg-amber-200">Send</button>
                          </div>
                        </div>

                        <div className="grid gap-6">
                          <div className={`${ui.card} p-6`}>
                            <div className={ui.eyebrow}>Room state</div>
                            <h3 className="display-font mt-2 text-xl font-bold text-white">Live Presence</h3>
                            <div className="mt-4 space-y-3">
                              {['Mike', 'Sarah', 'Dave', 'Alex'].map((member) => (
                                <div key={member} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-300 pulse-live" />
                                    <span className="text-sm font-medium text-white">{member}</span>
                                  </div>
                                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">online</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className={`${ui.card} p-6`}>
                            <div className={ui.eyebrow}>Room energy</div>
                            <h3 className="display-font mt-2 text-xl font-bold text-white">Heat Meter</h3>
                            <div className="mt-4 rounded-3xl border border-white/8 bg-white/4 p-5">
                              <div className="mb-3 flex items-center justify-between text-sm">
                                <span className="text-slate-300">Rivalry intensity</span>
                                <span className="font-bold text-amber-200">81%</span>
                              </div>
                              <div className="h-3 rounded-full bg-white/6">
                                <div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 via-amber-300 to-rose-300" style={{ width: '81%' }} />
                              </div>
                              <p className="mt-4 text-sm leading-6 text-slate-400">Trade chatter, payout timing, and rules debate are all elevated. Perfect for an animated commissioner update.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </main>

              <div className="glass-panel mt-3 flex h-12 shrink-0 items-center overflow-hidden rounded-[22px] border-white/10 shadow-2xl shadow-slate-950/30">
                <div className="animate-marquee absolute flex items-center space-x-8 whitespace-nowrap text-sm font-bold tracking-[0.18em] text-slate-200">
                  <span className="flex items-center"><Activity size={14} className="mr-2 text-amber-300" /> NFL: Chiefs blockbuster trade confirmed</span>
                  <span className="text-cyan-300/60">•</span>
                  <span className="flex items-center"><Car size={14} className="mr-2 text-amber-300" /> F1: Verstappen takes pole at Monaco</span>
                  <span className="text-cyan-300/60">•</span>
                  <span className="flex items-center"><Swords size={14} className="mr-2 text-amber-300" /> UFC 300: Pereira retains title via KO R1</span>
                  <span className="text-cyan-300/60">•</span>
                  <span className="flex items-center"><Target size={14} className="mr-2 text-amber-300" /> IPSC: Team USA secures Gold in Open Division</span>
                  <span className="text-cyan-300/60">•</span>
                  <span className="flex items-center"><Medal size={14} className="mr-2 text-amber-300" /> GOLF: Scheffler leads by 3 heading into Sunday</span>
                  <span className="text-cyan-300/60">•</span>
                  <span className="flex items-center"><Car size={14} className="mr-2 text-amber-300" /> WEC: Ferrari leading Le Mans at Hour 12</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LeagueDirectorApp;
