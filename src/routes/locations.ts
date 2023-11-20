/**
 * @swagger
 * tags:
 *  name: Locations
 *  description: Locations managing API
 * /societies/{id}/locations:
 *  get:
 *   summary: Get all locations of a society
 *   tags: [Locations]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: integer
 *       required: true
 *       description: The society ID
 *   responses:
 *    200:
 *     description: The list of locations
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          id:
 *            type: integer
 *            description: The location ID
 *          name:
 *           type: string
 *           description: The location name
 *          society_id:
 *           type: integer
 *           description: The society ID
 *    500:
 *     description: Internal server error
 * 
 *  post:
 *    summary: Create a new location
 *    tags: [Locations]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *         type: integer
 *         required: true
 *         description: The society ID
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema: 
 *        type: object
 *        required:
 *         - name
 *        properties:
 *         name:
 *          type: string
 *          description: The location name
 *    responses:
 *     200:
 *      description: The location was successfully created
 *     400:
 *      description: Invalid request
 *     500:
 *      description: Internal server error
 * 
 * /societies/{id}/locations/{locId}:
 *   get:
 *    summary: Get a location by ID
 *    tags: [Locations]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *        required: true
 *        description: The society ID
 *     - in: path
 *       name: locId
 *       schema:
 *        type: integer
 *        required: true
 *        description: The location ID
 *    responses:
 *     200:
 *      description: The location description by ID
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          id:
 *           type: integer
 *           description: The location ID
 *          name:
 *           type: string
 *           description: The location name
 *          society_id:
 *           type: integer
 *           description: The society ID
 *     500:
 *      description: Internal server error
 * 
 *   delete:
 *    summary: Delete a location by ID
 *    tags: [Locations]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *        required: true
 *        description: The society ID
 *     - in: path
 *       name: locId
 *       schema:
 *        type: integer
 *        required: true
 *        description: The location ID
 *    responses:
 *     200:
 *      description: The location was successfully deleted
 *     500:
 *      description: Internal server error
 * 
 *   put:
 *    summary: Update a location by ID
 *    tags: [Locations]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *        type: integer
 *        required: true
 *        description: The society ID
 *     - in: path
 *       name: locId
 *       schema:
 *        type: integer
 *        required: true
 *        description: The location ID
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema: 
 *        type: object
 *        required:
 *         - name
 *        properties:
 *         name:
 *          type: string
 *          description: The location name
 *    responses:
 *     200:
 *      description: The location was successfully updated
 *     400:
 *      description: Invalid request
 *     500:
 *      description: Internal server error
 * 
 */

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