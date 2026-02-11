const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable package exports resolution for better-auth
config.resolver.unstable_enablePackageExports = true;

// Add asset resolution
config.resolver.assetExts.push(
	// Image formats
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"svg",
	// Font formats
	"ttf",
	"otf",
	"woff",
	"woff2",
);

const uniwindConfig = withUniwindConfig(config, {
	cssEntryFile: "./global.css",
	dtsFile: "./uniwind-types.d.ts",
});

module.exports = uniwindConfig;
