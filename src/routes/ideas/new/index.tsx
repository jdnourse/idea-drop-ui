import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Idea } from "#/types";
import { createIdea } from "@/api/ideas";

export const Route = createFileRoute("/ideas/new/")({
    component: NewIdeaPage,
});

const initialIdea: Idea = {
    _id: "",
    title: "",
    summary: "",
    description: "",
    tags: [],
    createdAt: new Date().toLocaleDateString(),
    user: "",
};

function NewIdeaPage() {
    const navigate = useNavigate();
    const [idea, setIdea] = useState<Idea>(initialIdea);
    const [tagsString, setTagsString] = useState<string>("");
    const { title, summary, description } = idea;

    const { mutateAsync, isPending } = useMutation({
        mutationFn: createIdea,
        onSuccess: () => {
            navigate({ to: "/ideas" });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !summary.trim() || !description.trim()) {
            alert("Please fill in all fields");
            return;
        }
        const parsedTags = tagsString
            .split(",")
            .map((t) => t.trim())
            .filter((tag) => tag !== "");
        try {
            await mutateAsync({
                title,
                summary,
                description,
                tags: parsedTags,
            });
        } catch (error) {
            console.error("Error creating idea:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="space-y-6 bg-transparent p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Create New Idea</h1>
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
                        onChange={(e) =>
                            setIdea({ ...idea, title: e.target.value })
                        }
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
                        onChange={(e) =>
                            setIdea({ ...idea, summary: e.target.value })
                        }
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
                        onChange={(e) =>
                            setIdea({ ...idea, description: e.target.value })
                        }
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
                        value={tagsString}
                        onChange={(e) => setTagsString(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-200"
                        placeholder="optional tags, comma separated"
                    />
                </div>

                <div className="mt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="block w-full border border-white bg-transparent text-green-200 hover:text-green-500 font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "Creating..." : "Create Idea"}
                    </button>
                </div>
            </form>
        </div>
    );
}
