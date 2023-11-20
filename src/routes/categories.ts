/**
 * @swagger
 * tags: [Categories]
 * name: Categories
 * description: Categories managing API
 * /societies/{id}/locations/{locId}/categories:
 *  get:
 *    summary: Get all categories of a location
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The society ID
 *      - in: path
 *        name: locId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The location ID
 *    responses:
 *     200:
 *      description: The list of categories
 *     500:
 *      description: Internal server error
 * 
 *  post:
 *    summary: Create a new category
 *    tags: [Categories]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The society ID
 *      - in: path
 *        name: locId
 *        schema:
 *          type: integer
 *        required: true
 *        description: The location ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *          required:
 *           - name
 *           - color
 *          properties:
 *           name:
 *             type: string
 *             description: The category name
 *           color:
 *            type: string
 *            description: The category color
 *    responses:
 *     200:
 *      description: Successfully created
 *     500:
 *      description: Internal server error 
 * 
 * /societies/{id}/locations/{locId}/categories/{catId}:
 *   get:
 *     summary: Get a category of a location
 *     tags: [Categories]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: The society ID
 *        - in: path
 *          name: locId
 *          schema:
 *            type: integer
 *          required: true
 *          description: The location ID
 *        - in: path
 *          name: catId
 *          schema:
 *            type: integer
 *          required: true
 *          description: The category ID
 *     responses:
 *       200:
 *         description: The category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The category ID
 *                 name:
 *                   type: string
 *                   description: The category name
 *                 color:
 *                   type: string
 *                   description: The category color
 *                 location_id:
 *                   type: integer
 *                   description: The location ID
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *          required: true
 *          description: The society ID
 *        - in: path
 *          name: locId
 *          schema:
 *            type: integer
 *          required: true
 *          description: The location ID
 *        - in: path
 *          name: catId
 *          schema:
 *            type: integer
 *          required: true
 *          description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           required:
 *            - name
 *            - color
 *           properties:
 *            name:
 *              type: string
 *              description: The category name
 *            color:
 *             type: string
 *             description: The category color
 *     responses:
 *      200:
 *       description: Successfully updated
 *      500:
 *       description: Internal server error
 * 
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           required: true
 *           description: The society ID
 *         - in: path
 *           name: locId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The location ID
 *         - in: path
 *           name: catId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The category ID
 *     responses:
 *      200:
 *       description: Successfully deleted
 *      500:
 *       description: Internal server error
 * 
 */

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