export function getOutboundUrl(deal) {
    // Caso 1: afiliado propio

    // Caso 2: fallback CheapShark
    return `https://www.cheapshark.com/redirect?dealID=${deal.id}`;
}