/// <reference types="mocha" />
import { WebClientTransport } from "../../src/transport";
import chai, { assert } from "chai";
import chaiSpies from "chai-spies";
import { Client } from "../data/gen/prln-client.js.js";
import { prlnClientTest } from "../data/gen/contract";
import { jsonFetch, useUrlPrefix } from "../../src/factories";

chai.use(chaiSpies);

describe("transport", function () {
    describe("callImpl", function () {
        it ("should return incremented number inside message", async function () {
            const transport = new WebClientTransport(
                jsonFetch(useUrlPrefix("http://localhost:8090/api", fetch))
            );
            const client = new Client(transport);

            const message = new prlnClientTest.GetRequest({ i: 1 });
            const res = await client.get(message);

            assert.instanceOf(res, prlnClientTest.GetResponse);
            assert.equal(res.iplus1, 2);
        });
    });
});