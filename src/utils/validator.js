export function validateConfig(config) {

    const required = [
        "name",
        "version",
        "match"
    ];

    const missing = required.filter(field => {

        if (!config[field]) {
            return true;
        }

        if (Array.isArray(config[field]) && config[field].length === 0) {
            return true;
        }

        return false;
    });

    if (missing.length > 0) {
        throw new Error(
            `Campos obrigatórios faltando: ${missing.join(", ")}`
        );
    }

    return config;
}
