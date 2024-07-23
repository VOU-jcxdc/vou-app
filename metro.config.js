/* eslint-disable @typescript-eslint/no-var-requires */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.resolver.sourceExts.push('jsx', 'ts', 'tsx');
// config.resolver.assetExts.push("ttf", "png");

module.exports = withNativeWind(config, { input: './global.css' });
