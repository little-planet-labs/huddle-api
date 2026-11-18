import express, { type NextFunction, type Request, type Response } from "express";
import teams from "./routes/teams";

export const app = express();

app.use(express.json());
app.use(teams);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});
