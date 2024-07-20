import 'dotenv/config';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.coingecko.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'coin-images.coingecko.com',
                pathname: '/**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);