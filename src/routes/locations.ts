import { Router } from "express";
import db from "../database/mariadb";
import logger from "../utils/logger";

const router: Router = Router();

router.get("/societies/:id/locations", async (req, res) => {
    const id = req.params.id;

    try {
        const rows = await db.query("SELECT * FROM location WHERE society_id = ?", id);
        return res.status(200).json(rows);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/societies/:id/locations/:locId", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;

    try {
        const rows = await db.query("SELECT * FROM location WHERE society_id = ? AND id = ?", [id, locId]);
        return res.status(200).json(rows);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/societies/:id/locations", async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const mapId = req.body.mapId;

    if (!name) return res.status(400).json({ message: "Invalid request" });

    try {
        const rows = await db.query(
            "INSERT INTO location (name, society_id) VALUES (?, ?);",
            [name, id]
        );
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/societies/:id/locations/:locId", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;

    try {
        const rows = await db.query("DELETE FROM location WHERE id = ? AND society_id = ?", [locId, id]);
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/societies/:id/locations/:locId", async (req, res) => {
    const id = req.params.id;
    const locId = req.params.locId;
    const name = req.body.name;
    const mapId = req.body.mapId;

    if (!name) return res.status(400).json({ message: "Invalid request" });

    try {
        const rows = await db.query(
            "UPDATE location SET name = ? WHERE id = ? AND society_id = ?;",
            [name, locId, id]
        );
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;