import { IClientTransport, MethodMeta, MessageReadStream } from "@prln/core";
import { IFetchTransport, jsonFetch } from "./factories";

export class WebClientTransport implements IClientTransport {
    constructor (
        private readonly fetchFn: IFetchTransport = jsonFetch(fetch)
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
                        const res = await this.fetchFn.decode(method.resType, x);
                        return res;
                    } catch (err) {
                        throw err;
                    }
                } else {
                    throw new Error();
                }
            });
    }
    clientStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, stream: MessageReadStream<RQ>): Promise<RS> {
        throw new Error("Not implemented");
    }
    serverStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, data: RQ): MessageReadStream<RS> {
        throw new Error("Not implemented");
    }
    biStreamImpl<RQ, RS>(method: MethodMeta<RQ, RS>, stream: MessageReadStream<RQ>): MessageReadStream<RS> {
        throw new Error("Not implemented");
    }

}