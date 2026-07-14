import test from "node:test";
import assert from "node:assert/strict";
import { bumpVersion, parseVersion } from "../src/utils/version.js";

test("parseVersion separa semver", () => {
    assert.deepEqual(parseVersion("1.2.3"), {
        major: 1,
        minor: 2,
        patch: 3
    });
});

test("bumpVersion incrementa patch", () => {
    assert.equal(bumpVersion("1.2.3", "patch"), "1.2.4");
});

test("bumpVersion incrementa minor", () => {
    assert.equal(bumpVersion("1.2.3", "minor"), "1.3.0");
});

test("bumpVersion incrementa major", () => {
    assert.equal(bumpVersion("1.2.3", "major"), "2.0.0");
});
