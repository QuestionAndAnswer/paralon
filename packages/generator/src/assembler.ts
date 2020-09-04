import * as ts from "typescript";
import { posix, relative } from "path";

export function createImports(
    outDir: string,
    pbjsPath: string
) {
    const relativePbjsPath = posix.normalize(
        relative(outDir, pbjsPath)
    );

    return [
        ts.factory.createImportDeclaration(
            undefined,
            undefined,
            ts.factory.createImportClause(
                false,
                undefined,
                ts.factory.createNamespaceImport(ts.factory.createIdentifier("contract"))
            ),
            ts.factory.createStringLiteral(
                `./${posix.basename(relativePbjsPath, ".js")}`
            )
        ),
        ts.factory.createImportDeclaration(
            undefined,
            undefined,
            ts.factory.createImportClause(
                false,
                undefined,
                ts.factory.createNamespaceImport(ts.factory.createIdentifier("paralon"))
            ),
            ts.factory.createStringLiteral(`@paralon/core`)
        ),
    ];
}

export function assembleFile(
    pbjsPath: string,
    outDir: string,
    parts: ts.Node[]
): ts.Node[] {
    const importDecls = createImports(outDir, pbjsPath);

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

export function emitFiles(outDir: string, tsPath: string) {
    const options: ts.CompilerOptions = {
        declaration: true,
        outDir: outDir,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        target: ts.ScriptTarget.ES2018,
        disableSolutionSearching: true,
        allowJs: false,
        experimentalDecorators: false,
        isolatedModules: true,
        alwaysStrict: true,
        strict: true,
        newLine: ts.NewLineKind.LineFeed
    };

    const program = ts.createProgram([tsPath], options);
    const result = program.emit();
    result.diagnostics.forEach(x => {
        console.error("CompilationError:", `${x.file?.fileName}:x.start`, x.messageText);
    });
}