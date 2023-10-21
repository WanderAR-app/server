import { Router } from "express";
import db from "../../database/mariadb";

const FavoriteRouter: Router = Router();

FavoriteRouter.get("/", async (req, res) => {
  const userId = req.body.decoded.id;
  const locationId = req.body.locationId;

  if (!userId) return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "SELECT * FROM user_favorites WHERE user_id = ? AND location_id = ?",
      [userId, locationId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

FavoriteRouter.post("/", async (req, res) => {
  const userId = req.body.decoded.id;
  const locationId = req.body.locationId;
  const pinPointId = req.body.pinPointId;

  if (!userId || !locationId)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "INSERT INTO user_favorites (user_id, location_id, pin_point_id) VALUES (?, ?, ?)",
      [userId, locationId, pinPointId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

FavoriteRouter.delete("/", async (req, res) => {
  const userId = req.body.decoded.id;
  const locationId = req.body.locationId;
  const pinPointId = req.body.pinPointId;

  if (!userId || !locationId)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "DELETE FROM user_favorites WHERE user_id = ? AND location_id = ? AND pin_point_id = ?",
      [userId, locationId, pinPointId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default FavoriteRouter;
