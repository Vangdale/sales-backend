import express from "express";
import cors from "cors";
import "./db/migrations/init.js";

import {
    findBySlug,
    incrementClick,
    getAllDeals,
    upsertDeal,
    upsertGame,
    updateActive,
    getDealByDealRating,
    debug
} from "./db/deals.repository.js";

import { getOutboundUrl } from "./services/outbound.service.js";
import { runFetchDeals } from "./jobs/fetchDeals.js";
import { formatDeal } from "./services/dealFormatter.js";


const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));

app.use(express.json({ limit: "10mb" }));

// endpoint para redirigir
app.get("/r/:redirect_slug", (req, res) => {
    const { redirect_slug } = req.params;

    const deal = findBySlug(redirect_slug);

    if (!deal) {
        return res.status(404).send("Deal no encontrado");
    }

    // registrar click
    incrementClick(redirect_slug);

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

    if (req.query.store) {
        deals = deals.filter(d => d.store_id === Number(req.query.store));
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
            upsertGame(item.game);

            upsertDeal({
                ...item.deal
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

    //const topMetacritic = deals.map(formatDeal);

    res.json(deals);

});


//debug
app.get("/debug/deals", (req, res) => {
    const rows = debug();
    res.json(rows);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


