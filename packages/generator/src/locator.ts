import { Namespace, Root, Service, parse } from "protobufjs";

function locateAllServices (root: Root | Namespace): Service[] {
    const nested = root.nestedArray;

    let collectedServices: Service[] = [];

    for (let i = 0; i < nested.length; i++) {
        const node = nested[i];
        if (node instanceof Service) {
            collectedServices.push(node);
        } else if (node instanceof Namespace) {
            collectedServices = [
                ...collectedServices,
                ...locateAllServices(node),
            ];
        }
    }

    return collectedServices;
}

export function getTargetService (protoContent: string): Service {
    const root = parse(protoContent).root;

    const services = locateAllServices(root);

    if (services.length > 1) {
        throw new Error("Multiple services found. Can't process multiple services decalrations per file.");
    }

    return services[0];
}