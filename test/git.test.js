import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import {
    addAllAndCommit,
    assertCleanWorkingTree,
    remoteTagExists
} from "../src/utils/git.js";
import { createTempDir, runGit } from "./helpers.js";

test("assertCleanWorkingTree aceita repositório limpo", async () => {
    const dir = await createTempDir("usb-git-clean-");
    await runGit(["init"], dir);

    await assert.doesNotReject(() => assertCleanWorkingTree(dir));
});

test("assertCleanWorkingTree rejeita árvore suja", async () => {
    const dir = await createTempDir("usb-git-dirty-");
    await runGit(["init"], dir);
    await fs.writeFile(path.join(dir, "arquivo.txt"), "x", "utf-8");

    await assert.rejects(
        () => assertCleanWorkingTree(dir),
        /pendentes de commit/
    );
});

test("addAllAndCommit cria um commit quando há mudanças", async () => {
    const dir = await createTempDir("usb-git-commit-");
    await runGit(["init"], dir);
    await runGit(["config", "user.name", "Test User"], dir);
    await runGit(["config", "user.email", "test@example.com"], dir);
    await fs.writeFile(path.join(dir, "arquivo.txt"), "x", "utf-8");

    await addAllAndCommit("test commit", dir);

    const { stdout } = await runGit(["log", "--oneline", "-1"], dir);
    assert.match(stdout, /test commit/);
});

test("remoteTagExists retorna falso quando a tag não existe", async () => {
    const dir = await createTempDir("usb-git-remote-");
    const remoteDir = await createTempDir("usb-git-bare-");
    await runGit(["init", "--bare"], remoteDir);
    await runGit(["init"], dir);
    await runGit(["remote", "add", "origin", remoteDir], dir);

    await assert.equal(
        await remoteTagExists("origin", "v0.0.0", dir),
        false
    );
});
