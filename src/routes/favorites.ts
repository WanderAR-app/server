import { Router } from "express";
import db from "../database/mariadb";

const FavoriteRouter: Router = Router();

FavoriteRouter.get("/", async (req, res) => {
  const userId = req.body.decoded.id;
  const locationId = req.body.locationId;

  if (!userId) return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      `SELECT f.* 
      FROM favorite AS f 
      INNER JOIN pin_point AS pp ON f.pin_point_id = pp.id 
      INNER JOIN room AS r ON pp.room_id = r.id 
      WHERE f.user_id = ? AND r.location_id = ?;`,
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
  const pinPointId = req.body.pinPointId;

  if (!userId || !pinPointId)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const pin_point = await db.query(
      "SELECT * FROM pin_point WHERE id = ?",
      pinPointId
    );
    if (pin_point.length == 0)
      return res.status(400).json({ message: "Invalid request" });

    const rows = await db.query(
      "INSERT INTO user_favorites (user_id, pin_point_id) VALUES (?, ?);",
      [userId, pinPointId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

FavoriteRouter.delete("/", async (req, res) => {
  const userId = req.body.decoded.id;
  const pinPointId = req.body.pinPointId;

  if (!userId || !pinPointId)
    return res.status(400).json({ message: "Invalid request" });

  try {
    const rows = await db.query(
      "DELETE FROM user_favorites WHERE user_id = ? AND pin_point_id = ?",
      [userId, pinPointId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default FavoriteRouter;
