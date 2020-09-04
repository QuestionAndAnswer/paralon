import { Service, Method } from "protobufjs";
import * as ts from "typescript";
import { createServiceIdentifier, createMethodRequestParamTSDeclaration, createMethodResponseParamTSDeclaration } from "./service-get";
import { toCamelCase } from "./util";

function createConstructorTSDeclaration() {
    return ts.factory.createConstructorDeclaration(
        undefined,
        undefined,
        [ts.factory.createParameterDeclaration(
            undefined,
            [
                ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword),
                ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
            ],
            undefined,
            ts.factory.createIdentifier("transport"),
            undefined,
            ts.factory.createTypeReferenceNode(
                ts.factory.createQualifiedName(
                    ts.factory.createIdentifier("paralon"),
                    ts.factory.createIdentifier("IClientTransport")
                ),
                undefined
            ),
            undefined
        )],
        ts.factory.createBlock(
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
    return ts.factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        ts.factory.createIdentifier(toCamelCase(method.name)),
        undefined,
        undefined,
        [
            createMethodRequestParamTSDeclaration(method)
        ],
        createMethodResponseParamTSDeclaration(method),
        ts.factory.createBlock(
            [ts.factory.createReturnStatement(ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createThis(),
                        ts.factory.createIdentifier("transport")
                    ),
                    ts.factory.createIdentifier(selectTransportCall(method))
                ),
                undefined,
                [
                    ts.factory.createElementAccessExpression(
                        ts.factory.createIdentifier("methodsMap"),
                        ts.factory.createStringLiteral(toCamelCase(method.name))
                    ),
                    ts.factory.createIdentifier("request")
                ]
            ))],
            true
        )
    )
}


export function createClientTSDeclaration(service: Service) {
    return ts.factory.createClassDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier("Client"),
        undefined,
        [ts.factory.createHeritageClause(
            ts.SyntaxKind.ImplementsKeyword,
            [
                ts.factory.createExpressionWithTypeArguments(
                    ts.factory.createPropertyAccessExpression(
                        ts.createIdentifier("paralon"),
                        ts.createIdentifier("IClient")
                    ),
                    undefined
                ),
                ts.factory.createExpressionWithTypeArguments(
                    createServiceIdentifier(service.name),
                    undefined
                )
            ]
        )],
        [
            createConstructorTSDeclaration(),
            ...service.methodsArray.map(createClientMethodTSDeclaration)
        ]
    );

}