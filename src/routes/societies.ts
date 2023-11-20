import { Router } from "express";
import db from "../database/mariadb";
import logger from "../utils/logger";

const router: Router = Router();

router.get("/", async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM society");
        return res.status(200).json(rows);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const rows = await db.query("SELECT * FROM society WHERE id = ?", id);
        return res.status(200).json(rows);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    const name = req.body.name;

    console.log(name);

    if (!name) return res.status(400).json({ message: "Invalid request" });

    try {
        const rows = await db.query(
            "INSERT INTO society (name) VALUES (?);",
            name
        );
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const rows = await db.query("DELETE FROM society WHERE id = ?", id);
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;

    if (!name) return res.status(400).json({ message: "Invalid request" });

    try {
        const rows = await db.query(
            "UPDATE society SET name = ? WHERE id = ?",
            [name, id]
        );
        return res.status(200).send();
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;