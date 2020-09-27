import { Service, Method } from "protobufjs";
import * as ts from "typescript";
import { createServiceIdentifier } from "./service-get";
import { toCamelCase } from "./util";

export function createServerConstructorTSDeclaration (service: Service) {
    return ts.factory.createConstructorDeclaration(
        undefined,
        undefined,
        [
            ts.factory.createParameterDeclaration(
                undefined,
                [
                    ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword),
                    ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
                ],
                undefined,
                ts.factory.createIdentifier("serverImpl"),
                undefined,
                ts.factory.createTypeReferenceNode(
                    createServiceIdentifier(service.name),
                    undefined
                ),
                undefined
            ),
            ts.factory.createParameterDeclaration(
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
                        ts.factory.createIdentifier("IServerTransport")
                    ),
                    undefined
                ),
                undefined
            )
        ],
        ts.factory.createBlock(
            [],
            false
        )
    )
}

export function selectTransportCall (method: Method) {
    if (method.requestStream && method.responseStream) {
        return "registerBiStreamImpl";
    }

    if (method.requestStream && !method.responseStream) {
        return "registerClientStreamImpl";
    }

    if (!method.requestStream && method.responseStream) {
        return "registerServerStreamImpl";
    }

    return "registerCallImpl";
};

export function createMethodRegistryCallTSDeclaration (method: Method) {
    return ts.factory.createExpressionStatement(ts.factory.createCallExpression(
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
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createElementAccessExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createThis(),
                            ts.factory.createIdentifier("serverImpl")
                        ),
                        ts.factory.createStringLiteral(toCamelCase(method.name))
                    ),
                    ts.factory.createIdentifier("bind")
                ),
                undefined,
                [
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createThis(),
                        ts.factory.createIdentifier("serverImpl")
                    )
                ]
            )
        ]
    ))
}

export function createRegisterMethodTSDeclaration (service: Service) {
    return ts.factory.createMethodDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
        undefined,
        ts.factory.createIdentifier("register"),
        undefined,
        undefined,
        [],
        undefined,
        ts.factory.createBlock(
            service.methodsArray.map(createMethodRegistryCallTSDeclaration),
            true
        )
    )
}

export function createServerTSDeclaration(service: Service) {
    return ts.factory.createClassDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier("ServerBridge"),
        undefined,
        [ts.factory.createHeritageClause(
            ts.SyntaxKind.ImplementsKeyword,
            [ts.factory.createExpressionWithTypeArguments(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("paralon"),
                    ts.factory.createIdentifier("IServerBridge")
                ),
                undefined
            )]
        )],
        [
            createServerConstructorTSDeclaration(service),
            createRegisterMethodTSDeclaration(service)
        ]
    );

}