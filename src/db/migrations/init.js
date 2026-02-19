import db from "../index.js";

db.exec(`
    CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        deal_id TEXT,
        title TEXT NOT NULL,

        price REAL NOT NULL,
        original_price REAL NOT NULL,

        store_id INTEGER,
        store_key TEXT,

        steamAppID TEXT,

        redirect_slug TEXT UNIQUE,

        is_affiliate INTEGER DEFAULT 0,
        affiliate_url TEXT,

        dealRating REAL,

        clicks INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,

        is_active INTEGER DEFAULT 1
    );
`);
