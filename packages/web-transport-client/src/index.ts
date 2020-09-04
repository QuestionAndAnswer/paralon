import { IClientTransport, MethodMeta, MessageReadStream } from "@paralon/core";
import { AxiosInstance } from "axios";
import websocket, { IMessageEvent } from "websocket";
import { v4 as uuid } from "uuid";
import { Readable } from "stream";

function parseWsMsg (msg: IMessageEvent) {
    return JSON.parse(msg.data as string);
}


export class WebClientTransport implements IClientTransport {
    constructor (
        private readonly http: AxiosInstance,
        private readonly ws: websocket.w3cwebsocket
    ) {}

    async callImpl<RQ, RS>(method: MethodMeta<RQ, RS>, data: RQ): Promise<RS> {
        const response = await this.http.post(
            method.name, 
            method.reqType.toObject(data), 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return method.resType.fromObject(response.data);
    }
    clientStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, stream: MessageReadStream<RQ>): Promise<RS> {
        return new Promise((resolve, reject) => {
            const streamId = uuid();

            const oldOnMessage = this.ws.onmessage;
            this.ws.onmessage = wsmsg => {
                const msg = parseWsMsg(wsmsg);

                if (msg.streamId === streamId) {
                    const decoded = method.resType.fromObject(msg.msg);
                    resolve(decoded);
                }

                oldOnMessage.call(this, wsmsg);
            };

            stream.on("message", msg => {
                const encoded = method.reqType.toObject(msg);
                this.ws.send(
                    JSON.stringify({
                        streamId: streamId,
                        method: method.name,
                        msg: encoded
                    })
                );
            });
        });
    }
    serverStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, data: RQ): MessageReadStream<RS> {
        const streamId = uuid();
        const readStream = new Readable({
            objectMode: true
        });

        const oldOnMessage = this.ws.onmessage;
        this.ws.onmessage = wsmsg => {
            const msg = parseWsMsg(wsmsg);

            if (msg.streamId === streamId) {
                const decoded = method.resType.fromObject(msg.msg);
                readStream.push(decoded);
                readStream.emit("message", decoded);
            }

            oldOnMessage.call(this, wsmsg);
        };

        const encoded = method.reqType.toObject(data);
        this.ws.send(
            JSON.stringify({
                streamId: streamId,
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
            const msg = parseWsMsg(wsmsg);

            if (msg.streamId === streamId) {
                readStream.push(msg.msg);
                readStream.emit("message", msg.msg);
            }

            oldOnMessage.call(this, wsmsg);
        };

        stream.on("message", msg => {
            const encoded = method.reqType.toObject(msg);
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