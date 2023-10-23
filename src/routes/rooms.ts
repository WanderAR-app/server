import { Router } from "express";
import db from "../database/mariadb";

const RoomsRouter: Router = Router();

RoomsRouter.get("/", async (req, res) => {
  const userId = req.body.decoded.id;
  const locationId = req.body.locationId;

  if (!userId) return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query("SELECT * FROM room WHERE location_id = ?", [
      locationId,
    ]);

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

RoomsRouter.post("/", async (req, res) => {
  const location_id = req.body.locationId;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  const geometry = req.body.geometry;
  const map_tile_id = req.body.mapTileId;

  if (!location_id || !name || !x || !y || !geometry || !map_tile_id)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "INSERT INTO room (location_id, name, x, y, geometry, map_tile_id) VALUES (?, ?, ?, ?, ?, ?)",
      [location_id, name, x, y, geometry, map_tile_id]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

RoomsRouter.put("/", async (req, res) => {
  const id = req.body.id;
  const location_id = req.body.locationId;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  const geometry = req.body.geometry;
  const map_tile_id = req.body.mapTileId;

  if (!id || !location_id || !name || !x || !y || !geometry || !map_tile_id)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "UPDATE room SET location_id = ?, name = ?, x = ?, y = ?, geometry = ?, map_tile_id = ? WHERE id = ?",
      [location_id, name, x, y, geometry, map_tile_id, id]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

RoomsRouter.delete("/", async (req, res) => {
  const id = req.body.id;
  const location_id = req.body.locationId;

  if (!id || !location_id)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "DELETE FROM room WHERE id = ? AND location_id = ?",
      [id, location_id]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default RoomsRouter;
