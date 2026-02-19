import { AFFILIATE_IDS } from "./affiliateIds.js";

export const AFFILIATE_BUILDERS = {
    fanatical: (deal) =>
        `https://www.fanatical.com/en/search?search=${encodeURIComponent(
            deal.title
        )}&ref=${AFFILIATE_IDS.fanatical}`,

    eneba: (deal) =>
        `https://www.eneba.com/store/all?text=${encodeURIComponent(
            deal.title
        )}&af_id=${AFFILIATE_IDS.eneba}`,

    humble: (deal) =>
        `https://www.humblebundle.com/store/search?search=${encodeURIComponent(
            deal.title
        )}&partner=${AFFILIATE_IDS.humble}`,

    greenmangaming: (deal) =>
        `https://www.greenmangaming.com/search/${encodeURIComponent(
            deal.title
        )}/?tap_a=${AFFILIATE_IDS.greenmangaming}`,

    instantgaming: (deal) =>
        `https://www.instant-gaming.com/en/search/?q=${encodeURIComponent(
            deal.title
        )}&igr=${AFFILIATE_IDS.instantgaming}`,
};
