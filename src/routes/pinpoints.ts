import { Router } from "express";
import db from "../database/mariadb";

const PinPointsRouter: Router = Router();

PinPointsRouter.get("/", async (req, res) => {
  const userId = req.body.decoded.id;
  const locationId = req.body.locationId;

  if (!userId) return res.status(400).json({ message: "Invalid request" });

  try {
    const query = `SELECT pp.* 
      FROM pin_point AS pp 
      INNER JOIN room AS r ON pp.room_id = r.id
      WHERE r.location_id = ?`;
    const rows = await db.query(query, [locationId]);
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PinPointsRouter.get("/rooms", async (req, res) => {
//   const userId = req.body.decoded.id;
//   const locationId = req.body.locationId;

//   if (!userId) return res.status(400).json({ message: "Invalid request" });

//   try {
//     const query = `SELECT pp.*
//       FROM pin_point AS pp
//       INNER JOIN room AS r ON pp.room_id = r.id
//       INNER JOIN type AS t ON pp.type_id = t.id
//       WHERE r.location_id = ?
//       AND (LOWER(t.name) = 'room')`;
//     const rows = await db.query(query, [locationId]);
//     return res.status(200).json(rows);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

PinPointsRouter.post("/", async (req, res) => {
  const location_id = req.body.locationId;
  const room_id = req.body.roomId;
  const type_name = req.body.typeName;
  const category_name = req.body.categoryName;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  const is_destination = req.body.isDestination;

  if (!location_id || !room_id || !type_name || !category_name || !name)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const room = await db.query(
      "SELECT * FROM room WHERE id = ? AND location_id = ?",
      [room_id, location_id]
    );
    if (room.length != 1)
      return res.status(400).json({ message: "Invalid request" });

    const type = await db.query("SELECT * FROM type WHERE name = ?", [
      type_name,
    ]);
    if (type.length != 1)
      return res.status(400).json({ message: "Invalid request" });

    const category = await db.query("SELECT * FROM category WHERE name = ?", [
      category_name,
    ]);
    if (category.length != 1)
      return res.status(400).json({ message: "Invalid request" });

    const rows = await db.query(
      "INSERT INTO pin_point (room_id, x, y, destination, type_id, category_id) VALUES (?, ?, ?, ?, ?, ?)",
      [room_id, x, y, is_destination, type[0].id, category[0].id]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

PinPointsRouter.delete("/", async (req, res) => {
  const location_id = req.body.locationId;
  const id = req.body.id;

  if (!location_id || !id)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "DELETE FROM pin_point WHERE id = ? AND room_id IN (SELECT id FROM room WHERE location_id = ?)",
      [id, location_id]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

PinPointsRouter.put("/", async (req, res) => {
  const location_id = req.body.locationId;
  const id = req.body.id;
  const room_id = req.body.roomId;
  const type_name = req.body.typeName;
  const category_name = req.body.categoryName;
  const name = req.body.name;
  const x = req.body.x;
  const y = req.body.y;
  const is_destination = req.body.isDestination;

  if (!location_id || !id || !room_id || !type_name || !category_name || !name)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const room = await db.query(
      "SELECT * FROM room WHERE id = ? AND location_id = ?",
      [room_id, location_id]
    );
    if (room.length != 1)
      return res.status(400).json({ message: "Invalid request" });

    const type = await db.query("SELECT * FROM type WHERE name = ?", [
      type_name,
    ]);
    if (type.length != 1)
      return res.status(400).json({ message: "Invalid request" });

    const category = await db.query("SELECT * FROM category WHERE name = ?", [
      category_name,
    ]);
    if (category.length != 1)
      return res.status(400).json({ message: "Invalid request" });

    const rows = await db.query(
      "UPDATE pin_point SET room_id = ?, x = ?, y = ?, destination = ?, type_id = ?, category_id = ? WHERE id = ?",
      [room_id, x, y, is_destination, type[0].id, category[0].id, id]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default PinPointsRouter;
