import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const isProtectedRoute = createRouteMatcher([
    "/subscription",
    "/en/subscription",
    "/zh/subscription",
]);

const intlMiddleware = createMiddleware(routing);

const combinedMiddleware = clerkMiddleware(async (auth, request) => {
    // Skip Clerk auth for webhooks
    if (request.nextUrl.pathname.startsWith("/api/webhooks")) {
        return;
    }

    if (!isProtectedRoute(request)) {
        return intlMiddleware(request);
    }

    await auth.protect();

    return intlMiddleware(request);
});

export default combinedMiddleware;

export const config = {
    matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/(api|trpc)(.*)"],
};
