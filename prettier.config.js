/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  "semi": false,
  "tabWidth": 4,
  "arrowParens": "always",
  "bracketSameLine": false,
};

export default config;
