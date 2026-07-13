export function getOutputFile(config) {
    return config.output
        ? config.output
        : `dist/${config.name.toLowerCase().replaceAll(" ", "-")}.user.js`;
}