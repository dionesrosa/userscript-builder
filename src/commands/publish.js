import fs from "node:fs/promises";
import path from "node:path";
import { loadConfig } from "../utils/config.js";
import { validateConfig } from "../utils/validator.js";
import { getOutputFile } from "../utils/output.js";
import {
    assertCleanWorkingTree,
    createTag,
    getCurrentBranch,
    getRemoteUrl,
    pushBranch,
    pushCurrentBranch,
    pushTag,
    remoteTagExists,
    tagExists
} from "../utils/git.js";
import {
    createGitHubRelease,
    deleteGitHubReleaseAsset,
    getGitHubReleaseByTag,
    getGitHubRepository,
    getGitHubToken,
    listGitHubReleaseAssets,
    updateGitHubRelease,
    uploadGitHubReleaseAsset
} from "../utils/github.js";

export function getReleaseTag(version) {
    return `v${version}`;
}

export function parsePublishOptions(args) {
    const options = {
        draft: args.includes("--draft"),
        prerelease: args.includes("--prerelease"),
        publishDraft: args.includes("--publish-draft")
    };

    if (options.publishDraft && (options.draft || options.prerelease)) {
        throw new Error(
            "Use apenas --publish-draft sozinho para publicar um rascunho existente."
        );
    }

    return options;
}

export function getAssetName(sourceFile) {
    return path.basename(sourceFile);
}

async function removeExistingAssetIfNeeded(release, sourceFile, token, repository) {
    const assetName = getAssetName(sourceFile);
    const assets = await listGitHubReleaseAssets({
        owner: repository.owner,
        repo: repository.repo,
        releaseId: release.id,
        token
    });

    const existingAsset = assets.find(asset => asset.name === assetName);

    if (existingAsset) {
        await deleteGitHubReleaseAsset({
            owner: repository.owner,
            repo: repository.repo,
            assetId: existingAsset.id,
            token
        });
    }
}

async function ensureLocalTag(releaseTag) {
    if (await tagExists(releaseTag)) {
        console.log("ℹ️ Tag local já existe:", releaseTag);
        return;
    }

    await createTag(releaseTag, releaseTag);
    console.log("✅ Tag criada:", releaseTag);
}

async function ensureRemoteTag(remoteName, releaseTag) {
    if (await remoteTagExists(remoteName, releaseTag)) {
        console.log(`ℹ️ Tag remota já existe em ${remoteName}:`, releaseTag);
        return false;
    }

    console.log(`ℹ️ Enviando tag para ${remoteName}:`, releaseTag);
    return true;
}

export async function pushReleaseRefs({
    remoteName,
    branchName,
    releaseTag,
    pushBranchImpl = pushBranch,
    pushTagImpl = pushTag,
    remoteTagExistsImpl = remoteTagExists
}) {
    const shouldPushTag = !(await remoteTagExistsImpl(remoteName, releaseTag));

    await pushBranchImpl(remoteName, branchName);

    if (shouldPushTag) {
        await pushTagImpl(remoteName, releaseTag);
        console.log("✅ Branch e tag enviados para o Git");
        return;
    }

    console.log("✅ Branch enviado para o Git");
}

async function getReleaseByTagOrNull(repository, releaseTag, token) {
    return getGitHubReleaseByTag({
        owner: repository.owner,
        repo: repository.repo,
        tagName: releaseTag,
        token
    });
}

async function createOrUpdateRelease({
    repository,
    releaseTag,
    branchName,
    config,
    token,
    draft,
    prerelease
}) {
    const existingRelease = await getReleaseByTagOrNull(repository, releaseTag, token);

    if (!existingRelease) {
        return createGitHubRelease({
            owner: repository.owner,
            repo: repository.repo,
            tagName: releaseTag,
            targetCommitish: branchName,
            name: releaseTag,
            body: `Release automática da versão ${config.version}.`,
            token,
            draft,
            prerelease
        });
    }

    if (existingRelease.draft) {
        const release = await updateGitHubRelease({
            owner: repository.owner,
            repo: repository.repo,
            releaseId: existingRelease.id,
            token,
            draft,
            prerelease,
            name: existingRelease.name || releaseTag,
            body: existingRelease.body || `Release automática da versão ${config.version}.`
        });

        console.log("ℹ️ Release existente reaproveitada:", release.html_url);
        return release;
    }

    if (draft || prerelease) {
        throw new Error(
            `A release ${releaseTag} já existe publicada. Use --publish-draft apenas para rascunhos existentes.`
        );
    }

    throw new Error(
        `A release ${releaseTag} já existe publicada. Ajuste a versão antes de publicar novamente.`
    );
}

export default async function publish(args = []) {
    console.log("🚀 Comando publish");
    const options = parsePublishOptions(args);

    let config = await loadConfig();

    console.log("⚙️ Configurações carregadas");

    config = validateConfig(config);

    await assertCleanWorkingTree();

    console.log("✅ Árvore de trabalho limpa");
    console.log("📦 Preparando publicação para a versão:", config.version);

    const remoteName = process.env.USERSCRIPT_PUBLISH_REMOTE || "origin";
    const remoteUrl = await getRemoteUrl(remoteName);

    if (!remoteUrl) {
        throw new Error(
            `Remote Git não encontrado: ${remoteName}. Configure o remote antes de publicar.`
        );
    }

    const token = getGitHubToken();

    if (!token) {
        throw new Error(
            "Token do GitHub não encontrado. Defina GITHUB_TOKEN, GH_TOKEN, GITHUB_PAT ou autentique-se com o GitHub CLI (gh auth login)."
        );
    }

    const repository = await getGitHubRepository();
    const branchName = await getCurrentBranch();
    const releaseTag = getReleaseTag(config.version);
    const sourceFile = path.resolve(process.cwd(), getOutputFile(config));
    const assetName = getAssetName(sourceFile);

    await fs.access(sourceFile);

    if (options.publishDraft) {
        const release = await getReleaseByTagOrNull(repository, releaseTag, token);

        if (!release) {
            throw new Error(
                `Nenhuma release encontrada para a tag ${releaseTag}.`
            );
        }

        if (!release.draft) {
            throw new Error(
                `A release ${releaseTag} já está publicada.`
            );
        }

        await removeExistingAssetIfNeeded(release, sourceFile, token, repository);

        const updatedRelease = await updateGitHubRelease({
            owner: repository.owner,
            repo: repository.repo,
            releaseId: release.id,
            token,
            draft: false,
            prerelease: release.prerelease,
            name: release.name || releaseTag,
            body: release.body || `Release automática da versão ${config.version}.`
        });

        const asset = await uploadGitHubReleaseAsset({
            uploadUrl: updatedRelease.upload_url,
            assetPath: sourceFile,
            assetName,
            token
        });

        console.log("✅ Draft publicada no GitHub:", updatedRelease.html_url);
        console.log("✅ Asset enviado para o GitHub:", asset.browser_download_url);
        return;
    }

    await ensureLocalTag(releaseTag);

    await pushReleaseRefs({
        remoteName,
        branchName,
        releaseTag,
        pushBranchImpl: async (remote, currentBranch) => {
            if (branchName) {
                await pushBranch(remote, currentBranch);
            }
        }
    });

    const release = await createOrUpdateRelease({
        repository,
        releaseTag,
        branchName,
        config,
        token,
        draft: options.draft,
        prerelease: options.prerelease
    });

    console.log("✅ Release criada no GitHub:", release.html_url);

    await removeExistingAssetIfNeeded(release, sourceFile, token, repository);

    const asset = await uploadGitHubReleaseAsset({
        uploadUrl: release.upload_url,
        assetPath: sourceFile,
        assetName,
        token
    });

    console.log("✅ Asset enviado para o GitHub:", asset.browser_download_url);
}
