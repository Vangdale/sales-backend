import { randomUUID } from 'crypto';
import slugify from "slugify";
import { STORE_MAP } from "../config/stores.js";
import { AFFILIATE_BUILDERS } from "../config/affiliateBuilders.js";


// export function normalizeDeal(deal) {

//     // const storeInfo = STORE_MAP[deal.storeID] ?? {
//     //     key: "unknown",
//     //     affiliate: false,
//     // };



//     // const builder = AFFILIATE_BUILDERS[storeInfo.key];
//     // const affiliateUrl = storeInfo.affiliate && builder ? builder(deal) : null;

//     return {
//         id: randomUUID(),
//         dealId: deal.dealID,
//         title: deal.title,
//         price: Number(deal.salePrice),
//         originalPrice: Number(deal.normalPrice),
//         storeID: deal.storeID,
//         storeKey: storeInfo.key,
//         steamAppID: deal.steamAppID || deal.gameInfo?.steamAppID || null,
//         redirectSlug: randomUUID(),
//         affiliateUrl,
//         isAffiliate: Boolean(affiliateUrl),
//         createdAt: new Date().toISOString(),
//         is_active: 1,
//     };
// }

export function normalizeDeal(raw) {

    const imageUrl = raw.steamAppID
        ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${raw.steamAppID}/header.jpg`
        : "/placeholder.jpg";

    const game = {
        title: raw.title,
        slug: slugify(raw.title, {
            lower: true,
            strict: true
        }),
        steamAppID: raw.steamAppID || null,
        metacriticScore: Number(raw.metacriticScore) || 0,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
    };

    const deal = {
        storeID: Number(raw.storeID),
        price: Number(raw.salePrice),
        originalPrice: Number(raw.normalPrice),
        redirectSlug: randomUUID(),
        is_active: 1,
    };

    return { game, deal };

};