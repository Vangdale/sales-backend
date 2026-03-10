import db from "../index.js";

// db.exec(`
//     CREATE TABLE IF NOT EXISTS deals (
//         id TEXT PRIMARY KEY,
//         deal_id TEXT,
//         title TEXT NOT NULL,

//         price REAL NOT NULL,
//         original_price REAL NOT NULL,

//         store_id INTEGER,
//         store_key TEXT,

//         steamAppID TEXT,

//         redirect_slug TEXT UNIQUE,

//         is_affiliate INTEGER DEFAULT 0,
//         affiliate_url TEXT,

//         dealRating REAL,
//         metacriticScore INTEGER,

//         clicks INTEGER DEFAULT 0,
//         created_at TEXT DEFAULT CURRENT_TIMESTAMP,

//         img_url TEXT,

//         is_active INTEGER DEFAULT 1
//     );
// `);

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE,
        steamAppID INTEGER,
        metacriticScore INTEGER,
        imageUrl TEXT,
        created_at TIMESTAMP DEFAULT NOW()
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
        last_seen TIMESTAMP DEFAULT NOW()
    );
`);