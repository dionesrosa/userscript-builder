import test from "node:test";
import assert from "node:assert/strict";
import { generateMetadata } from "../src/utils/metadata.js";

test("generateMetadata escreve tags relevantes", () => {
    const metadata = generateMetadata({
        name: "Meu Script",
        namespace: "http://tampermonkey.net/",
        copyright: "2026",
        version: "1.2.3",
        description: "Descrição",
        author: "Autor",
        license: "MIT",
        icon: "https://exemplo.com/icon.png",
        icon64: "https://exemplo.com/icon64.png",
        homepageURL: "https://exemplo.com",
        supportURL: "https://exemplo.com/suporte",
        updateURL: "https://exemplo.com/update.user.js",
        downloadURL: "https://exemplo.com/download.user.js",
        match: ["*://exemplo.com/*"],
        include: ["https://site.com/*"],
        exclude: ["https://site.com/privado/*"],
        require: ["https://cdn.com/lib.js"],
        grant: ["GM_setValue"],
        connect: ["api.exemplo.com"],
        tag: ["prod"],
        run_at: "document-idle",
        run_in: "normal-tabs",
        sandbox: "raw",
        noframes: true
    });

    assert.match(metadata, /@name\s+Meu Script/);
    assert.match(metadata, /@version\s+1.2.3/);
    assert.match(metadata, /@match\s+\*:\/\/exemplo.com\/\*/);
    assert.match(metadata, /@noframes/);
});
