/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();



/** @type {import("next").NextConfig} */
const config = {
    images: {
        domains: ['sfobkvglrpnepbnnfzau.supabase.co'],
    },
    transpilePackages: ["@radix-ui/react-tooltip", "@radix-ui/react-dismissable-layer"],
};

export default withNextIntl(config);
