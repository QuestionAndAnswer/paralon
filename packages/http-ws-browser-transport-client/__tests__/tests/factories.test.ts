/// <reference types="mocha" />
import chai, { assert, expect } from "chai";
import chaiSpies from "chai-spies";
import { jsonFetch, useUrlPrefix } from "../../src/factories";

chai.use(chaiSpies);

describe("factories", function () {
    const fetchFnMock: typeof fetch = (_input, _init) => Promise.resolve(new Response());
    
    describe("jsonFetch", function () {
        it("passed fetch function immutable", function () {
            const jsonFetchFn = jsonFetch(fetchFnMock);
            assert.notEqual(fetchFnMock, jsonFetchFn);
        });

        it("headers are correct", function () {
            const spy = chai.spy(fetchFnMock);
            const jsonFetchFn = jsonFetch(spy);
            
            const req = "testurl";
            const init: RequestInit = {
                keepalive: true,
                headers: {
                    "x-test-header": "33"
                }
            };

            jsonFetchFn(req, init);

            expect(spy).to.have.been.called.with(
                req,
                {
                    keepalive: true,
                    method: "POST",
                    headers: {
                        "x-test-header": "33",
                        'Content-Type': 'application/json'
                    }
                }
            );
        });
    });

    describe("useUrlPrefix", function () {
        const spy = chai.spy(fetchFnMock);

        it("(with trailing /) request prefix set correct", function () {
            const prefixedFn = useUrlPrefix("myTestPrefix/", spy);
            prefixedFn("testurl");

            expect(spy).to.have.been.called.with("myTestPrefix/testurl");
        });

        it("(without trailing /) request prefix set correct", function () {
            const prefixedFn = useUrlPrefix("myTestPrefix", spy);
            prefixedFn("testurl");
            
            expect(spy).to.have.been.called.with("myTestPrefix/testurl");
        });
    });
});