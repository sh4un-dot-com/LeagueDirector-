import React, { useMemo, useState } from 'react';
import {
  Trophy, Settings, DollarSign, MessageSquare,
  Users, Shield, Activity, ChevronDown,
  Search, Bell, Plus, Car, Swords, Target, Flag, CircleDollarSign,
  Medal, Gamepad2
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
  'Motorsport': { icon: <Car size={18} />, list: ['F1', 'NASCAR', 'IndyCar', 'MotoGP', 'WEC', 'WRC Rally', 'Supercross'] },
  'Combat': { icon: <Swords size={18} />, list: ['UFC / MMA', 'Boxing', 'WWE', 'Jiu-Jitsu', 'Olympic Wrestling', 'Kickboxing'] },
  'Individual & Racing': { icon: <Medal size={18} />, list: ['Golf', 'Tennis', 'Track & Field', 'Cycling', 'Swimming', 'Horse Racing'] },
  'Esports & Niche': { icon: <Gamepad2 size={18} />, list: ['Esports', 'IPSC Shooting', 'Darts', 'Snooker', 'Bowling', 'Pickleball'] },
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
  total = total * conditionMultiplier;

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

  const selectedLeague = leagues.find((l) => l.id === newRule.league_id) || leagues[0];

  const leagueRuleSet = useMemo(() => leagueRules.filter((rule) => !rule.league_id || rule.league_id === selectedLeague?.id), [leagueRules, selectedLeague]);

  const leagueScores = useMemo(() => {
    const scores = {};
    liveData.forEach((match) => {
      const matchingRules = leagueRuleSet.filter((rule) => rule.sport === match.sport);
      if (!matchingRules.length) return;

      const score = matchingRules.reduce((agg, rule) => agg + evaluateRuleForStats(rule, match.raw_stats), 0);
      scores[match.entityName] = Number((scores[match.entityName] || 0) + score).toFixed(2);
    });
    return scores;
  }, [liveData, leagueRuleSet]);

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

    setLeagueRules((prev) => [...prev, created]);
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

    setLiveData((prev) => {
      const existing = prev.find((p) => p.match_id === manualStatUpdate.match_id && p.entityName === manualStatUpdate.entityName);
      if (existing) {
        return prev.map((p) => (p.id === existing.id ? { ...p, raw_stats: stats, sport: manualStatUpdate.sport } : p));
      }
      return [...prev, { id: genId(), match_id: manualStatUpdate.match_id || genId(), entity_id: null, entityName: manualStatUpdate.entityName || 'New Entity', sport: manualStatUpdate.sport, raw_stats: stats }];
    });

    setManualStatUpdate({ match_id: '', entityName: '', sport: 'F1', raw_stats: '{}' });
  };

  const totalEscrow = leagues.reduce((total, league) => total + league.buy_in * 12, 0); // placeholder
  const platformFee = totalEscrow * 0.02;
  const distributedPool = totalEscrow - platformFee;

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans overflow-hidden">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 35s linear infinite;
          }
        `}
      </style>

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-50 border-r border-slate-300 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-yellow-500 p-2 rounded-lg text-blue-900 shadow-sm">
            <Trophy size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-blue-900 tracking-wider">LEAGUE<br />DIRECTOR</h1>
        </div>

        <div className="px-4 pb-4">
          <div className="flex bg-slate-200 rounded-lg p-1 mb-4 shadow-inner">
            {['Mens', 'Womens', 'Open'].map((g) => (
              <button
                key={g}
                onClick={() => setActiveGender(g)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeGender === g ? 'bg-blue-700 text-white shadow' : 'text-slate-600 hover:text-blue-800'}`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-200 rounded-lg p-1 mb-6 shadow-inner">
            {['NA', 'Intl', 'Global'].map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeRegion === r ? 'bg-purple-700 text-white shadow' : 'text-slate-600 hover:text-purple-800'}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Sports Engine</div>

          <div className="space-y-1 overflow-y-auto max-h-[30vh] pr-2 custom-scrollbar">
            {Object.entries(sportsCategories).map(([category, data]) => (
              <div key={category}>
                <button
                  onClick={() => setExpandedSport(expandedSport === category ? null : category)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium text-slate-700"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-700">{data.icon}</span>
                    <span>{category}</span>
                  </div>
                  <ChevronDown size={14} className={`transform transition-transform text-slate-400 ${expandedSport === category ? 'rotate-180' : ''}`} />
                </button>

                {expandedSport === category && (
                  <div className="pl-10 pr-2 py-1 space-y-1">
                    {data.list.map((sport) => (
                      <button key={sport} className="w-full text-left text-xs py-1.5 text-slate-500 hover:text-purple-700 font-medium transition-colors">
                        {sport}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4">
          <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-200 shadow-sm rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield size={16} className="text-purple-600" />
              <span className="text-xs font-bold text-purple-700 uppercase">Syndicate Tier</span>
            </div>
            <p className="text-xs text-slate-500">Advanced API access & ledger routing enabled.</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-300 flex items-center justify-between px-8 z-10 shadow-sm">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Command Center', icon: <Activity size={18} /> },
              { id: 'scoring', label: 'Scoring Sandbox', icon: <Settings size={18} /> },
              { id: 'ledger', label: 'League Ledger', icon: <DollarSign size={18} /> },
              { id: 'chat', label: 'Trash Talk', icon: <MessageSquare size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 text-sm font-semibold transition-colors border-b-2 py-5 ${activeTab === tab.id ? 'border-yellow-500 text-blue-800' : 'border-transparent text-slate-500 hover:text-blue-700'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4 text-slate-500">
            <Search size={18} className="hover:text-blue-700 cursor-pointer transition-colors" />
            <Bell size={18} className="hover:text-blue-700 cursor-pointer transition-colors" />
            <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center border border-slate-300 text-blue-900 font-bold text-sm shadow-sm">CM</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-white">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-blue-900 mb-8">Welcome back, Commissioner.</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Active Leagues</p>
                      <h3 className="text-3xl font-bold text-slate-800 mt-1">{leagues.length}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><Trophy size={20} /></div>
                  </div>
                  <div className="text-xs text-purple-600 font-medium">+1 this month (IPSC Open)</div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Ledger Escrow Total</p>
                      <h3 className="text-3xl font-bold text-slate-800 mt-1">${totalEscrow.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg border border-yellow-100"><CircleDollarSign size={20} /></div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Platform fee 2%: ${platformFee.toFixed(2)}</div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Live Entities Scored</p>
                      <h3 className="text-3xl font-bold text-slate-800 mt-1">{Object.keys(leagueScores).length}</h3>
                    </div>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-200"><Users size={20} /></div>
                  </div>
                  <div className="text-xs text-purple-600 font-medium">Real-time scoring for multiple sports.</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-blue-900 mt-10 mb-4 flex items-center"><Flag className="mr-2 text-yellow-500" size={20} /> Live & Upcoming Events</h3>
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                      <th className="p-4 font-semibold">Sport</th>
                      <th className="p-4 font-semibold">Event</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">My Roster Impact</th>
                      <th className="p-4 font-semibold">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {liveData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 flex items-center space-x-2">{item.sport === 'F1' ? <Car size={16} className="text-blue-600" /> : item.sport === 'UFC / MMA' ? <Swords size={16} className="text-purple-600" /> : <Target size={16} className="text-blue-600" />}<span className="font-medium text-slate-700">{item.sport}</span></td>
                        <td className="p-4 text-slate-800 font-medium">{item.entityName}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">LIVE</span></td>
                        <td className="p-4 text-slate-600">{Object.entries(item.raw_stats).map(([k, v]) => `${k}: ${v}`).join(', ')}</td>
                        <td className="p-4 text-slate-700 font-bold">{leagueScores[item.entityName] ? Number(leagueScores[item.entityName]).toFixed(2) : '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'scoring' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-2">Scoring Sandbox</h2>
                <p className="text-slate-500">Design universal scoring logic across any sport. Rules process in real-time from JSON stat feeds.</p>
              </div>

              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Add / Update Rule</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <select
                    value={newRule.league_id}
                    onChange={(e) => setNewRule({ ...newRule, league_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                  >
                    {leagues.map((league) => (
                      <option key={league.id} value={league.id}>{league.name}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Action key (JSON field)"
                    value={newRule.action_key}
                    onChange={(e) => setNewRule({ ...newRule, action_key: e.target.value })}
                    className="bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                  />

                  <input
                    type="text"
                    placeholder="Description"
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    className="bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                  />

                  <input
                    type="number"
                    placeholder="Points (per unit)"
                    value={newRule.point_value}
                    onChange={(e) => setNewRule({ ...newRule, point_value: e.target.value })}
                    className="bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                  />

                  <input
                    type="text"
                    placeholder='condition JSON (e.g. {"multiplier":2})'
                    value={newRule.condition}
                    onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                    className="bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm"
                  />

                  <button
                    onClick={handleAddRule}
                    className="col-span-1 md:col-span-5 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Plus size={18} className="mr-1" /> Add Rule
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-4">Active Logic Engine</h3>
              <div className="space-y-3">
                {leagueRuleSet.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between bg-white border border-slate-200 shadow-sm p-4 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <span className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{rule.sport}</span>
                      <span className="text-slate-600">
                        If <strong className="text-blue-900">{rule.action_key}</strong> then <strong className="text-blue-900">{rule.point_value}</strong> points per unit
                      </span>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs text-slate-400">Condition: {rule.condition ? JSON.stringify(rule.condition) : 'none'}</span>
                      <span className="text-xl font-bold text-yellow-500">{evaluateRuleForStats(rule, { [rule.action_key]: 1 })} / unit</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Live Match Data Ingestion (Manual Override)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Match ID"
                    value={manualStatUpdate.match_id}
                    onChange={(e) => setManualStatUpdate({ ...manualStatUpdate, match_id: e.target.value })}
                    className="bg-white border border-slate-300 rounded-lg px-4 py-2 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Entity Name"
                    value={manualStatUpdate.entityName}
                    onChange={(e) => setManualStatUpdate({ ...manualStatUpdate, entityName: e.target.value })}
                    className="bg-white border border-slate-300 rounded-lg px-4 py-2 outline-none"
                  />
                  <select
                    value={manualStatUpdate.sport}
                    onChange={(e) => setManualStatUpdate({ ...manualStatUpdate, sport: e.target.value })}
                    className="bg-white border border-slate-300 rounded-lg px-4 py-2 outline-none"
                  >
                    {sports.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <input
                    type="text"
                    placeholder='Stats JSON e.g. {"fastest_lap":1}'
                    value={manualStatUpdate.raw_stats}
                    onChange={(e) => setManualStatUpdate({ ...manualStatUpdate, raw_stats: e.target.value })}
                    className="bg-white border border-slate-300 rounded-lg px-4 py-2 outline-none"
                  />
                </div>
                <button
                  onClick={handleManualStatSave}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold transition-colors"
                >
                  Save Match Stats
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-2">League Ledger</h2>
                <p className="text-slate-500">Automated buy-ins, escrow, and payouts via Stripe Connect simulation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-800 to-blue-900 border border-blue-700 shadow-lg rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-20 text-blue-400"><DollarSign size={100} /></div>
                  <h3 className="text-sm font-medium text-blue-200 mb-1 relative z-10">{selectedLeague.name || 'Sample League'}</h3>
                  <div className="text-5xl font-bold text-yellow-400 mb-2 relative z-10">${(selectedLeague.buy_in * 12).toFixed(2)}</div>
                  <p className="text-sm text-white font-medium relative z-10">Estimated in Escrow (12 participants)</p>

                  <div className="mt-6 space-y-2 relative z-10">
                    <div className="flex justify-between text-sm"><span className="text-blue-200">1st Place (60%)</span><span className="text-white font-bold">${((selectedLeague.buy_in * 12) * 0.6).toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-blue-200">2nd Place (30%)</span><span className="text-white font-bold">${((selectedLeague.buy_in * 12) * 0.3).toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-blue-200">3rd Place (10%)</span><span className="text-white font-bold">${((selectedLeague.buy_in * 12) * 0.1).toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Manager Status</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Mike (Commish)', status: 'Paid', amount: '$100' },
                      { name: 'Sarah', status: 'Paid', amount: '$100' },
                      { name: 'Dave', status: 'Pending', amount: '$100' },
                      { name: 'Alex', status: 'Paid', amount: '$100' },
                    ].map((member, i) => (
                      <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-blue-900">{member.name.charAt(0)}</div>
                          <span className="text-slate-700 font-medium text-sm">{member.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-800 font-bold text-sm">{member.amount}</span>
                          {member.status === 'Paid' ? (
                            <span className="bg-purple-100 text-purple-700 border border-purple-200 text-xs px-2 py-1 rounded font-bold">PAID</span>
                          ) : (
                            <button className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded font-bold transition shadow-sm">Send Reminder</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="max-w-3xl mx-auto h-[70vh] flex flex-col bg-white border border-slate-300 shadow-sm rounded-2xl overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-blue-900 font-bold">Trash Talk Terminal</h3>
                <span className="text-xs text-purple-700 bg-purple-100 border border-purple-200 px-2 py-1 rounded font-medium">F1 Constructors League</span>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                <div className="bg-white p-3 rounded-xl max-w-[80%] rounded-tl-none border border-slate-200 shadow-sm">
                  <span className="text-xs text-purple-700 font-bold mb-1 block">Dave</span>
                  <p className="text-sm text-slate-700">Are we really giving 10 points for fastest pitstop? Red Bull is going to auto-win.</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl max-w-[80%] ml-auto rounded-tr-none border border-blue-200 shadow-sm">
                  <span className="text-xs text-blue-800 font-bold mb-1 block">You (Commish)</span>
                  <p className="text-sm text-slate-800">Too bad. Draft better mechanics. 🏎️💨</p>
                </div>
                <div className="bg-white p-3 rounded-xl max-w-[80%] rounded-tl-none border border-slate-200 shadow-sm">
                  <span className="text-xs text-yellow-600 font-bold mb-1 block">Sarah</span>
                  <p className="text-sm text-slate-700">I'm trading Hamilton for Alonso right now. Don't veto it Mike.</p>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-200 flex space-x-2">
                <input
                  type="text"
                  placeholder="Talk your trash..."
                  className="flex-1 bg-white border border-slate-300 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none placeholder-slate-400 text-sm shadow-sm"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm">Send</button>
              </div>
            </div>
          )}
        </main>

        <div className="h-10 bg-blue-900 border-t border-blue-800 flex items-center overflow-hidden relative z-20 shrink-0 shadow-inner">
          <div className="absolute whitespace-nowrap animate-marquee flex items-center space-x-8 text-sm font-bold tracking-wider text-white">
            <span className="flex items-center"><Activity size={14} className="text-yellow-400 mr-2" /> NFL: Chiefs blockbuster trade confirmed</span>
            <span className="text-purple-400">•</span>
            <span className="flex items-center"><Car size={14} className="text-yellow-400 mr-2" /> F1: Verstappen takes pole at Monaco</span>
            <span className="text-purple-400">•</span>
            <span className="flex items-center"><Swords size={14} className="text-yellow-400 mr-2" /> UFC 300: Pereira retains title via KO R1</span>
            <span className="text-purple-400">•</span>
            <span className="flex items-center"><Target size={14} className="text-yellow-400 mr-2" /> IPSC: Team USA secures Gold in Open Division</span>
            <span className="text-purple-400">•</span>
            <span className="flex items-center"><Medal size={14} className="text-yellow-400 mr-2" /> GOLF: Scheffler leads by 3 heading into Sunday</span>
            <span className="text-purple-400">•</span>
            <span className="flex items-center"><Car size={14} className="text-yellow-400 mr-2" /> WEC: Ferrari leading Le Mans at Hour 12</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDirectorApp;
