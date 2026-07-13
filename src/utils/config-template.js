export function generateConfig(config) {

    return {
        name: config.name,
        entry: "src/index.js",
        output: `dist/${config.name.toLowerCase().replaceAll(" ", "-")}.user.js`,

        namespace: "",
        version: config.version,
        description: config.description,
        author: config.author,
        license: "MIT",

        icon: "",

        homepageURL: "",
        supportURL: "",
        updateURL: "",
        downloadURL: "",

        match: [],
        grant: [],

        run_at: "document-idle",
        noframes: false
    };
}