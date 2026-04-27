import type { Idea } from "#/types";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

const IdeaCard = ({
    idea,
    button = true,
}: {
    idea: Idea;
    button?: boolean;
}) => {
    const linkClasses = clsx({
        "hover:text-green-400! font-medium transition px-1 py-3 leading-none":
            !button,
        "mt-5 w-full text-center inline-block border border-white bg-transparent text-green-200 hover:text-green-500 font-semibold px-5 py-2 rounded-md transition":
            button,
    });

    return (
        <div className="border border-[--sea-ink-soft] p-4 rounded shadow bg-white/10 backdrop-blur-sm flex flex-col justify-between text-white">
            <div className="">
                <h2 className="text-lg font-semibold"> {idea.title}</h2>
                <p className="text-white/70 mt-2">{idea.summary}</p>
            </div>
            <Link
                to={"/ideas/$ideaId"}
                params={{ ideaId: idea._id.toString() }}
                className={linkClasses}
            >
                {!button ? "Read More →" : "View Idea"}
            </Link>
        </div>
    );
};

export default IdeaCard;
