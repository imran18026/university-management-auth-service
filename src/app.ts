import express, { Application, Request, Response } from "express";

import cors from "cors";

const app: Application = express();
const port = 3000;

//cors
app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test
app.get("/", (req: Request, res: Response) => {
  res.send("Test Working Successfully");
});

export default app;
