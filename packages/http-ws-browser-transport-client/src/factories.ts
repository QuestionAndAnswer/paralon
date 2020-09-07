import { ICallSerializerImpl, jsonCallSerializer } from "./serializers";

export type IFetchTransport = ICallSerializerImpl & typeof fetch;


export function jsonFetch (
    fetchFn: typeof fetch
): IFetchTransport {
    const wrappedFn: typeof fetch = (input, init) => {
        return fetchFn(
            input,
            {
                ...init, 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    };

    return Object.assign(wrappedFn, jsonCallSerializer);
}