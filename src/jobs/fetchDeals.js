import { normalizeDeal } from "../utils/normalizeDeal.js";
import { upsertDeal, updateActive } from "../db/deals.repository.js";

const API_URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15';

export async function runFetchDeals() {
    try {
        updateActive();

        //const response = await fetch(API_URL);
        const response = await fetch(API_URL, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            }
        });


        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const normalized = data.map(normalizeDeal);

        normalized.forEach(upsertDeal);

        console.log("Deals actualizados correctamente");
        return true;

    } catch (error) {
        console.error("Error al actualizar deals:", error);
        return false;
    }
}