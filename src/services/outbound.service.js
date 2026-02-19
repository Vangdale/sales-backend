export function getOutboundUrl(deal) {
    // Caso 1: afiliado propio
    if (deal.is_affiliate === 1 && deal.affiliate_url) {
        return deal.affiliate_url;
    }

    // Caso 2: fallback CheapShark
    return `https://www.cheapshark.com/redirect?dealID=${deal.deal_id}`;
}