import { Service, Method } from "protobufjs";
import * as ts from "typescript";
import { createServiceIdentifier, createMethodRequestParamTSDeclaration, createMethodResponseParamTSDeclaration } from "./service-get";
import { toCamelCase } from "./util";

function createConstructorTSDeclaration() {
    return ts.createConstructor(
        undefined,
        undefined,
        [ts.createParameter(
            undefined,
            [
                ts.createModifier(ts.SyntaxKind.PrivateKeyword),
                ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)
            ],
            undefined,
            ts.createIdentifier("transport"),
            undefined,
            ts.createTypeReferenceNode(
                ts.createQualifiedName(
                    ts.createIdentifier("paralon"),
                    ts.createIdentifier("IClientTransport")
                ),
                undefined
            ),
            undefined
        )],
        ts.createBlock(
            [],
            false
        )
    );
}

export function selectTransportCall (method: Method) {
    if (method.requestStream && method.responseStream) {
        return "biStreamImpl";
    }

    if (method.requestStream && !method.responseStream) {
        return "clientStreamImpl";
    }

    if (!method.requestStream && method.responseStream) {
        return "serverStreamImpl";
    }

    return "callImpl";
};

function createClientMethodTSDeclaration (method: Method) {
    return ts.createMethod(
        undefined,
        undefined,
        undefined,
        ts.createIdentifier(toCamelCase(method.name)),
        undefined,
        undefined,
        [
            createMethodRequestParamTSDeclaration(method)
        ],
        createMethodResponseParamTSDeclaration(method),
        ts.createBlock(
            [ts.createReturn(ts.createCall(
                ts.createPropertyAccess(
                    ts.createPropertyAccess(
                        ts.createThis(),
                        ts.createIdentifier("transport")
                    ),
                    ts.createIdentifier(selectTransportCall(method))
                ),
                undefined,
                [
                    ts.createElementAccess(
                        ts.createIdentifier("methodsMap"),
                        ts.createStringLiteral(toCamelCase(method.name))
                    ),
                    ts.createIdentifier("request")
                ]
            ))],
            true
        )
    )
}


export function createClientTSDeclaration(service: Service) {
    return ts.createClassDeclaration(
        undefined,
        [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.createIdentifier("Client"),
        undefined,
        [ts.createHeritageClause(
            ts.SyntaxKind.ImplementsKeyword,
            [
                ts.createExpressionWithTypeArguments(
                    undefined,
                    ts.createPropertyAccess(
                        ts.createIdentifier("paralon"),
                        ts.createIdentifier("IClient")
                    )
                ),
                ts.createExpressionWithTypeArguments(
                    undefined,
                    createServiceIdentifier(service.name),
                )
            ]
        )],
        [
            createConstructorTSDeclaration(),
            ...service.methodsArray.map(createClientMethodTSDeclaration)
        ]
    );

}