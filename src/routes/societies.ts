/**
 * @swagger
 * tags:
 *   name: Societies
 *   description: Societies managing API
 * /societies:
 *   get:
 *    summary: Get all societies
 *    tags: [Societies]
 *    responses:
 *     200:
 *      description: The list of societies
 *      content:
 *       application/json:
 *        schema:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *            id:
 *             type: integer
 *             description: The society ID
 *            name:
 *             type: string
 *             description: The society name
 *     500:
 *      description: Internal server error
 * 
 *   post:
 *    summary: Create a new society
 *    tags: [Societies]
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *         name:
 *          type: string
 *          description: The society name
 *    responses:
 *     200:
 *      description: The society was successfully created
 *     400:
 *      description: Invalid request
 *     500:
 *      description: Internal server error
 * 
 * /societies/{id}:
 *   get:
 *    summary: Get a society by ID
 *    tags: [Societies]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *        required: true
 *        description: The society ID
 *    responses:
 *     200:
 *      description: The society description by ID
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          id:
 *           type: integer
 *           description: The society ID
 *          name:
 *           type: string
 *           description: The society name
 *     500:
 *      description: Internal server error
 * 
 *   put:
 *    summary: Update a society by ID
 *    tags: [Societies]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *        required: true
 *        description: The society ID
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *         name:
 *          type: string
 *          description: The society name
 *    responses:
 *     200:
 *      description: The society was successfully updated
 *     400:
 *      description: Invalid request
 *     500:
 *      description: Internal server error
 * 
 *   delete:
 *    summary: Delete a society by ID
 *    tags: [Societies]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *        required: true
 *        description: The society ID
 *    responses:
 *     200:
 *      description: The society was successfully deleted
 *     500:
 *      description: Internal server error
 *    
 */

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
        return res.status(500).json({ message: "Internal server error", err });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const rows = await db.query("SELECT * FROM society WHERE id = ?", id);
        return res.status(200).json(rows);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error", err });
    }
});

router.post("/", async (req, res) => {
    const name = req.body.name;

    console.log(name);

    if (!name) return res.status(401).json({ message: "Invalid request" });

    try {
        const rows = await db.query(
            "INSERT INTO society (name) VALUES (?);",
            name
        );
        return res.status(200).json({ message: "Society created" });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error: ", err });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const rows = await db.query("DELETE FROM society WHERE id = ?", id);
        
        if (rows.affectedRows === 0) return res.status(404).json({ message: "Society not found" });
        return res.status(200).json({ message: "Society deleted" });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error", err });
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
        
        if (rows.affectedRows === 0) return res.status(404).json({ message: "Society not found" });
        return res.status(200).json({ message: "Society updated" });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;