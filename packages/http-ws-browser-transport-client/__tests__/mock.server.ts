import express from "express";
import bodyParser from "body-parser";
import { prlnClientTest } from "./data/gen/contract";
import Long from "long";
import cors from "cors";

const PORT = parseInt(process.env.TEST_MOCK_SERVER_PORT || "", 10) || 8090;

const app = express();

app.use(cors({
    methods: ["POST", "OPTIONS"],
    origin: "*"
}));

app.post(
    "/api/get", 
    bodyParser.json(),
    (req, res) => {
        console.log(req.method, req.url, req.body);
        const reqMessage = prlnClientTest.GetRequest.fromObject(req.body);

        const resMessage = new prlnClientTest.GetResponse({
            iplus1: Long.fromValue(reqMessage.i).toNumber() + 1
        });

        res.status(200);
        res.json(
            prlnClientTest.GetResponse.toObject(resMessage)
        );
    }
);

app.listen(PORT);