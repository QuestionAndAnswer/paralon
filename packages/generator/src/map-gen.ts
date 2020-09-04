import * as ts from "typescript";
import { Method, Service } from "protobufjs";
import { toCamelCase } from "./util";

export function resolveTypeIdentifier (method: Method, param: string) {
    let ns = method.parent?.parent?.fullName ?? "";
    ns = ns[0] === "." ? ns.substr(1) : ns;
    const type = param.includes(".") ? param : `${ns}.${param}`;
    return `contract.${type}`;
}

export function createMethodsMapTSDeclaration(service: Service) {
    return ts.factory.createVariableStatement(
        [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
            [
                ts.factory.createVariableDeclaration(
                    ts.factory.createIdentifier("methodsMap"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createQualifiedName(
                            ts.factory.createIdentifier("paralon"),
                            ts.factory.createIdentifier("MethodMap")
                        ),
                        undefined
                    ),
                    ts.factory.createObjectLiteralExpression(
                        service.methodsArray.map(createMethodMapLineTSDeclaration),
                        true
                    )
                )
            ],
            ts.NodeFlags.Const
        )
    );
}

function createMethodMapLineTSDeclaration(method: Method) {
    return ts.factory.createPropertyAssignment(
        ts.factory.createStringLiteral(toCamelCase(method.name)),
        ts.factory.createObjectLiteralExpression(
            [
                ts.factory.createPropertyAssignment(
                    ts.factory.createIdentifier("name"),
                    ts.factory.createStringLiteral(toCamelCase(method.name))
                ),
                ts.factory.createPropertyAssignment(
                    ts.factory.createIdentifier("reqType"),
                    ts.factory.createIdentifier(resolveTypeIdentifier(method, method.requestType))
                ),
                ts.factory.createPropertyAssignment(
                    ts.factory.createIdentifier("resType"),
                    ts.factory.createIdentifier(resolveTypeIdentifier(method, method.responseType))
                )
            ],
            false
        )
    );
}