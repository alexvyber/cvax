module.exports = {
  printWidth: 100,
  semi: false,
  arrowParens: "avoid",
  tabWidth: 2,
  useTabs: false,
  trailingComma: "all",
  singleQuote: false,
  bracketSameLine: true,

  plugins: [
    require.resolve("prettier-plugin-astro"),
    require.resolve("prettier-plugin-packagejson"),
    require.resolve("prettier-plugin-tailwindcss"),
  ],

  pluginSearchDirs: ["."],
}
