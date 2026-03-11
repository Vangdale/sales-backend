import { randomUUID } from 'crypto';
import slugify from "slugify";

export function normalizeDeal(raw) {

    const imageUrl = raw.steamAppID
    ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${raw.steamAppID}/header.jpg`
    : "/placeholder.jpg";

    const game = {
        title: raw.title,
        slug: slugify(raw.title),
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

    return {  game , deal };

};