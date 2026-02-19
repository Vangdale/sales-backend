import db from "../index.js";

db.exec(`
    ALTER TABLE deals ADD COLUMN affiliate_url TEXT;
`);

db.exec(`
    ALTER TABLE deals ADD COLUMN clicks INTEGER DEFAULT 0;
`); 