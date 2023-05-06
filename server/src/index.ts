import express from "express";
import dotenv from "dotenv";

dotenv.config();

// @ts-ignore
import models from "./models/models";
import { db } from "./database/db";
import cors from "cors";
import router from "./routes/routes";
import path from "path";
import fileUploader from "express-fileupload";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware";

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUploader({}));
app.use(express.static(path.resolve(__dirname, "static")));
app.use("/api", router);
app.use(ErrorHandlingMiddleware);

const startServer = async (): Promise<void> => {
  try {
    await db.authenticate();
    await db.sync();
    app.listen(port, (): void => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
