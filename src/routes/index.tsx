import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { fetchIdeas } from "#/api/ideas";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import IdeaCard from "#/components/IdeaCard";

const ideasQueryOptions = queryOptions({
    queryKey: ["ideas", { limit: 3 }],
    queryFn: () => fetchIdeas(3),
});

export const Route = createFileRoute("/")({
    component: HomePage,
    loader: ({ context }) =>
        context.queryClient.ensureQueryData(ideasQueryOptions),
});

function HomePage() {
    const { data: ideas } = useSuspenseQuery(ideasQueryOptions);
    // const latestIdeas = [...data]
    //     .sort(
    //         (a, b) =>
    //             new Date(b.createdAt).getTime() -
    //             new Date(a.createdAt).getTime(),
    //     )
    //     .slice(0, 3);

    return (
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 p-6 text-blue-600">
            <div className="flex flex-col items-start gap-4">
                <Lightbulb className="w-16 h-16 text-yellow-400" />
                <h1 className="text-4xl font-bold text-white">
                    Welcome to IdeaDrop
                </h1>
                <p className="text-gray-600 max-w-xs">
                    Share, explore, and build on the best startup ideas and side
                    hustles.
                </p>
            </div>

            <section className="flex-1">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                    Latest Ideas
                </h2>
                <div className="space-y-6">
                    {ideas.map((idea) => (
                        <IdeaCard key={idea._id} idea={idea} button={false} />
                    ))}
                </div>

                <Link
                    to="/ideas"
                    className="mt-5 w-full text-center inline-block border border-white bg-transparent text-green-200 hover:text-green-500 font-semibold px-5 py-2 rounded-md transition"
                >
                    View All Ideas
                </Link>
            </section>
        </div>
    );
}
