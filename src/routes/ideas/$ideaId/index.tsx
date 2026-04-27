import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import {
    queryOptions,
    useSuspenseQuery,
    useMutation,
} from "@tanstack/react-query";
import { fetchIdea, deleteIdea } from "@/api/ideas";

const ideaQueryOptions = (ideaId: string) =>
    queryOptions({
        queryKey: ["idea", ideaId],
        queryFn: () => fetchIdea(ideaId),
    });

export const Route = createFileRoute("/ideas/$ideaId/")({
    component: IdeaDetailsPage,
    loader: async ({ params, context: { queryClient } }) => {
        return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
    },
});

function IdeaDetailsPage() {
    const { ideaId } = Route.useParams();
    const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

    const navigate = useNavigate();
    const { user } = useAuth();
    const isOwner = !!user && user.id === idea.user;

    const { mutateAsync: deleteMutate, isPending } = useMutation({
        mutationFn: () => deleteIdea(ideaId),
    });

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete?",
        );
        if (confirmDelete) {
            await deleteMutate();
            navigate({ to: "/ideas" });
        }
    };

    return (
        <div className="p-4">
            <Link to="/ideas" className="text-blue-500 underline block mb-4">
                Back to Ideas
            </Link>
            <h2 className="text-2xl font-bold">{idea.title}</h2>
            <p className="mt-2">{idea.description}</p>
            {isOwner && (
                <div className="flex flex-row space-between items-center mt-4 gap-4">
                    <Link
                        to="/ideas/$ideaId/edit"
                        params={{ ideaId }}
                        className="text-sm bg-transparent border border-green-200! text-green-200 mt-3 px-4 py-2 hover:text-green-500! rounded transition disabled:opacity:50"
                    >
                        Edit
                    </Link>

                    <button
                        className="text-sm bg-transparent border border-green-200! text-green-200 mt-3 px-4 py-2 hover:text-green-500 rounded transition disabled:opacity:50"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            )}
        </div>
    );
}
