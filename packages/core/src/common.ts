import $protobuf from "protobufjs";

export interface Decodable<T> {
    decode(reader: ($protobuf.Reader|Uint8Array), length?: number): T;
    fromObject(object: { [k: string]: any }): T;
}

export interface Encodable<T> {
    encode(message: T, writer?: $protobuf.Writer): $protobuf.Writer;
    toObject(message: T, options?: $protobuf.IConversionOptions): { [k: string]: any };
}

export type MethodMessage<T = unknown> = Encodable<T> & Decodable<T>;

export interface MethodMeta<RQ = unknown, RS = unknown> {
    reqType: MethodMessage<RQ>;
    resType: MethodMessage<RS>;
}

export interface MethodsMap {
    [name: string]: MethodMeta;
}

export interface MessageReadStream<T = unknown> extends NodeJS.ReadableStream {
    addListener(event: "message", listener: (chunk: T) => void): this;
    on(event: "message", listener: (chunk: T) => void): this;
    once(event: "message", listener: (chunk: T) => void): this;
    prependListener(event: "message", listener: (chunk: T) => void): this;
    prependOnceListener(event: "message", listener: (chunk: T) => void): this;
    removeListener(event: "message", listener: (chunk: T) => void): this;
}

export type CallMethod<RQ = unknown, RS = unknown> = (request: MethodMessage<RQ>) => Promise<RS>;
export type ClientStreamMethod<RQ = unknown, RS = unknown> = (request: MessageReadStream<RQ>) => Promise<RS>;
export type ServerStreamMethod<RQ = unknown, RS = unknown> = (request: RQ) => MessageReadStream<RS>;
export type BiStreamMethod<RQ = unknown, RS = unknown> = (request: MessageReadStream<RQ>) => MessageReadStream<RS>;

export interface IProtoService {
    [method: string]: CallMethod | ClientStreamMethod | ServerStreamMethod | BiStreamMethod;
}