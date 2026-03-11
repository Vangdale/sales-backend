import db from "./index.js";
import { randomUUID } from "crypto";

export function upsertGame(game) {

    const existing = db.prepare(`
        SELECT id FROM games WHERE slug = ?
    `).get(game.slug);

    if (existing) {
        return existing.id;
    }

    const id = randomUUID();

    db.prepare(`
        INSERT INTO games (id,title,slug,steamAppID,metacriticScore,imageUrl)
        VALUES (?,?,?,?,?,?)
    `).run(
        id,
        game.title,
        game.slug,
        game.steamAppID,
        game.metacriticScore,
        game.imageUrl
    );

    return id;
}

export function upsertDeal(deal) {

    db.prepare(`
        INSERT INTO deals
        (id,game_id,store_id,price,original_price,redirect_slug,is_active,last_seen)
        VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
    `).run(
        randomUUID(),
        deal.game_id,
        deal.store_id,
        deal.price,
        deal.original_price,
        deal.redirect_slug,
        deal.is_active
    );
}

export function getAllDeals() {
    return db.prepare(`
        SELECT
            d.id,
            d.price,
            d.original_price,
            ROUND(
            (d.original_price - d.price) * 100.0 / d.original_price
            ) AS discountPercent,
            d.store_id,
            d.redirect_slug,
            d.clicks,

            g.title,
            g.metacriticScore,
            g.imageUrl,
            g.steamAppID

        FROM deals d
        JOIN games g ON g.id = d.game_id
        WHERE d.is_active = 1
    `).all();
}

export function findBySlug(slug) {
    return db
        .prepare("SELECT * FROM deals WHERE redirect_slug = ?")
        .get(slug);
}

export function updateAffiliateUrl(id, url) {
    return db
        .prepare("UPDATE deals SET affiliate_url = ? WHERE id = ?")
        .run(url, id);
}

export function incrementClick(slug) {
    return db
        .prepare("UPDATE deals SET clicks = clicks + 1 WHERE redirect_slug = ?")
        .run(slug);
}

export function updateActive() {
    return db.prepare("UPDATE deals SET is_active = 0 WHERE is_active = 1").run();
}

export function getDealByDealRating() {
    return db.prepare("SELECT * FROM deals WHERE is_active = 1 AND metacriticScore IS NOT NULL ORDER BY metacriticScore DESC LIMIT 6").all();
}