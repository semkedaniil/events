"use strict";

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const ESLintPlugin = require("eslint-webpack-plugin");
const paths = require("./paths");
const modules = require("./modules");
const getClientEnvironment = require("./env");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ForkTsCheckerWebpackPlugin =
    process.env.TSC_COMPILE_ON_ERROR === "true"
        ? require("react-dev-utils/ForkTsCheckerWarningWebpackPlugin")
        : require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const createEnvironmentHash = require("./webpack/persistentCache/createEnvironmentHash");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

const reactRefreshRuntimeEntry = require.resolve("react-refresh/runtime");
const reactRefreshWebpackPluginRuntimeEntry = require.resolve("@pmmmwh/react-refresh-webpack-plugin");
const babelRuntimeEntry = require.resolve("babel-preset-react-app");
const babelRuntimeEntryHelpers = require.resolve("@babel/runtime/helpers/esm/assertThisInitialized", {
    paths: [babelRuntimeEntry],
});
const babelRuntimeRegenerator = require.resolve("@babel/runtime/regenerator", {
    paths: [babelRuntimeEntry],
});

const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === "true";
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === "true";

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || "10000");

const useTypeScript = fs.existsSync(paths.appTsConfig);

const useTailwind = fs.existsSync(path.join(paths.appPath, "tailwind.config.js"));

const swSrc = paths.swSrc;

module.exports = function(webpackEnv) {
    const isEnvDevelopment = webpackEnv === "development";
    const isEnvProduction = webpackEnv === "production";

    const isEnvProductionProfile = isEnvProduction && process.argv.includes("--profile");

    const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

    const shouldUseReactRefresh = env.raw.FAST_REFRESH;

    return {
        target: ["browserslist"],
        stats: "errors-warnings",
        mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
        bail: isEnvProduction,
        devtool: isEnvProduction
            ? shouldUseSourceMap
                ? "source-map"
                : false
            : isEnvDevelopment && "cheap-module-source-map",
        entry: paths.appIndexJs,
        output: {
            publicPath: "/",
            path: paths.appBuild,
            pathinfo: isEnvDevelopment,
            filename: isEnvProduction
                ? "static/js/[name].[contenthash:8].js"
                : isEnvDevelopment && "static/js/bundle.js",
            chunkFilename: isEnvProduction
                ? "static/js/[name].[contenthash:8].chunk.js"
                : isEnvDevelopment && "static/js/[name].chunk.js",
            assetModuleFilename: "static/media/[name].[hash][ext]",
            devtoolModuleFilenameTemplate: isEnvProduction
                ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, "/")
                : isEnvDevelopment && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
        },
        cache: {
            type: "filesystem",
            version: createEnvironmentHash(env.raw),
            cacheDirectory: paths.appWebpackCache,
            store: "pack",
            buildDependencies: {
                defaultWebpack: ["webpack/lib/"],
                config: [__filename],
                tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f => fs.existsSync(f)),
            },
        },
        infrastructureLogging: {
            level: "none",
        },
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        keep_classnames: isEnvProductionProfile,
                        keep_fnames: isEnvProductionProfile,
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
                new CssMinimizerPlugin(),
            ],
        },
        resolve: {
            modules: ["node_modules", paths.appNodeModules].concat(modules.additionalModulePaths || []),
            extensions: paths.moduleFileExtensions
                .map(ext => `.${ext}`)
                .filter(ext => useTypeScript || !ext.includes("ts")),
            alias: {
                "react-native": "react-native-web",
                ...(isEnvProductionProfile && {
                    "react-dom$": "react-dom/profiling",
                    "scheduler/tracing": "scheduler/tracing-profiling",
                }),
                ...(modules.webpackAliases || {}),
            },
            plugins: [
                new ModuleScopePlugin(paths.appSrc, [
                    paths.appPackageJson,
                    reactRefreshRuntimeEntry,
                    reactRefreshWebpackPluginRuntimeEntry,
                    babelRuntimeEntry,
                    babelRuntimeEntryHelpers,
                    babelRuntimeRegenerator,
                ]),
            ],
        },
        module: {
            rules: [
                shouldUseSourceMap && {
                    enforce: "pre",
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css|less)$/,
                    loader: require.resolve("source-map-loader"),
                },
                {
                    test: /\bmapbox-gl-csp-worker.js\b/i,
                    use: { loader: 'worker-loader' }
                },
                {
                    oneOf: [
                        {
                            test: [/\.avif$/],
                            type: "asset",
                            mimetype: "image/avif",
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit,
                                },
                            },
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                            type: "asset",
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit,
                                },
                            },
                        },
                        {
                            test: /\.svg$/,
                            use: [
                                {
                                    loader: require.resolve("@svgr/webpack"),
                                    options: {
                                        prettier: false,
                                        svgo: false,
                                        svgoConfig: {
                                            plugins: [{ removeViewBox: false }],
                                        },
                                        titleProp: true,
                                        ref: true,
                                    },
                                },
                                {
                                    loader: require.resolve("file-loader"),
                                    options: {
                                        name: "static/media/[name].[hash].[ext]",
                                    },
                                },
                            ],
                            issuer: {
                                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
                            },
                        },
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: paths.appSrc,
                            loader: require.resolve("babel-loader"),
                            options: {
                                customize: require.resolve("babel-preset-react-app/webpack-overrides"),
                                presets: [
                                    [
                                        require.resolve("babel-preset-react-app"),
                                        {
                                            runtime: "automatic",
                                        },
                                    ],
                                ],

                                plugins: [
                                    isEnvDevelopment && shouldUseReactRefresh && require.resolve("react-refresh/babel"),
                                ].filter(Boolean),
                                cacheDirectory: true,
                                cacheCompression: false,
                                compact: isEnvProduction,
                            },
                        },
                        {
                            test: /\.(js|mjs)$/,
                            exclude: /@babel(?:\/|\\{1,2})runtime/,
                            loader: require.resolve("babel-loader"),
                            options: {
                                babelrc: false,
                                configFile: false,
                                compact: false,
                                presets: [[require.resolve("babel-preset-react-app/dependencies"), { helpers: true }]],
                                cacheDirectory: true,
                                cacheCompression: false,
                                sourceMaps: shouldUseSourceMap,
                                inputSourceMap: shouldUseSourceMap,
                            },
                        },
                        {
                            test: /\.(c|le)ss$/,
                            exclude: ["/node_modules/"],
                            rules: [
                                {
                                    use: [
                                        "classnames-loader",
                                        { loader: "style-loader", options: { base: 1000 } },
                                        {
                                            loader: "css-loader",
                                            options: {
                                                modules: true,
                                                localIdentName: "[name]-[local]-[hash:base64:4]",
                                            },
                                        },
                                        "less-loader",
                                    ],
                                },
                            ],
                        },
                        {
                            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                            type: "asset/resource",
                        },
                    ],
                },
            ].filter(Boolean),
        },
        plugins: [
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        inject: true,
                        template: paths.appHtml,
                    },
                    isEnvProduction
                        ? {
                            minify: {
                                removeComments: true,
                                collapseWhitespace: true,
                                removeRedundantAttributes: true,
                                useShortDoctype: true,
                                removeEmptyAttributes: true,
                                removeStyleLinkTypeAttributes: true,
                                keepClosingSlash: true,
                                minifyJS: true,
                                minifyCSS: true,
                                minifyURLs: true,
                            },
                        }
                        : undefined,
                ),
            ),
            isEnvProduction &&
            shouldInlineRuntimeChunk &&
            new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
            new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
            new ModuleNotFoundPlugin(paths.appPath),
            new webpack.DefinePlugin(env.stringified),
            isEnvDevelopment &&
            shouldUseReactRefresh &&
            new ReactRefreshWebpackPlugin({
                overlay: false,
            }),
            isEnvDevelopment && new CaseSensitivePathsPlugin(),
            isEnvProduction &&
            new MiniCssExtractPlugin({
                filename: "static/css/[name].[contenthash:8].css",
                chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
            }),
            new WebpackManifestPlugin({
                fileName: "asset-manifest.json",
                publicPath: paths.publicUrlOrPath,
                generate: (seed, files, entrypoints) => {
                    const manifestFiles = files.reduce((manifest, file) => {
                        manifest[file.name] = file.path;
                        return manifest;
                    }, seed);
                    const entrypointFiles = entrypoints.main.filter(fileName => !fileName.endsWith(".map"));

                    return {
                        files: manifestFiles,
                        entrypoints: entrypointFiles,
                    };
                },
            }),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
            isEnvProduction &&
            fs.existsSync(swSrc) &&
            new WorkboxWebpackPlugin.InjectManifest({
                swSrc,
                dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
                exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            }),
            // TypeScript type checking
            useTypeScript &&
            new ForkTsCheckerWebpackPlugin({
                async: isEnvDevelopment,
                typescript: {
                    typescriptPath: resolve.sync("typescript", {
                        basedir: paths.appNodeModules,
                    }),
                    configOverwrite: {
                        compilerOptions: {
                            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                            skipLibCheck: true,
                            inlineSourceMap: false,
                            declarationMap: false,
                            noEmit: true,
                            incremental: true,
                            tsBuildInfoFile: paths.appTsBuildInfoFile,
                        },
                    },
                    context: paths.appPath,
                    diagnosticOptions: {
                        syntactic: true,
                    },
                    mode: "write-references",
                    // profile: true,
                },
                issue: {
                    include: [{ file: "../**/src/**/*.{ts,tsx}" }, { file: "**/src/**/*.{ts,tsx}" }],
                    exclude: [
                        { file: "**/src/**/__tests__/**" },
                        { file: "**/src/**/?(*.){spec|test}.*" },
                        { file: "**/src/setupProxy.*" },
                        { file: "**/src/setupTests.*" },
                    ],
                },
                logger: {
                    infrastructure: "silent",
                },
            }),
        ].filter(Boolean),
        performance: false,
    };
};
