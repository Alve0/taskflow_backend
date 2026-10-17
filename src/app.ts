import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import dotenv from "dotenv";

export const app: Application = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "sever is  running",
  });
});
