import express from "express";
import cors from "cors";
import listRoutes from "./routes/lists.js";
import cardRoutes from "./routes/cards.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
