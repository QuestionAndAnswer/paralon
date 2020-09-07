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
                    ...init?.headers,
                    'Content-Type': 'application/json'
                }
            }
        );
    };

    return Object.assign(wrappedFn, jsonCallSerializer);
}

export function useUrlPrefix (prefix: string, fetchFn: typeof fetch): typeof fetch {
    prefix = prefix[prefix.length - 1] === "/" ? prefix.slice(0, -1) : prefix;
    return (input, init) => {
        if (input instanceof Request) {
            input = new Request({
                ...input,
                url: `${prefix}/${input.url}`               
            }, init);
        } else {
            input = `${prefix}/${input}`;
        }
        return fetchFn(input, init);
    }
}