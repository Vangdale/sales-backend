import { randomUUID } from 'crypto';
import { STORE_MAP } from "../config/stores.js";
import { AFFILIATE_BUILDERS } from "../config/affiliateBuilders.js";


export function normalizeDeal(deal) {

    const storeInfo = STORE_MAP[deal.storeID] ?? {
        key: "unknown",
        affiliate: false,
    };
    
    const builder = AFFILIATE_BUILDERS[storeInfo.key];
    const affiliateUrl = storeInfo.affiliate && builder ? builder(deal) : null;

    // return {
    //     id: randomUUID(),
    //     dealId: deal.dealID,
    //     title: deal.title,
    //     price: Number(deal.salePrice),
    //     originalPrice: Number(deal.normalPrice),
    //     storeID: deal.storeID,
    //     redirectSlug: randomUUID(),
    //     createdAt: new Date().toISOString(),
    //     dealRating: deal.dealRating,
    //     steamAppID: deal.steamAppID,
    // };

    return {
        id: randomUUID(),
        dealId: deal.dealID,
        title: deal.title,
        price: Number(deal.salePrice),
        originalPrice: Number(deal.normalPrice),
        storeID: deal.storeID,
        storeKey: storeInfo.key,
        steamAppID: deal.steamAppID || deal.gameInfo?.steamAppID || null,
        redirectSlug: randomUUID(),
        affiliateUrl,
        isAffiliate: Boolean(affiliateUrl),
        createdAt: new Date().toISOString(),
        is_active: 1,
    };
}