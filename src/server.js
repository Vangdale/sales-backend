import express from "express";
import cors from "cors";
import "./db/migrations/init.js";

import {
    findBySlug,
    incrementClick,
    getAllDeals
} from "./db/deals.repository.js";

import { getOutboundUrl } from "./services/outbound.service.js";
import { runFetchDeals } from "./jobs/fetchDeals.js";
import { upsertDeal, updateActive } from "./db/deals.repository.js";




const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));

app.use(express.json());

// endpoint para redirigir
app.get("/r/:slug", (req, res) => {
    const { slug } = req.params;

    const deal = findBySlug(slug);

    if (!deal) {
        return res.status(404).send("Deal no encontrado");
    }

    // registrar click
    incrementClick(slug);

    // decidir URL final
    const redirectUrl = getOutboundUrl(deal);

    return res.redirect(302, redirectUrl);
});

//endpoint para obtener todas las ofertas
app.get("/api/deals", async (req, res) => {
    const { maxPrice, minDiscount, sort } = req.query;
    let deals = getAllDeals();

    // Filtrar por precio máximo
    if (maxPrice) {
        deals = deals.filter(d => d.price <= Number(maxPrice));
    }

    // Filtrar por descuento mínimo
    if (minDiscount) {
        deals = deals.filter(d => {
            if (!d.original_price || d.original_price <= d.price) return false;
            const discount = ((d.original_price - d.price) / d.original_price) * 100;
            return discount >= Number(minDiscount);
        });
    }

    // Ordenar
    if (sort === "discount") {
        deals.sort((a, b) => {
            const discA = a.original_price ? (a.original_price - a.price) / a.original_price : 0;
            const discB = b.original_price ? (b.original_price - b.price) / b.original_price : 0;
            return discB - discA;
        });
    }

    //formatear los datos y calcular el porcentaje de descuento
    const formatted = deals.map((deal) => {
        const discountPercent =
            deal.original_price && deal.original_price > deal.price
                ? Math.round(
                    ((deal.original_price - deal.price) / deal.original_price) * 100
                ) : 0;

        return {
            id: deal.id,
            title: deal.title,
            price: deal.price,
            originalPrice: deal.original_price,
            storeID: deal.store_id,
            slug: deal.redirect_slug,
            clicks: deal.clicks,
            steamAppID: deal.steamAppID,
            imageUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${deal.steamAppID}/header.jpg`,
            discountPercent,
        };
    });

    return res.json(formatted);
});



//este endpoint hace que se bloquee la ip de momento, usar cuando no haya bloqueo de ip, mientras tanto usar /admin/import para importar los deals con proxy en ip local
app.post("/admin/fetch", async (req, res) => {
    const result = await runFetchDeals();
    res.json({ success: result });
});


app.post("/admin/import", (req, res) => {
    try {
        const deals = req.body;

        if (!Array.isArray(deals)) {
            return res.status(400).json({ error: "Formato inválido" });
        }

        // marcar todos como inactivos primero
        updateActive();

        deals.forEach(upsertDeal);

        return res.json({
            success: true,
            imported: deals.length
        });

    } catch (error) {
        console.error("Error importando deals:", error);
        return res.status(500).json({ success: false });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


