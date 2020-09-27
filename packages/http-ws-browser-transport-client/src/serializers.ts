import { MethodMessage } from "@prln/core";

export interface ICallSerializerImpl {
    encode: <T>(type: MethodMessage<T>, data: T) => any;
    decode: <T>(type: MethodMessage<T>, res: Response) => Promise<T>;
}

export const jsonCallSerializer: ICallSerializerImpl = {
    encode: (type, data) => {
        return JSON.stringify(type.toObject(data))
    },
    decode: async (type, res) => {
        const body = await res.json();
        return type.fromObject(body);
    }
}