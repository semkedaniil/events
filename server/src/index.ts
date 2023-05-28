import express from "express";
import dotenv from "dotenv";
/* eslint-disable */
dotenv.config();

// @ts-ignore
import models from "./models/models";
import RateLimit from "express-rate-limit";
import {db} from "./database/db";
import cors from "cors";
import router from "./routes/routes";
import {Server} from 'socket.io'
import fileUploader from "express-fileupload";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware";
import {createServer} from "http";
import path from "path";

const limiter = RateLimit({
    windowMs: 60 * 1000,
    max: 100,
});

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, "../static")));
app.use(express.urlencoded({extended: false, limit: '20mb'}))
app.use(fileUploader({limits: {fileSize: 20 * 1024 * 1024}}));
app.use(ErrorHandlingMiddleware);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    },
    serveClient: false
})
app.use("/api", router);

io.on('connect', (socket) => {
    console.log('a user connected');
    socket.on('getEvents', () => {
        console.log('User wants events');
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
})
export {io};

const startServer = async (): Promise<void> => {
    try {
        await db.authenticate();
        await db.sync();
        server.listen(port, (): void => console.log(`Server listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
};

startServer();
