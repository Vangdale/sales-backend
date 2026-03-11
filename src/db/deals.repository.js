import db from "./index.js";
import { randomUUID } from "crypto";

export function upsertGame(game) {

    const id = randomUUID();

    db.prepare(`
        INSERT INTO games (id,title,slug,steamAppID,metacriticScore,imageUrl)
        VALUES (?,?,?,?,?,?)

        ON CONFLICT(slug)
        DO UPDATE SET
            title = excluded.title,
            steamAppID = excluded.steamAppID,
            metacriticScore = excluded.metacriticScore,
            imageUrl = excluded.imageUrl
    `).run(
        id,
        game.title,
        game.slug,
        game.steamAppID,
        game.metacriticScore,
        game.imageUrl
    );

    return db.prepare(`
        SELECT id FROM games WHERE slug = ?
    `).get(game.slug).id;
}

export function upsertDeal(deal) {

    db.prepare(`
        INSERT INTO deals
        (id,game_id,store_id,price,original_price,redirect_slug,is_active,last_seen)
        VALUES (?,?,?,?,?,?,1,CURRENT_TIMESTAMP)

        ON CONFLICT(redirect_slug)
        DO UPDATE SET
            price = excluded.price,
            original_price = excluded.original_price,
            store_id = excluded.store_id,
            game_id = excluded.game_id,
            is_active = 1,
            last_seen = CURRENT_TIMESTAMP
    `).run(
        randomUUID(),
        deal.game_id,
        deal.store_id,
        deal.price,
        deal.original_price,
        deal.redirect_slug
    );
}

export function getAllDeals() {
    return db.prepare(`
        SELECT
            d.id,
            d.price,
            d.original_price,
            CASE
                WHEN d.original_price > 0
                THEN ROUND((d.original_price - d.price) * 100.0 / d.original_price)
                ELSE 0
            END AS discountPercent,
            d.store_id,
            d.redirect_slug,
            d.clicks,
            d.is_active,

            g.title,
            g.metacriticScore,
            g.imageUrl,
            g.steamAppID,
            g.slug

        FROM deals d
        JOIN games g ON g.id = d.game_id
        WHERE d.is_active = 1
    `).all();
}

export function findBySlug(redirect_slug) {
    return db
        .prepare("SELECT * FROM deals WHERE redirect_slug = ?")
        .get(redirect_slug);
}

// export function updateAffiliateUrl(id, url) {
//     return db
//         .prepare("UPDATE deals SET affiliate_url = ? WHERE id = ?")
//         .run(url, id);
// }

export function incrementClick(slug) {
    return db
        .prepare("UPDATE deals SET clicks = clicks + 1 WHERE redirect_slug = ?")
        .run(slug);
}

export function updateActive() {
    return db.prepare("UPDATE deals SET is_active = 0 WHERE is_active = 1").run();
}

// export function getDealByDealRating() {
//     return db.prepare("SELECT * FROM deals WHERE is_active = 1 AND metacriticScore IS NOT NULL ORDER BY metacriticScore DESC LIMIT 6").all();
// }