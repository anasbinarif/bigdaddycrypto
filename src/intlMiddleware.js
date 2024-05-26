// intlMiddleware.js
import createMiddleware from 'next-intl/middleware';

function withIntlMiddleware(middleware) {
    const intlMiddleware = createMiddleware({
        locales: ['en', 'de'],
        defaultLocale: 'en'
    });

    return async (request, event, response) => {
        const intlResponse = intlMiddleware(request);
        if (intlResponse) {
            return intlResponse;
        }
        return middleware(request, event, response);
    };
}

export { withIntlMiddleware };
