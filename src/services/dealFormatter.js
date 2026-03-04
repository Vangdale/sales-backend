export function formatDeal(deal) {
    const discountPercent =
        deal.original_price && deal.original_price > deal.price
            ? Math.round(
                ((deal.original_price - deal.price) / deal.original_price) * 100
            )
            : 0;

    return {
        id: deal.id,
        title: deal.title,
        price: deal.price,
        originalPrice: deal.original_price,
        storeID: deal.store_id,
        slug: deal.redirect_slug,
        clicks: deal.clicks,
        steamAppID: deal.steamAppID,
        metacriticScore: deal.metacriticScore,
        imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${deal.steamAppID}/header.jpg`,
        discountPercent,
    };
    
}