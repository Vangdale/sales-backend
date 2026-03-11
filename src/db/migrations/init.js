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
        id UUID PRIMARY KEY,
        game_id UUID REFERENCES games(id),
        store_id INTEGER,
        price NUMERIC,
        original_price NUMERIC,
        redirect_slug TEXT UNIQUE,
        is_active BOOLEAN DEFAULT true,
        clicks INTEGER DEFAULT 0,
        last_seen TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);