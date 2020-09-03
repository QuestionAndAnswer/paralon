import { Service, Method } from "protobufjs";
import * as ts from "typescript";
import { toCamelCase } from "./util";
import { resolveTypeIdentifier } from "./map-gen";

function wrapIntoMessageReadStream(node: ts.TypeReferenceNode) {
    return ts.createTypeReferenceNode(
        ts.createQualifiedName(
            ts.createIdentifier("paralon"),
            ts.createIdentifier("MessageReadStream")
        ),
        [node]
    );
}

function wrapIntoPromise(node: ts.TypeReferenceNode) {
    return ts.createTypeReferenceNode(
        ts.createIdentifier("Promise"),
        [node]
    );
}

export function createMethodRequestParamTSDeclaration (method: Method) {
    let requestType = ts.createTypeReferenceNode(
        ts.factory.createIdentifier(resolveTypeIdentifier(method, method.requestType)),
        undefined
    );

    if (method.requestStream) {
        requestType = wrapIntoMessageReadStream(requestType);
    }

    return ts.createParameter(
        undefined,
        undefined,
        undefined,
        ts.createIdentifier("request"),
        undefined,
        requestType,
        undefined
    );
}

export function createMethodResponseParamTSDeclaration (method: Method) {
    let responseType = ts.createTypeReferenceNode(
        ts.factory.createIdentifier(resolveTypeIdentifier(method, method.responseType)),
        undefined
    );

    if (method.responseStream) {
        responseType = wrapIntoMessageReadStream(responseType);
    } else {
        responseType = wrapIntoPromise(responseType);
    }

    return responseType;
}

function createServiceMethodTSDeclaration(method: Method) {
    return ts.createMethodSignature(
        undefined,
        [
            createMethodRequestParamTSDeclaration(method)
        ],
        createMethodResponseParamTSDeclaration(method),
        ts.createIdentifier(toCamelCase(method.name)),
        undefined
    );

}

export function createServiceIdentifier (serviceBaseName: string) {
    return ts.factory.createIdentifier(`I${serviceBaseName}`);
}

export function createServiceTSDeclaration(service: Service) {
    return ts.factory.createInterfaceDeclaration(
        undefined,
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        createServiceIdentifier(service.name),
        undefined,
        [ts.factory.createHeritageClause(
            ts.SyntaxKind.ExtendsKeyword,
            [ts.factory.createExpressionWithTypeArguments(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("paralon"),
                    ts.factory.createIdentifier("IProtoService")
                ),
                undefined
            )]
        )],
        service.methodsArray.map(createServiceMethodTSDeclaration)
    );
}