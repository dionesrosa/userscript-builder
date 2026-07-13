function addLine(lines, tag, value) {
    if (value) {
        lines.push(`// ${tag.padEnd(13)} ${value}`);
    }
}

export function generateMetadata(config) {

    const lines = [
        "// ==UserScript=="
    ];

    // Identificação
    addLine(lines, "@name", config.name);
    addLine(lines, "@namespace", config.namespace);
    addLine(lines, "@version", config.version);
    addLine(lines, "@description", config.description);
    addLine(lines, "@author", config.author);
    addLine(lines, "@license", config.license);
    addLine(lines, "@icon", config.icon);

    // Links
    addLine(lines, "@homepageURL", config.homepageURL);
    addLine(lines, "@supportURL", config.supportURL);
    addLine(lines, "@updateURL", config.updateURL);
    addLine(lines, "@downloadURL", config.downloadURL);

    // Sites
    for (const match of config.match ?? []) {
        addLine(lines, "@match", match);
    }

    for (const include of config.include ?? []) {
        addLine(lines, "@include", include);
    }

    for (const exclude of config.exclude ?? []) {
        addLine(lines, "@exclude", exclude);
    }

    // Recursos
    for (const require of config.require ?? []) {
        addLine(lines, "@require", require);
    }

    // Permissões
    for (const grant of config.grant ?? []) {
        addLine(lines, "@grant", grant);
    }

    for (const connect of config.connect ?? []) {
        addLine(lines, "@connect", connect);
    }

    // Execução
    addLine(lines, "@run-at", config.run_at);

    if (config.noframes) {
        lines.push("// @noframes");
    }

    lines.push("// ==/UserScript==");

    return lines.join("\n");
}