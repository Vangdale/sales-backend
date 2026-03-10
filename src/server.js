import express from "express";
import cors from "cors";
import "./db/migrations/init.js";

import {
    findBySlug,
    incrementClick,
    getAllDeals,
    upsertDeal,
    updateActive,
    getDealByDealRating
} from "./db/deals.repository.js";

import { getOutboundUrl } from "./services/outbound.service.js";
import { runFetchDeals } from "./jobs/fetchDeals.js";
import { formatDeal } from "./services/dealFormatter.js";


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
    let deals = getAllDeals();

    if (req.query.maxPrice) {
        deals = deals.filter(d => d.price <= Number(req.query.maxPrice));
    }

    if (req.query.minDiscount) {
        deals = deals.filter(d => d.discountPercent >= Number(req.query.minDiscount));
    }

    res.json(deals);
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

        // deals.forEach(upsertDeal);

        for (const item of deals) {
            const gameId = upsertGame(item.game);

            upsertDeal({
                ...item.deal,
                game_id: gameId
            });
        }

        return res.json({
            success: true,
            imported: deals.length
        });

    } catch (error) {
        console.error("Error importando deals:", error);
        return res.status(500).json({ success: false });
    }
});


app.get("/api/home", (req, res) => {
    
    const deals = getDealByDealRating();

    const topMetacritic = deals.map(formatDeal);

    return res.json({
        topMetacritic
    });

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


