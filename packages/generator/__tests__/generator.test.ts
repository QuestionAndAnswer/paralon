import "mocha";
import chai, { assert } from "chai";
import chaiFs from "chai-fs";
import { getTargetService } from "../src/locator";
import { resolve } from "path";
import { readFileSync } from "fs";
import { createMethodsMapTSDeclaration } from "../src/map-gen";
import { printNodes, assembleFile } from "../src/assembler";
import { createServiceTSDeclaration } from "../src/service-get";
import { createServerTSDeclaration } from "../src/server-gen";
import { createClientTSDeclaration } from "../src/client-gen";
import { execSync } from "child_process";

chai.use(chaiFs);

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
        const expectedTsContent = readFileSync(resolve(__dirname, "data", "expected.full.ts")).toString();

        const service = getTargetService(protoContent);
        const methodsMapNode = createMethodsMapTSDeclaration(service);
        const serviceNode = createServiceTSDeclaration(service);
        const serverNode = createServerTSDeclaration(service);
        const clientNode = createClientTSDeclaration(service);
        const assembledTs = assembleFile(
            resolve(__dirname, "data", "gen", "contract.js"),
            resolve(__dirname, "data", "gen"),
            [methodsMapNode, serviceNode, serverNode, clientNode]
        );

        const actualTsContent = printNodes(assembledTs);
        
        assert.equal(actualTsContent, expectedTsContent);
    });
});

describe("cli", function () {
    const basePath = resolve(__dirname, "..");

    function getCmdBase () {
        return [
            "prln",
            `--proto ${basePath}/__tests__/data/contract.proto`,
            `--pout ${basePath}/__tests__/data/gen/contract.js`,
            "-k"
        ].join(" ");
    }

    it ("client generation is correct", function () {
        this.timeout(5000);
        execSync(`${getCmdBase()} --client ${basePath}/__tests__/data/gen/test.client`);

        assert.fileEqual(
            resolve(__dirname, "data", "gen", "test.client.ts"),
            resolve(__dirname, "data", "expected.client.ts")
        );
    });

    it ("server generation is correct", function () {
        this.timeout(5000);
        execSync(`${getCmdBase()} --server ${basePath}/__tests__/data/gen/test.server`);

        assert.fileEqual(
            resolve(__dirname, "data", "gen", "test.server.ts"),
            resolve(__dirname, "data", "expected.server.ts")
        );
    });
});