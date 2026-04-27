import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
    queryOptions,
} from "@tanstack/react-query";
import { fetchIdea, updateIdea } from "#/api/ideas";

const ideaQueryOptions = (id: string) =>
    queryOptions({
        queryKey: ["idea", id],
        queryFn: () => fetchIdea(id),
    });

export const Route = createFileRoute("/ideas/$ideaId/edit")({
    component: IdeaEditPage,
    loader: async ({ params, context: { queryClient } }) => {
        return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
    },
});

function IdeaEditPage() {
    const { ideaId } = Route.useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));
    const [title, setTitle] = useState(idea.title);
    const [summary, setSummary] = useState(idea.summary);
    const [description, setDescription] = useState(idea.description);
    const [tagsInput, setTagsInput] = useState(idea.tags.join(", "));

    const { mutateAsync, isPending } = useMutation({
        mutationFn: () =>
            updateIdea(ideaId, {
                title,
                summary,
                description,
                tags: tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            }),
        onSuccess: (updatedIdea) => {
            queryClient.setQueryData(["idea", ideaId], updatedIdea);
            queryClient.invalidateQueries({ queryKey: ["ideas"] });
        },
    });

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim() || !summary.trim() || !description.trim()) {
            alert("Please fill in all fields");
            return;
        }
        await mutateAsync();
        navigate({ to: "/ideas/$ideaId", params: { ideaId } });
    };

    return (
        <div className="space-y-6 bg-transparent p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Edit Idea</h1>
                <Link
                    to="/ideas/$ideaId"
                    params={{ ideaId }}
                    className="text-sm text-green-200 hover:text-green-600! font-medium"
                >
                    ← Back To Idea
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-green-200 font-medium mb-1"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-200"
                        placeholder="Enter idea title"
                    />
                </div>
                <div>
                    <label
                        htmlFor="summary"
                        className="block text-green-200 font-medium mb-1"
                    >
                        Summary
                    </label>
                    <input
                        id="summary"
                        type="text"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-200"
                        placeholder="Enter idea summary"
                    />
                </div>

                <div>
                    <label
                        htmlFor="body"
                        className="block text-green-200 font-medium mb-1"
                    >
                        Description
                    </label>
                    <textarea
                        id="body"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-200"
                        placeholder="Write out the description of your idea"
                    />
                </div>

                <div>
                    <label
                        htmlFor="tags"
                        className="block text-green-200 font-medium mb-1"
                    >
                        Tags
                    </label>
                    <input
                        id="tags"
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-200"
                        placeholder="optional tags, comma separated"
                    />
                </div>

                <div className="mt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="block w-full border  border-white bg-transparent text-green-200 hover:text-green-500 font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Updating..." : "Update Idea"}
                    </button>
                </div>
            </form>
        </div>
    );
}
