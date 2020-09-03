import "mocha";
import "chai";
import { assert } from "chai";
import { getTargetService } from "../src/locator";
import { resolve } from "path";
import { readFileSync } from "fs";
import { createMethodsMapTSDeclaration } from "../src/map-gen";
import { printNodes, assembleFile } from "../src/assembler";
import { createServiceTSDeclaration } from "../src/service-get";
import { createServerTSDeclaration } from "../src/server-gen";
import { createClientTSDeclaration } from "../src/client-gen";

describe("locator", function () {
    it ("parse returns target service", function () {
        const protoContent = readFileSync(resolve(__dirname, "data", "contract.proto")).toString();
        const service = getTargetService(protoContent);

        assert(service);
    });
});

describe("assembler", function () {
    it ("assembled .ts file correct", function () {
        const protoContent = readFileSync(resolve(__dirname, "data", "contract.proto")).toString();
        const expectedTsContent = readFileSync(resolve(__dirname, "data", "expected.full.gen.ts")).toString();

        const service = getTargetService(protoContent);
        const methodsMapNode = createMethodsMapTSDeclaration(service);
        const serviceNode = createServiceTSDeclaration(service);
        const serverNode = createServerTSDeclaration(service);
        const clientNode = createClientTSDeclaration(service);
        const assembledTs = assembleFile(
            resolve(__dirname, "data", "gen", "contract.d.ts"),
            resolve(__dirname, "data", "gen"),
            [methodsMapNode, serviceNode, serverNode, clientNode]
        );

        const actualTsContent = printNodes(assembledTs);
        
        assert.equal(actualTsContent, expectedTsContent);
    });
});