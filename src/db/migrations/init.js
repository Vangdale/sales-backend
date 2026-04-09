import db from "../index.js";

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        steamAppID INTEGER,
        metacriticScore INTEGER,
        imageUrl TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        game_id TEXT NOT NULL,
        store_id INTEGER,
        price REAL,
        original_price REAL,
        redirect_slug TEXT UNIQUE,
        clicks INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        last_seen TEXT
);
`);

db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_game_store ON deals(game_id, store_id);");

