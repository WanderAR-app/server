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

export default FavoriteRouter;
