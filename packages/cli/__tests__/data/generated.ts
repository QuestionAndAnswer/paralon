import { skills, google } from "../contract";
import { IProtoService, MethodMap, MessageReadStream, IServerTransport, IClientTransport, IServerBridge, IClient } from "@paralon/core";

export const methodsMap: MethodMap = {
    "Get": {
        reqType: skills.GetSkillsRequest, resType: skills.GetSkillsResponse
    },
    "ClientStreamGet": {
        reqType: skills.GetSkillsRequest, resType: skills.GetSkillsResponse
    },
    "ServerStreamGet": {
        reqType: skills.GetSkillsRequest, resType: skills.GetSkillsResponse
    },
    "BidirStreamGet": {
        reqType: skills.GetSkillsRequest, resType: skills.GetSkillsResponse
    },
    "GetEmpty": {
        reqType: google.protobuf.Empty, resType: google.protobuf.Empty
    },
    "ClientStreamGetEmpty": {
        reqType: google.protobuf.Empty, resType: google.protobuf.Empty
    },
    "ServerStreamGetEmpty": {
        reqType: google.protobuf.Empty, resType: google.protobuf.Empty
    },
    "BidirStreamGetEmpty": {
        reqType: google.protobuf.Empty, resType: google.protobuf.Empty
    },
}

export interface ISkillsService extends IProtoService {
    get (request: skills.GetSkillsRequest): Promise<skills.GetSkillsResponse>;
    clientStreamGet (request: MessageReadStream<skills.GetSkillsRequest>): Promise<skills.GetSkillsResponse>;
    serverStreamGet (request: skills.GetSkillsRequest): MessageReadStream<skills.GetSkillsResponse>;
    bidirStreamGet (request: MessageReadStream<skills.GetSkillsRequest>): MessageReadStream<skills.GetSkillsResponse>;
    getEmpty (request: google.protobuf.Empty): Promise<google.protobuf.Empty>;
    clientStreamGetEmpty (request: MessageReadStream<google.protobuf.Empty>): Promise<google.protobuf.Empty>;
    serverStreamGetEmpty (request: google.protobuf.Empty): MessageReadStream<google.protobuf.Empty>;
    bidirStreamGetEmpty (request: MessageReadStream<google.protobuf.Empty>): MessageReadStream<google.protobuf.Empty>;
}

export class ServerBridge implements IServerBridge {
    constructor (
        private readonly serverImpl: ISkillsService,
        private readonly transport: IServerTransport
    ) {}

    public register () {
        this.transport.registerCallImpl(
            methodsMap["get"], 
            this.serverImpl["get"].bind(this)
        );
        this.transport.registerClientStreamImpl(
            methodsMap["clientStreamGet"], 
            this.serverImpl["clientStreamGet"].bind(this)
        );
        this.transport.registerClientStreamImpl(
            methodsMap["serverStreamGet"], 
            this.serverImpl["serverStreamGet"].bind(this)
        );
        this.transport.registerClientStreamImpl(
            methodsMap["bidirStreamGet"],
            this.serverImpl["bidirStreamGet"].bind(this)
        );
        this.transport.registerCallImpl(
            methodsMap["getEmpty"], 
            this.serverImpl["getEmpty"].bind(this)
        );
        this.transport.registerClientStreamImpl(
            methodsMap["clientStreamGetEmpty"], 
            this.serverImpl["clientStreamGetEmpty"].bind(this)
        );
        this.transport.registerClientStreamImpl(
            methodsMap["serverStreamGetEmpty"], 
            this.serverImpl["serverStreamGetEmpty"].bind(this)
        );
        this.transport.registerClientStreamImpl(
            methodsMap["bidirStreamGetEmpty"],
            this.serverImpl["bidirStreamGetEmpty"].bind(this)
        );
    }
}

export class Client implements IClient, ISkillsService {
    constructor (
        private readonly transport: IClientTransport
    ) {}

    get (request: skills.GetSkillsRequest): Promise<skills.GetSkillsResponse> {
        return this.transport.callImpl(methodsMap["get"], request);
    }
    clientStreamGet (request: MessageReadStream<skills.GetSkillsRequest>): Promise<skills.GetSkillsResponse> {
        return this.transport.clientStreamImpl(methodsMap["clientStreamGet"], request);
    }
    serverStreamGet (request: skills.GetSkillsRequest): MessageReadStream {
        return this.transport.serverStreamImpl(methodsMap["serverStreamGet"], request);
    }
    bidirStreamGet (request: MessageReadStream<skills.GetSkillsRequest>): MessageReadStream {
        return this.transport.biStreamImpl(methodsMap["bidirStreamGet"], request);
    }
    getEmpty (request: google.protobuf.Empty): Promise<google.protobuf.Empty> {
        return this.transport.callImpl(methodsMap["get"], request);
    }
    clientStreamGetEmpty (request: MessageReadStream<google.protobuf.Empty>): Promise<google.protobuf.Empty> {
        return this.transport.clientStreamImpl(methodsMap["clientStreamGet"], request);
    }
    serverStreamGetEmpty (request: google.protobuf.Empty): MessageReadStream<google.protobuf.Empty> {
        return this.transport.serverStreamImpl(methodsMap["serverStreamGet"], request);
    }
    bidirStreamGetEmpty (request: MessageReadStream<google.protobuf.Empty>): MessageReadStream<google.protobuf.Empty> {
        return this.transport.biStreamImpl(methodsMap["bidirStreamGet"], request);
    }
}