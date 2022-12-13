module.exports = {
    rules: {
        // http://eslint.org/docs/rules/#possible-errors
        "react/jsx-key": ["error", { checkKeyMustBeforeSpread: true }],
        "react/jsx-curly-brace-presence": "error",
        "unicorn/prefer-switch": "off",
        "unicorn/no-array-callback-reference": "off",
        "unicorn/no-null": "off",
        "dot-notation": "off",
        "no-cond-assign": ["error", "always"],
        "no-debugger": "error",
        "no-dupe-args": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-empty-character-class": "error",
        "no-ex-assign": "error",
        "no-extra-semi": "error",
        "no-func-assign": "error",
        "no-inner-declarations": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "off",
        "no-unsafe-negation": "error",
        "no-obj-calls": "error",
        "no-sparse-arrays": "error",
        "no-unexpected-multiline": "error",
        "no-unreachable": "error",
        "no-unsafe-finally": "error",
        "use-isnan": "error",
        "valid-typeof": "error",
        // http://eslint.org/docs/rules/#best-practices
        "no-empty-pattern": "error",
        // This is not a problem with `let` declarations.
        "array-callback-return": "error",
        "block-scoped-var": "error",
        "dot-location": ["error", "property"],
        "no-extend-native": "error",
        "no-alert": "error",
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-eval": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-floating-decimal": "error",
        "no-implicit-coercion": [2, { "allow": ["!!", "~"] }],
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-multi-spaces": [
            "error",
            {
                ignoreEOLComments: true,
            },
        ],
        "no-multi-str": "error",
        "no-global-assign": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-proto": "error",
        "no-redeclare": "error",
        "no-return-assign": ["error", "except-parens"],
        "no-self-assign": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-void": "error",
        "no-with": "error",
        radix: "error",
        "wrap-iife": ["error", "inside"],
        yoda: ["error", "never"],
        // http://eslint.org/docs/rules/#strict-mode
        strict: ["error", "safe"],
        // http://eslint.org/docs/rules/#variables
        "no-delete-var": "error",
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["error", {
            "functions": false,
            "classes": false,
        }],
        // http://eslint.org/docs/rules/#stylistic-issues
        "array-bracket-spacing": ["error", "never"],
        "brace-style": ["error", "1tbs"],
        camelcase: "error",
        "comma-spacing": [
            "error",
            {
                before: false,
                after: true,
            },
        ],
        "comma-style": ["error", "last"],
        "computed-property-spacing": ["error", "never"],
        "consistent-this": ["error", "_this"],
        "eol-last": "error",
        // Non-ASCII characters are not allowed in identifiers for variables.
        "id-match": [
            "error",
            "^[a-zA-Z0-9а-яА-ЯёЁ_$]*$",
            {
                properties: true,
            },
        ],
        "key-spacing": [
            "error",
            {
                beforeColon: false,
                afterColon: true,
            },
        ],
        "keyword-spacing": [
            "error",
            {
                before: true,
                after: true,
            },
        ],
        "linebreak-style": ["error", "unix"],
        "max-len": [
            "error",
            {
                code: 120,
                ignoreUrls: true,
                ignoreTrailingComments: true,
                ignoreComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        "new-cap": [
            "error",
            {
                capIsNew: false,
            },
        ],
        "new-parens": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                max: 1,
                maxEOF: 0,
            },
        ],
        "func-call-spacing": ["error", "never"],
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "no-whitespace-before-property": "error",
        "one-var": ["error", "never"],
        "one-var-declaration-per-line": ["error", "always"],
        "operator-linebreak": "error",
        "padded-blocks": ["error", "never"],
        "quote-props": ["error", "as-needed"],
        quotes: ["error", "double", { allowTemplateLiterals: true, avoidEscape: true }],
        semi: ["error", "always"],
        "semi-style": ["error", "last"],
        "space-before-blocks": ["error", "always"],
        "space-before-function-paren": [
            "error",
            {
                anonymous: "always",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "space-in-parens": ["error", "never"],
        "space-infix-ops": "error",
        "space-unary-ops": [
            "error",
            {
                words: true,
                nonwords: false,
            },
        ],
        "switch-colon-spacing": [
            "error",
            {
                after: true,
                before: false,
            },
        ],
        // http://eslint.org/docs/rules/#ecmascript-6
        "arrow-spacing": [
            "error",
            {
                before: true,
                after: true,
            },
        ],
        "unicorn/prefer-export-from": "off",
        "constructor-super": "error",
        "no-class-assign": "error",
        "no-const-assign": "error",
        "no-dupe-class-members": "error",
        "unicorn/consistent-function-scoping": ["error", { "checkArrowFunctions": false }],
        "unicorn/no-array-for-each": "warn",
        "unicorn/no-useless-undefined": "off",
        "no-new-symbol": "error",
        "no-this-before-super": "error",
        "no-useless-computed-key": "error",
        "no-useless-constructor": "off",
        "no-useless-rename": "error",
        "no-var": "error",
        "prefer-arrow-callback": [
            "error",
            {
                allowNamedFunctions: true,
            },
        ],
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "rest-spread-spacing": ["error", "never"],
        "template-curly-spacing": ["error", "never"],
        "yield-star-spacing": ["error", "after"],
        // other
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    Object: false,
                    Function: false,
                    "{}": false,
                    Boolean: {
                        message: "Avoid using the `Boolean` type. Did you mean `boolean`?",
                        fixWith: "boolean",
                    },
                    Number: { message: "Avoid using the `Number` type. Did you mean `number`?", fixWith: "number" },
                    String: { message: "Avoid using the `String` type. Did you mean `string`?", fixWith: "string" },
                    Symbol: { message: "Avoid using the `Symbol` type. Did you mean `symbol`?", fixWith: "symbol" },
                },
            },
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                accessibility: "explicit",
            },
        ],
        "sort-class-members/sort-class-members": [
            2,
            {
                order: [
                    "[static-properties]",
                    "[static-methods]",
                    "[properties]",
                    "[life-cycle-methods]",
                    "[arrow-function-properties]",
                    "[event-handlers]",
                    "[render-functions]",
                    "[render-properties]",
                    "[render-function]",
                    "[methods]",
                    "everything-else",
                    "[conventional-private-properties]",
                    "[conventional-private-methods]",
                ],
                accessorPairPositioning: "getThenSet",
                groups: {
                    "life-cycle-methods": [{
                        "name": "/displayName|" +
                            "propTypes|" +
                            "contextTypes|" +
                            "childContextTypes|" +
                            "mixins|" +
                            "statics|" +
                            "defaultProps|" +
                            "constructor|" +
                            "getDefaultProps|" +
                            "state|" +
                            "getInitialState|" +
                            "getChildContext|" +
                            "getDerivedStateFromProps|" +
                            "componentWillMount|" +
                            "UNSAFE_componentWillMount|" +
                            "componentDidMount|" +
                            "componentWillReceiveProps|" +
                            "UNSAFE_componentWillReceiveProps|" +
                            "shouldComponentUpdate|" +
                            "componentWillUpdate|" +
                            "UNSAFE_componentWillUpdate|" +
                            "getSnapshotBeforeUpdate|" +
                            "componentDidUpdate|" +
                            "componentDidCatch|" +
                            "componentWillUnmount/", "type": "method",
                    }],
                    "render-function": [{ "name": "/render/", "type": "method" }],
                    "render-properties": [{ "name": "/render.+/", "type": "property" }],
                    "render-functions": [{ "name": "/render.+/", "type": "method" }],
                    "event-handlers": [{ "name": "/(on|handle).+/", "type": "method" }],
                },
            },
        ],
        "import/no-unassigned-import": [
            "error",
            {
                "allow": ["**/*.less"],
            },
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "consistent-return": "error",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-inferrable-types": [
            "error",
            {
                ignoreParameters: true,
            },
        ],
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/typedef": [
            "error",
            {
                propertyDeclaration: true,
            },
        ],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/unified-signatures": "error",
    },
};
