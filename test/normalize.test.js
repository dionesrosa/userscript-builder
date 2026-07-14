import test from "node:test";
import assert from "node:assert/strict";
import { slugify, toList, toText } from "../src/utils/normalize.js";

test("toList converte texto em lista", () => {
    assert.deepEqual(toList("a, b, c"), ["a", "b", "c"]);
});

test("toText retorna fallback quando vazio", () => {
    assert.equal(toText("   ", "fallback"), "fallback");
});

test("slugify normaliza nome de arquivo", () => {
    assert.equal(slugify("Meu Script Legal"), "meu-script-legal");
});
