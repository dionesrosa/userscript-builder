export function validateConfig(config) {

    const required = [
        "name",
        "version",
        "description"
    ];

    const missing = required.filter(
        field => !config[field]
    );

    if (missing.length > 0) {
        throw new Error(
            `Missing required fields: ${missing.join(", ")}`
        );
    }

    return true;
}