module.exports = {
    rules: {
        "import/no-default-export": "error",
        "import/no-duplicates": "error",
        complexity: "off",
        "max-lines": "off",
        "no-duplicate-imports": "error",
        "no-param-reassign": "error",
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "variable",
                modifiers: ["const"],
                format: ["UPPER_CASE", "PascalCase", "camelCase"],
                leadingUnderscore: "allow",
            },
        ],
        "prefer-const": "error",
    },
};
