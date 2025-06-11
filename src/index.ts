import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import { router } from "./routes";
import { parseCookies } from "./middleware/parseCookies";
import { parseToken } from "./middleware/parseToken";
import cors from "cors"
import { Server } from "socket.io";
import http from "http"
import { z } from "zod";
import { sockets } from "./socket/socket";

const PORT = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json({limit: "1mb"}));
app.use(bodyParser.urlencoded({limit: "1mb", extended: true}));
app.use(parseCookies);
app.use(parseToken);
app.use("/", router);

try {
    const server = app.listen(PORT);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            allowedHeaders: ["Gooner"],
            credentials: true,
        },
        
    }); 
    sockets.init(io);
    console.log("Server up on port " + PORT);
    

} catch (err) {
    console.log("Something went wrong :(");
    err && console.error(err);
}

