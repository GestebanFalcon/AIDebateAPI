import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import { router } from "./routes";
import { parseCookies } from "./middleware/parseCookies";
import { parseToken } from "./middleware/parseToken";

const PORT = 3000;
const app = express();

app.use(bodyParser.json({limit: "1mb"}));
app.use(bodyParser.urlencoded({limit: "1mb", extended: true}));
app.use(parseCookies);
app.use(parseToken);
app.use("/", router);

app.listen(PORT, (err?: Error) => {
    err && console.error(err);
    console.log("Listening on port " + PORT);
});

