import express from "express";
import dotenv from "dotenv";
/* eslint-disable */
dotenv.config();

// @ts-ignore
import models from "./models/models";
import {db} from "./database/db";
import cors from "cors";
import router from "./routes/routes";
import path from "path";
import {Server} from 'socket.io'
import fileUploader from "express-fileupload";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware";
import {createServer} from "http";

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false, limit: '20mb'}))
app.use(fileUploader({limits: {fileSize: 20 * 1024 * 1024}}));
app.use(express.static(path.resolve(__dirname, "..", "static")));
app.use("/api", router);
app.use(ErrorHandlingMiddleware);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN
    },
    serveClient: false
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})

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
