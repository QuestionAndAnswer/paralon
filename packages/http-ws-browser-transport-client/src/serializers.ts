import { MethodMessage } from "@paralon/core";

export interface ICallSerializerImpl {
    encode: <T>(type: MethodMessage<T>, data: T) => any;
    decode: <T>(type: MethodMessage<T>, data: Uint8Array | undefined) => T;
}

export interface IStreamSerializerImpl {
    encode: <T>(type: MethodMessage<T>, data: T) => any;
    decode: <T>(type: MethodMessage<T>, data: string) => T;
}

export const jsonCallSerializer: ICallSerializerImpl = {
    encode: (type, data) => {
        return type.toObject(data);
    },
    decode: (type, data) => {
        return type.fromObject(data ? JSON.parse(data.toString()) : {});
    }
}

export const jsonStreamSerializer: IStreamSerializerImpl = {
    encode: (type, data) => {
        return type.toObject(data);
    },
    decode: (type, data) => {
        return type.fromObject(data ? JSON.parse(data) : {});
    }
}