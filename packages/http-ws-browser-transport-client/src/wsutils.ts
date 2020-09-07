import { v4 as uuid } from "uuid";

export interface StreamMessage<T = any> {
    streamId: string;
    data: T;
}

export interface IWSStream {
    streamId: string;
    onmessage (msg: any): void;
    onclose (): void;
    send (data: string): void;
    close (): void;
}

export function createWsStream(ws: WebSocket): IWSStream {
    const streamId = uuid();

    const messageListener = (wsmsg: MessageEvent) => {
        const data: StreamMessage = JSON.parse(wsmsg.data);
        if (data.streamId === streamId) {
            instance.onmessage(data.data);
        }
    }

    ws.addEventListener("message", messageListener);

    const instance: IWSStream = {
        streamId: streamId,
        close: () => {
            ws.removeEventListener("message", messageListener);
        },
        send: data => {
            const msg: StreamMessage = {
                data: data,
                streamId: streamId
            };

            ws.send(JSON.stringify(msg));
        },
        onmessage: () => {},
        onclose: () => {}
    };

    return instance;
}