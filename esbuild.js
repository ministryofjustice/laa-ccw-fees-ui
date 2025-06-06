import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { builtinModules } from "module";
import dotenv from "dotenv";
import fs from "fs-extra";
import path from "path";
import { getBuildNumber } from "./src/utils/index.js";

// Load environment variables
dotenv.config();
const buildNumber = getBuildNumber();

/**
 * Copies GOV.UK assets such as fonts and images from `govuk-frontend`
 * to the `public/assets` directory.
 * @async
 * @returns {Promise<void>} Resolves when the assets are copied successfully.
 */
const copyGovukAssets = async () => {
  try {
    await fs.copy(
      path.resolve("./node_modules/govuk-frontend/dist/govuk/assets"),
      path.resolve("./public/assets"),
    );
    console.log("✅ GOV.UK assets copied successfully.");
  } catch (error) {
    console.error("❌ Failed to copy assets:", error);
    process.exit(1);
  }
};

/**
 * Copies selected MOJ assets (e.g. header crest images) into a folder
 * that your SCSS can reference. Adjust the source and destination paths as needed.
 * @async
 * @returns {Promise<void>} Resolves when the assets are copied successfully.
 */
const copyMojAssets = async () => {
  try {
    await fs.copy(
      path.resolve(
        "./node_modules/@ministryofjustice/frontend/moj/assets/images",
      ),
      path.resolve("./public/assets/images"),
    );
    console.log("✅ MOJ assets copied successfully.");
  } catch (error) {
    console.error("❌ Failed to copy MOJ assets:", error);
    process.exit(1);
  }
};

/**
 * List of external dependencies that should not be bundled.
 * @constant {string[]}
 */
const externalModules = [
  ...builtinModules,
  "express",
  "nunjucks",
  "dotenv",
  "cookie-parser",
  "body-parser",
  "express-session",
  "morgan",
  "compression",
  "axios",
  "figlet",
  "csrf-sync",
  "*.node",
];

/**
 * Builds SCSS files.
 * @async
 * @returns {Promise<void>} Resolves when SCSS is compiled successfully.
 */
const buildScss = async () => {
  await esbuild
    .build({
      entryPoints: ["src/scss/main.scss"],
      bundle: true,
      outfile: `public/css/main.${buildNumber}.css`,
      plugins: [
        sassPlugin({
          resolveDir: path.resolve("src/scss"),
          loadPaths: [path.resolve("."), path.resolve("node_modules")],
          publicPath: "/assets",
          /**
           * Transforms SCSS content to update asset paths.
           * @param {string} source - Original SCSS source content.
           * @returns {string} Transformed SCSS with updated asset paths.
           */
          transform: (source) =>
            source
              .replace(
                /url\(["']?\/assets\/fonts\/([^"')]+)["']?\)/g,
                'url("../../node_modules/govuk-frontend/dist/govuk/assets/fonts/$1")',
              )
              .replace(
                /url\(["']?\/assets\/images\/([^"')]+)["']?\)/g,
                'url("../../public/assets/images/$1")',
              ),
        }),
      ],
      loader: {
        ".scss": "css",
        ".woff": "file",
        ".woff2": "file",
        ".png": "file",
        ".jpg": "file",
        ".svg": "file",
      },
      minify: true,
      sourcemap: true,
    })
    .catch((error) => {
      console.error("❌ SCSS build failed:", error);
      process.exit(1);
    });
};

/**
 * Builds `app.js`.
 * @async
 * @returns {Promise<void>} Resolves when `app.js` is bundled successfully.
 */
const buildAppJs = async () => {
  await esbuild
    .build({
      entryPoints: ["src/app.js"],
      bundle: true,
      platform: "node",
      target: "es2020",
      format: "esm",
      sourcemap: true,
      minify: true,
      external: externalModules,
      outfile: "public/app.js",
    })
    .catch((error) => {
      console.error("❌ app.js build failed:", error);
      process.exit(1);
    });
};

/**
 * Builds `custom.js` with a unique build number.
 * @async
 * @returns {Promise<void>} Resolves when `custom.js` is bundled successfully.
 */
const buildCustomJs = async () => {
  await esbuild
    .build({
      entryPoints: ["src/js/custom.js"],
      bundle: true,
      platform: "browser",
      target: "es2020",
      format: "esm",
      sourcemap: true,
      minify: true,
      outfile: `public/js/custom.${buildNumber}.min.js`,
    })
    .catch((error) => {
      console.error("❌ custom.js build failed:", error);
      process.exit(1);
    });
};

/**
 * Builds GOV.UK frontend files separately.
 * @async
 * @returns {Promise<void>} Resolves when `govuk-frontend.js` is copied successfully.
 */
const buildGovukFrontend = async () => {
  await esbuild
    .build({
      entryPoints: [
        "./node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js",
      ],
      bundle: false, // No need to bundle, just copy
      outfile: `public/js/govuk-frontend.${buildNumber}.min.js`,
    })
    .catch((error) => {
      console.error("❌ GOV.UK frontend JS copy failed:", error);
      process.exit(1);
    });
};

/**
 * Builds MOJ frontend files separately.
 * @async
 * @returns {Promise<void>} Resolves when `moj-frontend.js` is copied successfully.
 */
const buildMojFrontend = async () => {
  await esbuild
    .build({
      entryPoints: [
        "./node_modules/@ministryofjustice/frontend/moj/moj-frontend.min.js",
      ],
      bundle: false, // No need to bundle, just copy
      format: "esm",
      outfile: `public/js/moj-frontend.${buildNumber}.min.js`,
    })
    .catch((error) => {
      console.error("❌ MOJ UK frontend JS copy failed:", error);
      process.exit(1);
    });
};

/**
 * Builds Accessible Autocomplete files separately.
 * @async
 * @returns {Promise<void>} Resolves when `acceptable-autocomplete.min.js` is copied successfully.
 */
const buildAccessibleAutocomplete = async () => {
  await esbuild
    .build({
      entryPoints: [
        "./node_modules/accessible-autocomplete/dist/accessible-autocomplete.min.js",
      ],
      bundle: false, // No need to bundle, just copy
      outfile: `public/js/accessible-autocomplete.${buildNumber}.min.js`,
    })
    .catch((error) => {
      console.error("❌ accessible-autocomplete JS copy failed:", error);
      process.exit(1);
    });
};

/**
 * Main build process that compiles SCSS, JavaScript, and copies assets.
 * @async
 * @returns {Promise<void>} Resolves when the entire build process is completed successfully.
 */
const build = async () => {
  try {
    console.log("🚀 Starting build process...");

    // Copy assets
    await copyGovukAssets();
    await copyMojAssets();

    // Build SCSS
    await buildScss();

    // Build JavaScript files in parallel
    await Promise.all([
      buildAppJs(),
      buildCustomJs(),
      buildGovukFrontend(),
      buildMojFrontend(),
      buildAccessibleAutocomplete(),
    ]);

    console.log("✅ Build completed successfully.");
  } catch (error) {
    console.error("❌ Build process failed:", error);
    process.exit(1);
  }
};

// Export the build function
export { build };

// Run build if executed directly from the command line
if (import.meta.url === `file://${process.argv[1]}`) {
  build().catch((error) => {
    console.error("❌ Build script failed:", error);
    process.exit(1);
  });
}
