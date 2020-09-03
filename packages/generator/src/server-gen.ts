import { Service, Method } from "protobufjs";
import * as ts from "typescript";
import { createServiceIdentifier } from "./service-get";
import { toCamelCase } from "./util";

export function createServerConstructorTSDeclaration (service: Service) {
    return ts.createConstructor(
        undefined,
        undefined,
        [
            ts.createParameter(
                undefined,
                [
                    ts.createModifier(ts.SyntaxKind.PrivateKeyword),
                    ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)
                ],
                undefined,
                ts.createIdentifier("serverImpl"),
                undefined,
                ts.createTypeReferenceNode(
                    createServiceIdentifier(service.name),
                    undefined
                ),
                undefined
            ),
            ts.createParameter(
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
                        ts.createIdentifier("IServerTransport")
                    ),
                    undefined
                ),
                undefined
            )
        ],
        ts.createBlock(
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
    return ts.createExpressionStatement(ts.createCall(
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
            ts.createCall(
                ts.createPropertyAccess(
                    ts.createElementAccess(
                        ts.createPropertyAccess(
                            ts.createThis(),
                            ts.createIdentifier("serverImpl")
                        ),
                        ts.createStringLiteral(toCamelCase(method.name))
                    ),
                    ts.createIdentifier("bind")
                ),
                undefined,
                [ts.createThis()]
            )
        ]
    ))
}

export function createRegisterMethodTSDeclaration (service: Service) {
    return ts.createMethod(
        undefined,
        [ts.createModifier(ts.SyntaxKind.PublicKeyword)],
        undefined,
        ts.createIdentifier("register"),
        undefined,
        undefined,
        [],
        undefined,
        ts.createBlock(
            service.methodsArray.map(createMethodRegistryCallTSDeclaration),
            true
        )
    )
}

export function createServerTSDeclaration(service: Service) {
    return ts.createClassDeclaration(
        undefined,
        [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.createIdentifier("ServerBridge"),
        undefined,
        [ts.createHeritageClause(
            ts.SyntaxKind.ImplementsKeyword,
            [ts.createExpressionWithTypeArguments(
                undefined,
                ts.createPropertyAccess(
                    ts.createIdentifier("paralon"),
                    ts.createIdentifier("IServerBridge")
                )
            )]
        )],
        [
            createServerConstructorTSDeclaration(service),
            createRegisterMethodTSDeclaration(service)
        ]
    );

}