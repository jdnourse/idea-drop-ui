import {
    HeadContent,
    Link,
    Outlet,
    createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient } from "@tanstack/react-query";
import Header from "#/components/Header";

type RouterContext = {
    queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
    head: () => ({
        meta: [
            {
                name: "description",
                content:
                    "Share, explore and build on the best startup ideas and side hustle",
            },
            {
                title: "IdeaDrop - Your Idea Hub",
            },
        ],
    }),
    component: RootLayout,
    notFoundComponent: NotFound,
});

function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <HeadContent />
            <Header />
            <main className="flex justify-center p-6">
                <div className="w-full max-w-4xl rounded-2xl shadow-lg p-8">
                    <Outlet />
                </div>
            </main>
            <TanStackDevtools
                config={{
                    position: "bottom-right",
                }}
                plugins={[
                    {
                        name: "TanStack Router",
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                ]}
            />
        </div>
    );
}

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-100">
            <h1 className="text-4xl font-bold text-green-500 mb-4">404</h1>
            <p className="text-lg text-green-400 mb-6">
                Ooops! The age you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-transparent border border-white text-white, rounded-md hover:bg-green-200 hover:text-green-900 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}
