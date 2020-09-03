import * as ts from "typescript";
import { posix, relative, dirname, basename } from "path";

export function createImports(
    basePath: string,
    protobufGeneratedDTSFilePath: string
) {
    return [
        ts.createImportDeclaration(
            undefined,
            undefined,
            ts.factory.createImportClause(
                false,
                undefined,
                ts.factory.createNamespaceImport(ts.factory.createIdentifier("contract"))
            ),
            ts.createStringLiteral(
                `./${posix.join(basePath, protobufGeneratedDTSFilePath)}`
            )
        ),
        ts.createImportDeclaration(
            undefined,
            undefined,
            ts.factory.createImportClause(
                false,
                undefined,
                ts.factory.createNamespaceImport(ts.factory.createIdentifier("paralon"))
            ),
            ts.createStringLiteral(`@paralon/core`)
        ),
    ];
}

export function assembleFile(
    dtsPath: string,
    outDir: string,
    parts: ts.Node[]
): ts.Node[] {
    const basePath = relative(outDir, dirname(dtsPath));
    const importDecls = createImports(basePath, basename(dtsPath, ".d.ts"));

    return [
        ...importDecls,
        ...parts,
    ];
}


export function printNodes(nodes: ts.Node[]) {
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });

    const outFile = ts.createSourceFile(
        "gh-proxy-map.ts",
        "",
        ts.ScriptTarget.Latest,
        false,
        ts.ScriptKind.TS
    );

    return printer.printList(
        ts.ListFormat.SourceFileStatements,
        ts.createNodeArray(nodes),
        outFile
    );
}