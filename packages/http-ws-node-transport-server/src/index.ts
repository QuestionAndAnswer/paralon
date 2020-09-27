import { IServerTransport, MethodMeta, CallCb, ClientStreamCb, ServerStreamCb, BiStreamCb } from "@paralon/core";
import { Router } from "express";
import bodyParser from "body-parser";

export class WebServerTransport implements IServerTransport {
    constructor(
        private readonly router: Router
    ) {}

    registerCallImpl<RQ, RS>(method: MethodMeta<RQ, RS>, callCb: CallCb<RQ, RS>): void {
        this.router.post(
            `/${method.name}`,
            bodyParser.json(),
            (req, res) => {
                let inMessage: RQ;
                try {
                    inMessage = method.reqType.fromObject(req.body)
                } catch (err) {
                    res.status(400);
                    res.json({
                        message: `Unable to parse incoming message`
                    });
                    return;
                }

                callCb(inMessage)
                    .then(data => {
                        const outMessage = method.resType.toObject(data);
                        res.status(200);
                        res.json(outMessage);
                    })
                    .catch(err => {
                        res.status(500);
                        res.send(err);
                    });
            }
        );
    }
    registerClientStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, callCb: ClientStreamCb<RQ, RS>): void {
        throw new Error("Method not implemented.");
    }
    registerServerStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, callCb: ServerStreamCb<RQ, RS>): void {
        throw new Error("Method not implemented.");
    }
    registerBiStreamImpl<RQ, RS>(method: MethodMeta<unknown, unknown>, callCb: BiStreamCb<RQ, RS>): void {
        throw new Error("Method not implemented.");
    }
}