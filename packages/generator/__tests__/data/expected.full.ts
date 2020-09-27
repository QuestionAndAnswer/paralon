import * as contract from "./contract";
import * as paralon from "@prln/core";
export const methodsMap: paralon.MethodsMap = {
    "get": { name: "get", reqType: contract.ns1.testPkg.GetRequest, resType: contract.ns1.testPkg.GetResponse },
    "clientStreamGet": { name: "clientStreamGet", reqType: contract.ns1.testPkg.GetRequest, resType: contract.ns1.testPkg.GetResponse },
    "serverStreamGet": { name: "serverStreamGet", reqType: contract.ns1.testPkg.GetRequest, resType: contract.ns1.testPkg.GetResponse },
    "biStreamGet": { name: "biStreamGet", reqType: contract.ns1.testPkg.GetRequest, resType: contract.ns1.testPkg.GetResponse },
    "getEmpty": { name: "getEmpty", reqType: contract.google.protobuf.Empty, resType: contract.google.protobuf.Empty },
    "clientStreamGetEmpty": { name: "clientStreamGetEmpty", reqType: contract.google.protobuf.Empty, resType: contract.google.protobuf.Empty },
    "serverStreamGetEmpty": { name: "serverStreamGetEmpty", reqType: contract.google.protobuf.Empty, resType: contract.google.protobuf.Empty },
    "biStreamGetEmpty": { name: "biStreamGetEmpty", reqType: contract.google.protobuf.Empty, resType: contract.google.protobuf.Empty }
};
export interface ITestService extends paralon.IProtoService {
    get(request: contract.ns1.testPkg.GetRequest): Promise<contract.ns1.testPkg.GetResponse>;
    clientStreamGet(request: paralon.MessageReadStream<contract.ns1.testPkg.GetRequest>): Promise<contract.ns1.testPkg.GetResponse>;
    serverStreamGet(request: contract.ns1.testPkg.GetRequest): paralon.MessageReadStream<contract.ns1.testPkg.GetResponse>;
    biStreamGet(request: paralon.MessageReadStream<contract.ns1.testPkg.GetRequest>): paralon.MessageReadStream<contract.ns1.testPkg.GetResponse>;
    getEmpty(request: contract.google.protobuf.Empty): Promise<contract.google.protobuf.Empty>;
    clientStreamGetEmpty(request: paralon.MessageReadStream<contract.google.protobuf.Empty>): Promise<contract.google.protobuf.Empty>;
    serverStreamGetEmpty(request: contract.google.protobuf.Empty): paralon.MessageReadStream<contract.google.protobuf.Empty>;
    biStreamGetEmpty(request: paralon.MessageReadStream<contract.google.protobuf.Empty>): paralon.MessageReadStream<contract.google.protobuf.Empty>;
}
export class ServerBridge implements paralon.IServerBridge {
    constructor(private readonly serverImpl: ITestService, private readonly transport: paralon.IServerTransport) { }
    public register() {
        this.transport.registerCallImpl(methodsMap["get"], this.serverImpl["get"].bind(this.serverImpl));
        this.transport.registerClientStreamImpl(methodsMap["clientStreamGet"], this.serverImpl["clientStreamGet"].bind(this.serverImpl));
        this.transport.registerServerStreamImpl(methodsMap["serverStreamGet"], this.serverImpl["serverStreamGet"].bind(this.serverImpl));
        this.transport.registerBiStreamImpl(methodsMap["biStreamGet"], this.serverImpl["biStreamGet"].bind(this.serverImpl));
        this.transport.registerCallImpl(methodsMap["getEmpty"], this.serverImpl["getEmpty"].bind(this.serverImpl));
        this.transport.registerClientStreamImpl(methodsMap["clientStreamGetEmpty"], this.serverImpl["clientStreamGetEmpty"].bind(this.serverImpl));
        this.transport.registerServerStreamImpl(methodsMap["serverStreamGetEmpty"], this.serverImpl["serverStreamGetEmpty"].bind(this.serverImpl));
        this.transport.registerBiStreamImpl(methodsMap["biStreamGetEmpty"], this.serverImpl["biStreamGetEmpty"].bind(this.serverImpl));
    }
}
export class Client implements paralon.IClient, ITestService {
    constructor(private readonly transport: paralon.IClientTransport) { }
    get(request: contract.ns1.testPkg.GetRequest): Promise<contract.ns1.testPkg.GetResponse> {
        return this.transport.callImpl(methodsMap["get"], request);
    }
    clientStreamGet(request: paralon.MessageReadStream<contract.ns1.testPkg.GetRequest>): Promise<contract.ns1.testPkg.GetResponse> {
        return this.transport.clientStreamImpl(methodsMap["clientStreamGet"], request);
    }
    serverStreamGet(request: contract.ns1.testPkg.GetRequest): paralon.MessageReadStream<contract.ns1.testPkg.GetResponse> {
        return this.transport.serverStreamImpl(methodsMap["serverStreamGet"], request);
    }
    biStreamGet(request: paralon.MessageReadStream<contract.ns1.testPkg.GetRequest>): paralon.MessageReadStream<contract.ns1.testPkg.GetResponse> {
        return this.transport.biStreamImpl(methodsMap["biStreamGet"], request);
    }
    getEmpty(request: contract.google.protobuf.Empty): Promise<contract.google.protobuf.Empty> {
        return this.transport.callImpl(methodsMap["getEmpty"], request);
    }
    clientStreamGetEmpty(request: paralon.MessageReadStream<contract.google.protobuf.Empty>): Promise<contract.google.protobuf.Empty> {
        return this.transport.clientStreamImpl(methodsMap["clientStreamGetEmpty"], request);
    }
    serverStreamGetEmpty(request: contract.google.protobuf.Empty): paralon.MessageReadStream<contract.google.protobuf.Empty> {
        return this.transport.serverStreamImpl(methodsMap["serverStreamGetEmpty"], request);
    }
    biStreamGetEmpty(request: paralon.MessageReadStream<contract.google.protobuf.Empty>): paralon.MessageReadStream<contract.google.protobuf.Empty> {
        return this.transport.biStreamImpl(methodsMap["biStreamGetEmpty"], request);
    }
}