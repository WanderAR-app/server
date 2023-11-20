import { Router } from "express";
import db from "../database/mariadb";
import logger from "../utils/logger";

const router: Router = Router();

router.get("/societies/:id/locations/:locId/categories", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;

    try {
        const rows = await db.query("SELECT * FROM category WHERE location_id = ?", [locId]);
        return res.status(200).json(rows);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/societies/:id/locations/:locId/categories/:catId", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;
    const catId = req.params.catId;

    try {
        const rows = await db.query("SELECT * FROM category WHERE location_id = ? AND id = ?", [locId, catId]);
        return res.status(200).json(rows);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/societies/:id/locations/:locId/categories", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;

    const name = req.body.name;
    const color = req.body.color;

    if (!name || !color) return res.status(400).json({ message: "Invalid request" });

    try {
        const rows = await db.query(
            "INSERT INTO category (name, color, location_id) VALUES (?, ?, ?);",
            [name, color, locId]
        );
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/societies/:id/locations/:locId/categories/:catId", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;
    const catId = req.params.catId;

    const name = req.body.name;
    const color = req.body.color;

    if (!name || !color) return res.status(400).json({ message: "Invalid request" });

    try {
        const rows = await db.query(
            "UPDATE category SET name = ?, color = ? WHERE id = ? AND location_id = ?;",
            [name, color, catId, locId]
        );
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/societies/:id/locations/:locId/categories/:catId", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;
    const catId = req.params.catId;

    try {
        const rows = await db.query("DELETE FROM category WHERE id = ? AND location_id = ?", [catId, locId]);
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;