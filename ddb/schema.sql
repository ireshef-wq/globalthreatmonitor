-- Global Threat Monitor (GTM) - D1 schema (v0.1)

-- Sensors registry (optional for v1, useful once ingestion expands beyond USGS)
CREATE TABLE IF NOT EXISTS sensors (
  sensor_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  format TEXT NOT NULL,        -- RSS, API_JSON, CAP_XML, GEOJSON, etc.
  region TEXT NOT NULL,        -- Global, Europe, NA, APAC, etc.
  base_reliability REAL NOT NULL DEFAULT 0.7,
  poll_interval_sec INTEGER NOT NULL DEFAULT 900,
  is_enabled INTEGER NOT NULL DEFAULT 1
);

-- Raw items index (raw payloads live in KV; this table enables audit/debugging)
CREATE TABLE IF NOT EXISTS raw_items (
  raw_id TEXT PRIMARY KEY,
  sensor_id TEXT NOT NULL,
  source_item_id TEXT NOT NULL,
  published_at TEXT,
  fetched_at TEXT NOT NULL,
  canonical_url TEXT,
  title TEXT,
  summary TEXT,
  raw_kv_key TEXT NOT NULL,
  text_hash TEXT,
  UNIQUE(sensor_id, source_item_id)
);
CREATE INDEX IF NOT EXISTS idx_raw_sensor_time ON raw_items(sensor_id, fetched_at);

-- Normalized, queryable events
CREATE TABLE IF NOT EXISTS events (
  event_id TEXT PRIMARY KEY,
  primary_type TEXT NOT NULL,
  category TEXT NOT NULL,
  secondary_types TEXT,          -- JSON array string
  severity INTEGER NOT NULL,     -- 1..5
  confidence REAL NOT NULL,      -- 0..1

  lat REAL,
  lon REAL,
  bbox TEXT,                     -- JSON string (optional)
  geohash TEXT,

  region TEXT,
  country_code TEXT,
  place_name TEXT,

  event_start_at TEXT,
  event_end_at TEXT,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',

  summary TEXT,
  incident_fingerprint TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_time ON events(updated_at);
CREATE INDEX IF NOT EXISTS idx_events_type_time ON events(primary_type, updated_at);
CREATE INDEX IF NOT EXISTS idx_events_geohash_time ON events(geohash, updated_at);
CREATE INDEX IF NOT EXISTS idx_events_fingerprint ON events(incident_fingerprint);

-- Link events to their contributing raw items/sensors
CREATE TABLE IF NOT EXISTS event_sources (
  event_id TEXT NOT NULL,
  raw_id TEXT NOT NULL,
  sensor_id TEXT NOT NULL,
  source_item_id TEXT NOT NULL,
  url TEXT,
  PRIMARY KEY (event_id, raw_id)
);
CREATE INDEX IF NOT EXISTS idx_event_sources_event ON event_sources(event_id);
