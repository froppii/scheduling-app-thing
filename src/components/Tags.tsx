import { Note } from "../types/Note";

export default function Tags({ currentNote }: { currentNote?: Note }) {
    if (!currentNote) return null;

    const tags = Array.from(
        new Set(
            currentNote.content
                .split(/\s+/)
                .filter((word) => word.startsWith("#") && word.length > 1)
                .map((tag) => tag.replace(/[^#\w-]/g, ""))
        )
    );

    return (
        <div className="p-2 border-t text-sm">
            <h3 className="text-xs font-bold text-gray-600 mb-1">Tags</h3>
            {tags.length === 0 ? (
                <p className="text-gray-400 italic">No tags found</p>
            ) : (
                <ul className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                        <li
                            key={tag}
                            className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}