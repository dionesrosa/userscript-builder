import test from "node:test";
import assert from "node:assert/strict";
import { generateConfig } from "../src/utils/config-template.js";

test("generateConfig aplica padrões e normaliza listas", () => {
    const config = generateConfig({
        name: "Meu Script",
        version: "1.0.0",
        description: "Descrição",
        author: "Autor",
        match: "*://exemplo.com/*",
        grant: "GM_setValue, GM_getValue",
        include: "https://site.com/*",
        tag: "prod, web"
    });

    assert.equal(config.entry, "src/index.js");
    assert.equal(config.output, "dist/meu-script.user.js");
    assert.deepEqual(config.match, ["*://exemplo.com/*"]);
    assert.deepEqual(config.grant, ["GM_setValue", "GM_getValue"]);
    assert.deepEqual(config.include, ["https://site.com/*"]);
    assert.deepEqual(config.tag, ["prod", "web"]);
    assert.equal(config.license, "MIT");
});
