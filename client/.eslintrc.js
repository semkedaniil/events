module.exports = {
    root: true,
    settings: {
        react: {
            version: "detect",
        },
    },
    parser: "@typescript-eslint/parser",
    plugins: ["react", "react-hooks", "@typescript-eslint", "sort-class-members", "import", "prettier", "unicorn"],
    globals: {
        expect: true,
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:unicorn/recommended",
        "plugin:react-hooks/recommended",
        "./.linterRules/typescript.js",
        "./.linterRules/functionality.js",
        "./.linterRules/maintainability.js",
        "./.linterRules/style.js",
        "prettier",
    ],
    rules: {
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/display-name": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "import/namespace": "off",
        "import/no-unresolved": "off",
        "import/named": "off",
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 8,
        sourceType: "module",
        useJSXTextNode: true,
        target: "11",
        module: "ESNext",
        warnOnUnsupportedTypeScriptVersion: true,
        resolveJsonModule: true,
        esModuleInterop: true
    },
};
