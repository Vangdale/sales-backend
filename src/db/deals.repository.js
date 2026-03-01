import db from "./index.js";

// export function insertDeal(deal) {
//     const stmt = db.prepare(`
//         INSERT OR IGNORE INTO deals (
//             id,
//             deal_id,
//             title,
//             price,
//             original_price,
//             store_id,
//             store_key,
//             redirect_slug,
//             affiliate_url,
//             is_affiliate,
//             created_at,
//             dealRating,
//             steamAppID,
//             is_active
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `);

//     stmt.run(
//         deal.id,
//         deal.dealId,
//         deal.title,
//         deal.price,
//         deal.originalPrice,
//         deal.storeID,
//         deal.storeKey,
//         deal.redirectSlug,
//         deal.affiliateUrl,
//         deal.isAffiliate ? 1 : 0,
//         deal.createdAt,
//         deal.dealRating,
//         deal.steamAppID,
//         deal.isActive ? 1 : 0
//     );
// }
export function upsertDeal(deal) {
    const stmt = db.prepare(`
        INSERT INTO deals (
            id,
            deal_id,
            title,
            price,
            original_price,
            store_id,
            store_key,
            steamAppID,
            redirect_slug,
            dealRating,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            price = excluded.price,
            original_price = excluded.original_price,
            dealRating = excluded.dealRating,
            title = excluded.title
    `);

    stmt.run(
        deal.id,
        deal.dealId,
        deal.title,
        deal.price,
        deal.originalPrice,
        deal.storeID,
        deal.storeKey,
        deal.steamAppID,
        deal.redirectSlug,
        deal.dealRating,
        deal.createdAt
    );
}


export function getAllDeals() {
    return db.prepare("SELECT * FROM deals WHERE is_active = 1 order by title asc").all();
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

export function updateActive(){
    return db.prepare("UPDATE deals SET is_active = 0 WHERE is_active = 1").run();
}