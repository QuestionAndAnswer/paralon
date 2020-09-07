import { IClientTransport, MethodMeta, MessageReadStream, MethodMessage } from "@paralon/core";
import { v4 as uuid } from "uuid";
import { Readable } from "stream";
import { IFetchTransport, jsonFetch, IWebSocketTransport } from "./factories";
import { createWsStream } from "./wsutils";


export class WebClientTransport implements IClientTransport {
    constructor (
        private readonly fetchFn: IFetchTransport = jsonFetch(fetch),
        private readonly ws: IWebSocketTransport
    ) {}

    async callImpl<RQ, RS>(method: MethodMeta<RQ, RS>, data: RQ): Promise<RS> {
        return this.fetchFn(
            method.name,
            {
                body: this.fetchFn.encode(method.reqType, data)
            }
        )
            .then(async x => {
                if (x.status === 200) {
                    try {
                        const body = await x.body?.getReader().read();
                        return this.fetchFn.decode(method.resType, body?.value)
                    } catch (err) {
                        throw err;
                    }
                } else {
                    throw new Error();
                }
            });
    }
    clientStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, stream: MessageReadStream<RQ>): Promise<RS> {
        const wsStream = createWsStream(this.ws);

        return new Promise((resolve, reject) => {
            const messageListener = (data: any) => {
                const decoded = this.ws.decode<RS>(method.resType, data);
                wsStream.close();
                resolve(decoded);
            };

            try {
                wsStream.onmessage = messageListener;

                stream.on("message", msg => {
                    const encoded = this.ws.encode(method.reqType, msg);
                    wsStream.send(
                        JSON.stringify({
                            method: method.name,
                            msg: encoded
                        })
                    );
                });
            } catch (err) {
                wsStream.close();
                reject(err);
            }
        });
    }
    serverStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, data: RQ): MessageReadStream<RS> {
        const wsStream = createWsStream<RQ>(this.ws);
        const readStream = new Readable({
            objectMode: true
        });

        wsStream.onmessage = data => {
            const decoded = this.ws.decode<RS>(method.resType, data);
            readStream.push(decoded);
            readStream.emit("message", decoded);
        };

        const encoded = this.ws.encode(method.reqType, data);
        wsStream.send(
            JSON.stringify({
                method: method.name,
                msg: encoded
            })
        );

        return readStream;
    }
    biStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, stream: MessageReadStream<RQ>): MessageReadStream<RS> {
        const streamId = uuid();
        const readStream = new Readable({
            objectMode: true
        });

        const oldOnMessage = this.ws.onmessage;
        this.ws.onmessage = wsmsg => {
            const msg = this.ws.encode<RS>(method.resType, wsmsg.data);

            if (msg.streamId === streamId) {
                const decoded = method.resType.fromObject(msg.msg);
                readStream.push(decoded);
                readStream.emit("message", decoded);
            }

            oldOnMessage?.call(this.ws, wsmsg);
        };

        stream.on("message", msg => {
            const encoded = this.ws.encode(method.reqType, msg);
            this.ws.send(
                JSON.stringify({
                    streamId: streamId,
                    method: method.name,
                    msg: encoded
                })
            );
        });

        return readStream;
    }

}