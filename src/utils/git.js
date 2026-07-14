import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function runGit(args, cwd = process.cwd()) {
    return execFileAsync("git", args, {
        cwd,
        windowsHide: true
    });
}

export async function assertCleanWorkingTree(cwd = process.cwd()) {
    try {
        const { stdout } = await runGit(["status", "--porcelain"], cwd);

        if (stdout.trim()) {
            throw new Error(
                "Existem arquivos pendentes de commit. Faça o commit antes de publicar."
            );
        }

    } catch (error) {
        if (error.code === "ENOENT") {
            throw new Error("Git não encontrado no sistema.");
        }

        if (error.message?.includes("not a git repository")) {
            throw new Error("O comando publish precisa ser executado dentro de um repositório Git.");
        }

        throw error;
    }
}

export async function getCurrentBranch(cwd = process.cwd()) {
    const { stdout } = await runGit(["rev-parse", "--abbrev-ref", "HEAD"], cwd);
    const branch = stdout.trim();

    if (!branch || branch === "HEAD") {
        throw new Error("Não foi possível identificar a branch atual.");
    }

    return branch;
}

export async function getRemoteUrl(remoteName = "origin", cwd = process.cwd()) {
    try {
        const { stdout } = await runGit(["remote", "get-url", remoteName], cwd);
        const url = stdout.trim();

        return url || null;

    } catch (error) {
        if (error.message?.includes("No such remote")) {
            return null;
        }

        throw error;
    }
}

export async function tagExists(tagName, cwd = process.cwd()) {
    try {
        await runGit(["rev-parse", "--verify", `refs/tags/${tagName}`], cwd);
        return true;
    } catch {
        return false;
    }
}

export async function createTag(tagName, message, cwd = process.cwd()) {
    await runGit(["tag", "-a", tagName, "-m", message], cwd);
}

export async function addAllAndCommit(message, cwd = process.cwd()) {
    await runGit(["add", "-A"], cwd);
    await runGit(["commit", "-m", message], cwd);
}

export async function pushBranch(remoteName, branchName, cwd = process.cwd()) {
    await runGit(["push", remoteName, branchName], cwd);
}

export async function pushCurrentBranch(remoteName, cwd = process.cwd()) {
    const branchName = await getCurrentBranch(cwd);
    await pushBranch(remoteName, branchName, cwd);
}

export async function pushTag(remoteName, tagName, cwd = process.cwd()) {
    await runGit(["push", remoteName, tagName], cwd);
}

export async function remoteTagExists(remoteName, tagName, cwd = process.cwd()) {
    const { stdout } = await runGit([
        "ls-remote",
        "--tags",
        remoteName,
        `refs/tags/${tagName}`
    ], cwd);

    return Boolean(stdout.trim());
}
