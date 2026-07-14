import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import {
    createGitHubRelease,
    getGitHubReleaseByTag,
    getGitHubToken,
    updateGitHubRelease,
    uploadGitHubReleaseAsset
} from "../src/utils/github.js";
import { createTempDir, runGit, writeJson } from "./helpers.js";

test("createGitHubRelease envia payload correto", async () => {
    const originalFetch = globalThis.fetch;
    const calls = [];

    globalThis.fetch = async (url, options) => {
        calls.push({ url, options });
        return new Response(JSON.stringify({
            html_url: "https://github.com/user/repo/releases/tag/v1.0.0",
            upload_url: "https://uploads.github.com/repos/user/repo/releases/1/assets{?name,label}"
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    };

    try {
        const release = await createGitHubRelease({
            owner: "user",
            repo: "repo",
            tagName: "v1.0.0",
            targetCommitish: "main",
            name: "v1.0.0",
            body: "body",
            token: "token",
            draft: true,
            prerelease: true
        });

        assert.equal(release.html_url, "https://github.com/user/repo/releases/tag/v1.0.0");
        assert.equal(calls[0].url, "https://api.github.com/repos/user/repo/releases");
        assert.equal(calls[0].options.method, "POST");

        const payload = JSON.parse(calls[0].options.body);
        assert.equal(payload.draft, true);
        assert.equal(payload.prerelease, true);
        assert.equal(payload.tag_name, "v1.0.0");
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("getGitHubReleaseByTag retorna null quando não existe", async () => {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async () => new Response("", { status: 404 });

    try {
        await assert.equal(
            await getGitHubReleaseByTag({
                owner: "user",
                repo: "repo",
                tagName: "v1.0.0",
                token: "token"
            }),
            null
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("updateGitHubRelease envia PATCH com draft false", async () => {
    const originalFetch = globalThis.fetch;
    let body;

    globalThis.fetch = async (url, options) => {
        body = JSON.parse(options.body);
        return new Response(JSON.stringify({
            html_url: "https://github.com/user/repo/releases/tag/v1.0.0",
            upload_url: "https://uploads.github.com/repos/user/repo/releases/1/assets{?name,label}"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    };

    try {
        const release = await updateGitHubRelease({
            owner: "user",
            repo: "repo",
            releaseId: 1,
            token: "token",
            draft: false,
            prerelease: false,
            name: "v1.0.0",
            body: "body"
        });

        assert.equal(release.html_url, "https://github.com/user/repo/releases/tag/v1.0.0");
        assert.equal(body.draft, false);
        assert.equal(body.name, "v1.0.0");
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("uploadGitHubReleaseAsset envia asset para a URL correta", async () => {
    const dir = await createTempDir("usb-github-asset-");
    const assetPath = path.join(dir, "script.user.js");
    await fs.writeFile(assetPath, "console.log('x');", "utf-8");

    const originalFetch = globalThis.fetch;
    let calledUrl = "";

    globalThis.fetch = async (url) => {
        calledUrl = String(url);
        return new Response(JSON.stringify({
            browser_download_url: "https://github.com/user/repo/releases/download/v1.0.0/script.user.js"
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    };

    try {
        const asset = await uploadGitHubReleaseAsset({
            uploadUrl: "https://uploads.github.com/repos/user/repo/releases/1/assets{?name,label}",
            assetPath,
            assetName: "script.user.js",
            token: "token"
        });

        assert.equal(asset.browser_download_url, "https://github.com/user/repo/releases/download/v1.0.0/script.user.js");
        assert.match(calledUrl, /name=script\.user\.js/);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test("getGitHubToken usa o token do GitHub CLI quando não há variável de ambiente", () => {
    const originalToken = process.env.GITHUB_TOKEN;
    const originalGhToken = process.env.GH_TOKEN;
    const originalGithubPat = process.env.GITHUB_PAT;

    delete process.env.GITHUB_TOKEN;
    delete process.env.GH_TOKEN;
    delete process.env.GITHUB_PAT;

    try {
        assert.equal(getGitHubToken(() => "cli-token\n"), "cli-token");
    } finally {
        if (originalToken === undefined) {
            delete process.env.GITHUB_TOKEN;
        } else {
            process.env.GITHUB_TOKEN = originalToken;
        }

        if (originalGhToken === undefined) {
            delete process.env.GH_TOKEN;
        } else {
            process.env.GH_TOKEN = originalGhToken;
        }

        if (originalGithubPat === undefined) {
            delete process.env.GITHUB_PAT;
        } else {
            process.env.GITHUB_PAT = originalGithubPat;
        }
    }
});
