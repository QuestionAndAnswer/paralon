import { MethodMeta, MessageReadStream } from "./common";

export type CallCb<RQ, RS> = (data: RQ) => Promise<RS>;
export type ClientStreamCb<RQ, RS> = (stream: MessageReadStream<RQ>) => Promise<RS>;
export type ServerStreamCb<RQ, RS> = (data: RQ) => MessageReadStream<RS>;
export type BiStreamCb<RQ, RS> = (stream: MessageReadStream<RQ>) => MessageReadStream<RS>;

export interface IServerTransport {
    registerCallImpl <RQ, RS>(method: MethodMeta<RQ, RS>, callCb: CallCb<RQ, RS>): void;
    registerClientStreamImpl <RQ, RS>(method: MethodMeta<RQ, RS>, callCb: ClientStreamCb<RQ, RS>): void;
    registerServerStreamImpl <RQ, RS>(method: MethodMeta<RQ, RS>, callCb: ServerStreamCb<RQ, RS>): void;
    registerBiStreamImpl <RQ, RS>(method: MethodMeta, callCb: BiStreamCb<RQ, RS>): void;
}

export interface IClientTransport {
    callImpl <RQ, RS>(method: MethodMeta<RQ, RS>, data: RQ): Promise<RS>;
    clientStreamImpl <RQ, RS>(method: MethodMeta<RQ, RS>, stream: MessageReadStream<RQ>): Promise<RS>;
    serverStreamImpl <RQ, RS>(method: MethodMeta<RQ, RS>, data: RQ): MessageReadStream<RS>;
    biStreamImpl <RQ, RS>(method: MethodMeta<RQ, RS>, stream: MessageReadStream<RQ>): MessageReadStream<RS>;
}