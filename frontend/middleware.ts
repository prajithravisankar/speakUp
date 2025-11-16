import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/auth/login",
    "/auth/signup",
]);

export default clerkMiddleware(async (auth, req) => {
    if (isPublicRoute(req)) return;

    await auth.protect({
        unauthenticatedUrl: new URL("/auth/login", req.url).toString(),
    });
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
