-- PostgreSQL schema for League Director
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS sports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  stat_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'player',
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commissioner_id UUID REFERENCES users(id),
  sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  buy_in NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Drafting',
  payout_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS draft_picks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  pick_number INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rule_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  description TEXT,
  rules JSONB NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scoring_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  action_key TEXT NOT NULL,
  point_value NUMERIC(12,4) NOT NULL,
  condition JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  sport_id UUID REFERENCES sports(id) ON DELETE SET NULL,
  raw_stats JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (match_id, entity_id)
);

CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  recipient_id UUID,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_transfer_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  operator_id UUID REFERENCES users(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
