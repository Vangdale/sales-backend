import db from "../index.js";

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        steamAppID INTEGER,
        metacriticScore INTEGER,
        imageUrl TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

db.exec(`
    CREATE TABLE deals (
        id TEXT PRIMARY KEY,
        game_id TEXT NOT NULL,
        store_id TEXT,
        price REAL,
        original_price REAL,
        redirect_slug TEXT UNIQUE,
        clicks INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        last_seen TEXT
);
`);

db.exec("CREATE INDEX idx_redirect_slug ON deals(redirect_slug);");