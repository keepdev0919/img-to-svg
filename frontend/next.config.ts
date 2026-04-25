import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/blog/[slug]": ["./content/**/*"],
    "/[locale]/blog/[slug]": ["./content/**/*"],
  },
};

export default withNextIntl(nextConfig);
